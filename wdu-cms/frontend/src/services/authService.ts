import api from './api';

export interface LoginResponse {
  accessToken: string;
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
    return data;
  },
  
  logout: () => {
    // Fire and forget the backend logout request
    api.post('/auth/logout').catch(() => {});
    
    // Clear ALL security and session data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('admin_user');
    sessionStorage.clear();
    
    // Redirect immediately to clear the context state
    window.location.href = '/admin/login';
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  refresh: async () => {
    // Cookie is handled automatically by browser due to withCredentials: true
    const { data } = await api.post('/auth/refresh');
    return data;
  }
};
