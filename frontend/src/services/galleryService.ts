import api from './api';

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  isActive?: boolean;
  order: number;
  createdAt: string;
}

const STORAGE_KEY = 'wdu_gallery';

const defaultGallery: GalleryImage[] = [
  { id: '1', title: 'Survey Team Field Work', url: 'https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&q=80', isActive: true, order: 1, createdAt: new Date().toISOString() },
  { id: '2', title: 'Data Analysis Center', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80', isActive: true, order: 2, createdAt: new Date().toISOString() },
  { id: '3', title: 'Office Building WDU', url: 'https://sis.wahanadata.co.id/img/wdu-building.jpg', isActive: true, order: 3, createdAt: new Date().toISOString() },
  { id: '4', title: 'Meeting with Clients', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80', isActive: true, order: 4, createdAt: new Date().toISOString() }
];

export const galleryService = {
  async getAll() {
    try {
      const response = await api.get<GalleryImage[]>('/gallery');
      if (response.data && response.data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        return { data: response.data };
      }
      
      const stored = localStorage.getItem(STORAGE_KEY);
      return { data: stored ? JSON.parse(stored) : defaultGallery };
    } catch (error) {
      console.error('Failed to fetch gallery images from API:', error);
      const stored = localStorage.getItem(STORAGE_KEY);
      return { data: stored ? JSON.parse(stored) : defaultGallery };
    }
  },

  async add(image: Omit<GalleryImage, 'id' | 'createdAt'>) {
    try {
      const response = await api.post<GalleryImage>('/gallery', image);
      await this.getAll();
      return { data: response.data };
    } catch (error) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultGallery));
      const newImg = { ...image, id: Date.now().toString(), createdAt: new Date().toISOString() } as GalleryImage;
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, newImg]));
      return { data: newImg };
    }
  },

  async update(id: string, updates: Partial<GalleryImage>) {
    try {
      const response = await api.put<GalleryImage>(`/gallery/${id}`, updates);
      await this.getAll();
      return { data: response.data, success: true };
    } catch (error) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultGallery));
      const updated = stored.map((img: any) => img.id === id ? { ...img, ...updates } : img);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    }
  },

  async delete(id: string) {
    try {
      await api.delete(`/gallery/${id}`);
      await this.getAll();
      return { success: true };
    } catch (error) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultGallery));
      const filtered = stored.filter((img: any) => img.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return { success: true };
    }
  },

  async reorder(items: { id: string, order: number }[]) {
    try {
      await api.post('/gallery/reorder', { items });
      return { success: true };
    } catch (error) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultGallery));
      const updated = [...stored];
      items.forEach(item => {
        const found = updated.find(i => i.id === item.id);
        if (found) found.order = item.order;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.sort((a,b) => a.order - b.order)));
      return { success: true };
    }
  },

  async resetToDefault() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGallery));
    return { data: defaultGallery };
  }
};
