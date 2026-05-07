import api from './api';

export interface ClientLogo {
  id: string;
  name: string;
  url: string;
  isActive?: boolean;
  order?: number;
  createdAt: string;
}

const STORAGE_KEY = 'wdu_clients';

const defaultClients: ClientLogo[] = [
  { id: '1', name: 'Otoritas Jasa Keuangan', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/ojk-qzsnm4azwliooo9bxr00atqdptuufbguuyqsnnofzw.png', isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Komisi Pemberantasan Korupsi', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kpk-qzsnm3d5prhed2ap38ldqbyx4fzh7md4iu3b6dpu64.png', isActive: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Pemerintah Kota Bogor', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kota-bogor-qzsnm2fbixg41gc28q6r5u7gj243zx9e6pftp3r8cc.png', isActive: true, createdAt: new Date().toISOString() },
  { id: '4', name: 'Kementerian Lingkungan Hidup', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/klh-qzsnm0jn59dje8esjpdi0uojcaddkj1xig4uqju0os.png', isActive: true, createdAt: new Date().toISOString() }
];

export const clientService = {
  async getAll() {
    try {
      const response = await api.get<ClientLogo[]>('/clients');
      if (response.data && response.data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        return { data: response.data };
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      return { data: stored ? JSON.parse(stored) : defaultClients };
    } catch (error) {
      console.error('Failed to fetch clients from API:', error);
      const stored = localStorage.getItem(STORAGE_KEY);
      return { data: stored ? JSON.parse(stored) : defaultClients };
    }
  },

  async add(client: Omit<ClientLogo, 'id' | 'createdAt'>) {
    try {
      const response = await api.post<ClientLogo>('/clients', client);
      await this.getAll();
      return { data: response.data };
    } catch (error) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultClients));
      const newClient = { ...client, id: Date.now().toString(), createdAt: new Date().toISOString() } as ClientLogo;
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, newClient]));
      return { data: newClient };
    }
  },

  async delete(id: string) {
    try {
      await api.delete(`/clients/${id}`);
      await this.getAll();
      return { success: true };
    } catch (error) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultClients));
      const filtered = stored.filter((c: any) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return { success: true };
    }
  },

  async resetToDefault() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultClients));
    return { data: defaultClients };
  },

  async reorder(items: { id: string, order: number }[]) {
    try {
      await api.post('/clients/reorder', { items });
      await this.getAll();
    } catch (error) {
      console.warn('Reorder API failed, using local fallback');
    }
  }
};
