import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.DEV
  ? '/api'
  : 'https://scec-server.onrender.com/api',
  withCredentials: true, // send httpOnly cookie
  headers: { 'Content-Type': 'application/json' },
});

// Attach bearer token from localStorage as fallback (in case cookies are blocked)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pim_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handler — redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/admin/login')) {
      localStorage.removeItem('pim_token');
      localStorage.removeItem('pim_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
