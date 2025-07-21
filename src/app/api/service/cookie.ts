export const setCookie = (name: string, value: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=${value}; path=/`;
  }
}

export const getCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    const value = document.cookie.split(`${name}=`)[1];
    return value ? value.split(';')[0] : null;
  }
  return null;
}

export const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export const deleteAllCookies = () => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      const cookieName = cookie[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; domain=.bnect.pro; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }
  }
}