import api from './api';

export interface ExperiencePartner {
  id: string;
  year: string;
  logoUrl: string;
  order?: number;
  createdAt?: string;
}

const STORAGE_KEY = 'wdu_experience_partners';

const defaultPartners: ExperiencePartner[] = [
  { "id": "seed-0", "year": "2024", "logoUrl": "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/ojk-qzsnm4azwliooo9bxr00atqdptuufbguuyqsnnofzw.png", "order": 0, "createdAt": "2026-05-01T12:00:00Z" },
  { "id": "seed-1", "year": "2023", "logoUrl": "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kpk-qzsnm3d5prhed2ap38ldqbyx4fzh7md4iu3b6dpu64.png", "order": 1, "createdAt": "2026-05-01T12:00:00Z" },
  { "id": "seed-2", "year": "2022", "logoUrl": "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kota-bogor-qzsnm2fbixg41gc28q6r5u7gj243zx9e6pftp3r8cc.png", "order": 2, "createdAt": "2026-05-01T12:00:00Z" },
  { "id": "seed-3", "year": "2021", "logoUrl": "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/klh-qzsnm0jn59dje8esjpdi0uojcaddkj1xig4uqju0os.png", "order": 3, "createdAt": "2026-05-01T12:00:00Z" },
  { "id": "seed-4", "year": "2020", "logoUrl": "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenristek-qzsnlzlsyfc92mg5p6yvgcx2qwi0cty76bhd99vev0.png", "order": 4, "createdAt": "2026-05-01T12:00:00Z" },
  { "id": "seed-5", "year": "2024", "logoUrl": "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenkopukm-qzsnlxq4kr9ofeiw065mbde5k4r9xfqqi26eapy77g.png", "order": 5, "createdAt": "2026-05-01T12:00:00Z" },
  { "id": "seed-6", "year": "2023", "logoUrl": "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemendesa-qzsnlxq4kr9ofeiw065mbde5k4r9xfqqi26eapy77g.png", "order": 6, "createdAt": "2026-05-01T12:00:00Z" },
  { "id": "seed-7", "year": "2022", "logoUrl": "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/jakarta-qzsnlwsadx8e3sk95nqzqvmoyqvwpqn05xiwtfzldo.png", "order": 7, "createdAt": "2026-05-01T12:00:00Z" }
];

export const experiencePartnerService = {
  async getAll() {
    try {
      const response = await api.get<ExperiencePartner[]>('/experience-partners');
      if (response.data && response.data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        return { data: response.data };
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      return { data: stored ? JSON.parse(stored) : defaultPartners };
    } catch (error) {
      console.error('API Error in getAll:', error);
      const stored = localStorage.getItem(STORAGE_KEY);
      return { data: stored ? JSON.parse(stored) : defaultPartners };
    }
  },

  async create(data: Partial<ExperiencePartner>) {
    // 1. Get current data
    const storedStr = localStorage.getItem(STORAGE_KEY);
    const currentData = storedStr ? JSON.parse(storedStr) : [...defaultPartners];
    
    // 2. Create new partner object
    const newPartner = { 
      ...data, 
      id: `local-${Date.now()}`, 
      createdAt: new Date().toISOString() 
    } as ExperiencePartner;
    
    // 3. Optimistic Update localStorage
    const updatedData = [...currentData, newPartner];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    try {
      // 4. Try API
      const response = await api.post<ExperiencePartner>('/experience-partners', data);
      // If success, we should ideally replace the local ID with server ID
      // but for simplicity, we'll just re-fetch
      await this.getAll();
      return { data: response.data };
    } catch (error) {
      console.warn('Using local storage for creation fallback');
      return { data: newPartner };
    }
  },

  async update(id: string, data: Partial<ExperiencePartner>) {
    const storedStr = localStorage.getItem(STORAGE_KEY);
    const currentData = storedStr ? JSON.parse(storedStr) : [...defaultPartners];
    const updatedData = currentData.map((p: any) => p.id === id ? { ...p, ...data } : p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    try {
      const response = await api.put<ExperiencePartner>(`/experience-partners/${id}`, data);
      await this.getAll();
      return { data: response.data };
    } catch (error) {
      return { success: true };
    }
  },

  async delete(id: string) {
    const storedStr = localStorage.getItem(STORAGE_KEY);
    const currentData = storedStr ? JSON.parse(storedStr) : [...defaultPartners];
    const filteredData = currentData.filter((p: any) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));

    try {
      await api.delete(`/experience-partners/${id}`);
      await this.getAll();
      return { success: true };
    } catch (error) {
      return { success: true };
    }
  },

  async resetToDefault() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPartners));
    return { data: defaultPartners };
  },

  async reorder(items: { id: string, order: number }[]) {
    try {
      await api.post('/experience-partners/reorder', { items });
      await this.getAll();
    } catch (error) {
      console.warn('Reorder API failed for experience partners, using local storage fallback');
    }
  }
};
