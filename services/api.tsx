import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
});

api.interceptors.request.use((config) => {
  const token = getCookie('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('error.response: ', error.response);
    
    if (error.response?.status === 401) {
      deleteCookie('token');
      deleteCookie('user');

      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/login?expired=true';
        }
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default api;
