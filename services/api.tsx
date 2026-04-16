import { showGlobalBlocker, hideGlobalBlocker } from '@/components/ui/loading-blocker';

import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let pendingRequests = 0;

api.interceptors.request.use((config) => {
  const skipLoader = config.headers?.['x-skip-loader'] === 'true';
  (config as any).__skipGlobalLoader = skipLoader;

  if (!skipLoader) {
    pendingRequests += 1;
    showGlobalBlocker();
  }

  const token = getCookie('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (!(response.config as any).__skipGlobalLoader) {
      pendingRequests = Math.max(pendingRequests - 1, 0);
      hideGlobalBlocker(pendingRequests);
    }

    return response;
  },
  (error) => {
    if (!(error.config as any)?.__skipGlobalLoader) {
      pendingRequests = Math.max(pendingRequests - 1, 0);
      hideGlobalBlocker(pendingRequests);
    }

    console.log('error.response: ', error.response);

    if (error.response?.status === 401) {
      deleteCookie('token');

      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
