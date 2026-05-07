import api from './api';

export interface SiteConfig {
  key: string;
  value: string;
  description: string;
}

const STORAGE_KEY = 'wdu_config';

const getLocalConfig = (): SiteConfig[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [
    { key: 'site_title', value: 'Wahana Data Utama', description: 'Nama Website' },
    { key: 'contact_email', value: 'info@wahanadata.co.id', description: 'Email Kontak Utama' },
    { key: 'phone', value: '(0251) 1234567', description: 'Nomor Telepon Kantor' },
    { key: 'office_address', value: 'Bogor, Jawa Barat', description: 'Alamat Kantor' },
    { key: 'copyright', value: '© 2026 Wahana Data Utama. All rights reserved.', description: 'Teks Copyright Footer' },
    { key: 'company_profile_url', value: '', description: 'URL Company Profile (PDF)' },
    { key: 'social_facebook', value: '', description: 'Link Facebook' },
    { key: 'social_instagram', value: '', description: 'Link Instagram' },
    { key: 'social_twitter', value: '', description: 'Link Twitter' },
    { key: 'social_linkedin', value: '', description: 'Link LinkedIn' }
  ];
};

export const siteConfigService = {
  getAll: async () => {
    try {
      const { data } = await api.get<SiteConfig[]>('/config');
      return { data };
    } catch (e) {
      return { data: getLocalConfig() };
    }
  },

  update: async (key: string, value: string) => {
    try {
      return await api.put(`/config/${key}`, { value });
    } catch (e) {
      const configs = getLocalConfig();
      const updated = configs.map(c => c.key === key ? { ...c, value } : c);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    }
  }
};
