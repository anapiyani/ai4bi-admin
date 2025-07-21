import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { getCookie, setCookie } from './cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getCookie('access_token')}`,
  },
});

const axiosRefreshInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getCookie('access_token')}`,
  },
});

axiosInstance.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = getCookie('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: AxiosResponse<any>) => void;
  reject: (error: any) => void;
}> = [];


const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve({ data: token } as AxiosResponse);
    }
  });
  failedQueue = [];
};


export const refreshToken = async (): Promise<void> => {
  try {
    const refresh_token = getCookie('refresh_token');
    if (!refresh_token) throw new Error('No refresh token available');
  } catch (error: any) {
    throw error;
  }
};

// Add an event listener to capture token updates from WebView
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'token_refreshed') {
      const { access_token } = event.data;
      if (access_token) {
        console.log('Received new access token from native app');
      }
    }
  });
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
              .then(() => {
                const token = getCookie('access_token');
                if (token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return axiosInstance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            console.log("Attempting token refresh...");
            await refreshToken();
            const newToken = getCookie('access_token');
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            }
            processQueue(null);
            resolve(axiosInstance(originalRequest));
          } catch (refreshError) {
            console.error("Token refresh failed in interceptor:", refreshError);
            processQueue(refreshError, null);
            reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        });
      }

      return Promise.reject(error);
    }
);

async function apiCall<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryCount: number = 0
): Promise<T> {
  const MAX_RETRIES = 3;

  try {
    let response: AxiosResponse<T>;

    switch (method) {
      case 'GET':
        response = await axiosInstance.get<T>(url, config);
        break;
      case 'POST':
        response = await axiosInstance.post<T>(url, data, config);
        break;
      case 'PUT':
        response = await axiosInstance.put<T>(url, data, config);
        break;
      case 'PATCH':
        response = await axiosInstance.patch<T>(url, data, config);
        break;
      case 'DELETE':
        response = await axiosInstance.delete<T>(url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error: any) {
    if (retryCount >= MAX_RETRIES) {
      throw new Error(error.response?.data?.message || error.message);
    }

    if (error.response?.status === 403 || error.response?.status === 401) {
      try {
        await refreshToken();
        return apiCall(method, url, data, config, retryCount + 1);
      } catch (refreshError: any) {
        throw new Error(refreshError.response?.data?.message || refreshError.message);
      }
    }

    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
}

export const get = <T>(url: string, config?: AxiosRequestConfig) =>
    apiCall<T>('GET', url, undefined, config);

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiCall<T>('POST', url, data, config);

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiCall<T>('PUT', url, data, config);

export const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiCall<T>('PATCH', url, data, config);

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
    apiCall<T>('DELETE', url, undefined, config);


interface BnectVerifyResponse {
  access_token: string;
  refresh_token: string;
}

export const verifyBnectToken = async (access_token: string): Promise<BnectVerifyResponse> => {
  try {
    console.log("Verifying Bnect token with backend...");
    const response = await axiosInstance.post<BnectVerifyResponse>('/bnect-verify', {
      access_token
    });

    console.log("Successfully verified Bnect token");
    return response.data;
  } catch (error) {
    console.error("Error verifying Bnect token:", error);
    throw error;
  }
};

interface ChatIdResponse {
  chat_id: string;
}

export const getChatIdByPortalId = async (portalId: string): Promise<string | null> => {
  if (!portalId) {
    console.error("Cannot fetch chat_id: portalId is empty");
    return null;
  }

  try {
    console.log(`Fetching chat_id for portal_id: ${portalId}`);
    const response = await axios.get<ChatIdResponse>(
        `https://gtw.bnect.pro/chat/chats/?portal_id=${encodeURIComponent(portalId)}`
    );

    if (response.data && response.data.chat_id) {
      console.log(`Successfully retrieved chat_id: ${response.data.chat_id}`);
      return response.data.chat_id;
    } else {
      console.error('No chat_id found in response:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching chat_id:', error);
    return null;
  }
};