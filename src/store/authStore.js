import { create } from 'zustand';
import { authAPI, userAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { access_token } = response.data;

      localStorage.setItem('access_token', access_token);

      // Fetch user profile
      const profileResponse = await userAPI.getProfile();
      set({
        user: profileResponse.data,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.register(userData);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Registration failed',
        isLoading: false,
      });
      return false;
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem('access_token');
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Load user from token
  loadUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await userAPI.getProfile();
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('access_token');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
