import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let pendingRequests = 0;

function showGlobalBlocker() {
  if (typeof window === 'undefined') return;

  let blocker = document.getElementById('global-blocker');
  if (!blocker) {
    blocker = document.createElement('div');
    blocker.id = 'global-blocker';
    blocker.style.position = 'fixed';
    blocker.style.top = '0';
    blocker.style.left = '0';
    blocker.style.width = '100vw';
    blocker.style.height = '100vh';
    blocker.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    blocker.style.zIndex = '9999';
    blocker.style.cursor = 'wait';
    blocker.style.pointerEvents = 'all';
    document.body.appendChild(blocker);
  }
}

function hideGlobalBlocker() {
  const blocker = document.getElementById('global-blocker');
  if (blocker && pendingRequests === 0) {
    blocker.remove();
  }
}

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
    hideGlobalBlocker();
    return response;
  },
  (error) => {
    pendingRequests = Math.max(pendingRequests - 1, 0);
    hideGlobalBlocker();

    console.log('error.response: ', error.response);

    if (error.response?.status === 401) {
      deleteCookie('token');
      deleteCookie('user');

      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default api;
