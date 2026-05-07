import api from './api';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'wdu_messages';

const getLocalMessages = (): ContactMessage[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [
    { id: '1', name: 'Budi Santoso', email: 'budi@example.com', subject: 'Inquiry Layanan', message: 'Saya tertarik dengan layanan riset pasar Anda.', isRead: false, createdAt: new Date().toISOString() },
    { id: '2', name: 'Siti Aminah', email: 'siti@example.com', subject: 'Kerjasama', message: 'Apakah WDU membuka peluang partnership?', isRead: true, createdAt: new Date().toISOString() }
  ];
};

const saveLocalMessages = (messages: ContactMessage[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

export const contactService = {
  getAll: async () => {
    try {
      const { data } = await api.get<ContactMessage[]>('/contact/messages');
      if (data) {
        saveLocalMessages(data);
        return { data };
      }
    } catch (e) {
      console.warn('API Offline, using local messages');
    }
    return { data: getLocalMessages() };
  },

  send: async (formData: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>) => {
    try {
      return await api.post('/contact', formData);
    } catch (e) {
      const messages = getLocalMessages();
      const newMessage = { 
        ...formData, 
        id: Math.random().toString(36).substr(2, 9), 
        isRead: false, 
        createdAt: new Date().toISOString() 
      } as ContactMessage;
      saveLocalMessages([newMessage, ...messages]);
      return { data: newMessage };
    }
  },

  markAsRead: async (id: string) => {
    try {
      return await api.patch(`/contact/messages/${id}/read`);
    } catch (e) {
      const messages = getLocalMessages();
      const updated = messages.map(m => m.id === id ? { ...m, isRead: true } : m);
      saveLocalMessages(updated);
      return { success: true };
    }
  },

  delete: async (id: string) => {
    try {
      return await api.delete(`/contact/messages/${id}`);
    } catch (e) {
      const messages = getLocalMessages();
      const updated = messages.filter(m => m.id !== id);
      saveLocalMessages(updated);
      return { success: true };
    }
  },
};
