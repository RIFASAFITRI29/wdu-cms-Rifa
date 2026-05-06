import api from './api';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'wdu_services';

const defaultServices: Service[] = [
  { id: '1', title: 'Riset Pasar', description: 'Jelajahi peluang baru dan pahami tren pasar dengan riset pasar yang mendalam.', icon: 'bar_chart', isActive: true, order: 1 },
  { id: '2', title: 'Riset Data', description: 'Pengolahan data primer dan sekunder untuk menghasilkan wawasan strategis.', icon: 'database', isActive: true, order: 2 },
  { id: '3', title: 'Analisis Data', description: 'Transformasi raw data menjadi aset strategis melalui pemrosesan dan validasi tingkat lanjut.', icon: 'analytics', isActive: true, order: 3 },
  { id: '4', title: 'Survei', description: 'Pengumpulan data lapangan yang akurat dengan metodologi ilmiah yang teruji.', icon: 'poll', isActive: true, order: 4 },
  { id: '5', title: 'Event Organizer', description: 'Penyelenggaraan acara profesional yang berfokus pada detail dan dampak yang berkesan.', icon: 'event', isActive: true, order: 5 },
  { id: '6', title: 'Konsultasi IT', description: 'Konsultasi teknologi strategis untuk mengoptimalkan infrastruktur digital bisnis Anda.', icon: 'terminal', isActive: true, order: 6 },
];

export const serviceDataService = {
  async getAll() {
    try {
      const res = await api.get<Service[]>('/services');
      if (res.data && res.data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        return { data: res.data };
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      return { data: stored ? JSON.parse(stored) : defaultServices };
    } catch (e) {
      const stored = localStorage.getItem(STORAGE_KEY);
      return { data: stored ? JSON.parse(stored) : defaultServices };
    }
  },

  async create(data: Partial<Service>) {
    const current = await this.getAll();
    const services = current.data || [];
    const newService = { ...data, id: `local-${Date.now()}` } as Service;
    const updated = [...services, newService];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      const res = await api.post<Service>('/services', data);
      await this.getAll();
      return { data: res.data };
    } catch (e) {
      return { data: newService };
    }
  },

  async update(id: string, data: Partial<Service>) {
    const current = await this.getAll();
    const services = current.data || [];
    const updated = services.map((s: Service) => s.id === id ? { ...s, ...data } : s);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      const res = await api.put<Service>(`/services/${id}`, data);
      await this.getAll();
      return { data: res.data };
    } catch (e) {
      return { success: true };
    }
  },

  async delete(id: string) {
    const current = await this.getAll();
    const services = current.data || [];
    const updated = services.filter((s: Service) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      await api.delete(`/services/${id}`);
      await this.getAll();
      return { success: true };
    } catch (error) {
      return { success: true };
    }
  }
};
