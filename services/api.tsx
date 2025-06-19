import { hideGlobalBlocker, showGlobalBlocker } from '@/components/ui/loading-blocker';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let pendingRequests = 0;

api.interceptors.request.use((config) => {
  pendingRequests += 1;
  showGlobalBlocker();

  const token = getCookie('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    pendingRequests = Math.max(pendingRequests - 1, 0);
    setTimeout(() => {
      hideGlobalBlocker(pendingRequests);
    }, 2000);

    return response;
  },
  (error) => {
    pendingRequests = Math.max(pendingRequests - 1, 0);
    hideGlobalBlocker(pendingRequests);

    console.log('error.response: ', error.response);

    if (error.response?.status === 401) {
      deleteCookie('token');

      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default api;
