'use server'
import axios from "axios";
import { cookies } from "next/headers";

export const login_api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BACKEND_URL ,
  timeout: 5000,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ,
  timeout: 5000,
})

export const record_api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RECORD_URL,
  timeout: 5000,
})

record_api.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, async (error) => {
  console.log(error);
});

api.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, async (error) => {
    console.log(error);
})