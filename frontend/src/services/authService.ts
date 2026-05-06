import api from './api';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout error
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/admin/login';
    }
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  refresh: async (refreshToken: string) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  }
};
