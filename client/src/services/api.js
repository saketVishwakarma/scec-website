import axios from 'axios';

const BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://scecallahabad.onrender.com/api';  // ← your Render URL

const api = axios.create({
  baseURL:         BASE_URL,
  withCredentials: true,   // ← keep true
  headers:         { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pim_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
