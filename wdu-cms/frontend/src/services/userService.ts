import api from './api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'SUPER_ADMIN' | 'EDITOR';
  createdAt: string;
}

const STORAGE_KEY = 'wdu_admin_users';

const getLocalUsers = (): AdminUser[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [
    { id: '1', name: 'Administrator', email: 'admin@wdu.co.id', role: 'SUPER_ADMIN', createdAt: new Date().toISOString() }
  ];
};

export const userService = {
  getAll: async () => {
    try {
      const { data } = await api.get<AdminUser[]>('/users');
      return { data };
    } catch (e) {
      return { data: getLocalUsers() };
    }
  },

  create: async (data: Partial<AdminUser>) => {
    try {
      return await api.post<AdminUser>('/users', data);
    } catch (e) {
      const users = getLocalUsers();
      const newUser = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() } as AdminUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...users, newUser]));
      return { data: newUser };
    }
  },

  update: async (id: string, data: Partial<AdminUser>) => {
    try {
      return await api.put<AdminUser>(`/users/${id}`, data);
    } catch (e) {
      const users = getLocalUsers();
      const updated = users.map(u => u.id === id ? { ...u, ...data } as AdminUser : u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { data: updated.find(u => u.id === id) };
    }
  },

  delete: async (id: string) => {
    try {
      return await api.delete(`/users/${id}`);
    } catch (e) {
      const users = getLocalUsers();
      const updated = users.filter(u => u.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    }
  }
};
