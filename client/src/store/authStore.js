import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  user: authService.getStoredUser(),
  isLoading: false,
  isAuthenticated: !!authService.getStoredUser(),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(email, password);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await authService.logout().catch(() => {});
    set({ user: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true });
      return user;
    } catch {
      set({ user: null, isAuthenticated: false });
      return null;
    }
  },

  isSuperAdmin: () => get().user?.role === 'superadmin',
}));
