import api from './api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('pim_token', data.token);
      localStorage.setItem('pim_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('pim_token');
    localStorage.removeItem('pim_user');
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data.user;
  },

  changePassword: async (currentPassword, newPassword) => {
    const { data } = await api.put('/auth/change-password', { currentPassword, newPassword });
    return data;
  },

  getStoredUser: () => {
    const raw = localStorage.getItem('pim_user');
    return raw ? JSON.parse(raw) : null;
  },
};
