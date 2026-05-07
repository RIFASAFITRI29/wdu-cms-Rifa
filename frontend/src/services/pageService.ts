import api from './api';

// Page service for managing site content via Backend API

export interface PageSection {
  id: string;
  title: string;
  slug: string;
  content?: string;
  sections?: Record<string, any>;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  phone?: string;
  email?: string;
  address?: string;
  mapsUrl?: string;
  updatedAt: string;
}

const STORAGE_KEY = 'wdu_pages';

const defaultPages: PageSection[] = [
  {
    id: '1',
    title: 'Halaman Beranda',
    slug: 'home',
    sections: {
      hero: {
        title: 'Data Terpadu, Solusi Cerdas | Hasil Maksimal',
        subtitle: 'Intelligence Data',
        content: 'Percayakan kebutuhan riset, analisis data, dan teknologi kepada Wahana Data Utama.'
      },
      intro: {
        title: 'Selamat Datang di Wahana Data Utama',
        content: 'Sejak 2006, kami telah menjadi mitra terpercaya bagi instansi pemerintah dan perusahaan swasta.'
      }
    },
    seoTitle: 'Wahana Data Utama - Intelligence Data Solutions',
    seoDescription: 'Mitra terpercaya untuk riset dan analisis data strategis di Indonesia.',
    isPublished: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Tentang Kami',
    slug: 'about',
    sections: {
      intro: {
        title: 'Memiliki pengalaman yang luas serta didukung oleh tim profesional.',
        content: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik.'
      }
    },
    seoTitle: 'Tentang Kami - Wahana Data Utama',
    seoDescription: 'Pelajari lebih lanjut mengenai perjalanan dan visi Wahana Data Utama.',
    isPublished: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Layanan Utama',
    slug: 'services',
    sections: {
      intro: {
        title: 'Solusi Data Intelijen & Strategi Bisnis',
        content: 'Kami menyediakan berbagai layanan riset dan analisis data tingkat lanjut untuk membantu transformasi digital Anda.'
      }
    },
    seoTitle: 'Layanan Kami - Wahana Data Utama',
    isPublished: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Pengalaman & Jejak',
    slug: 'experience',
    sections: {
      hero: {
        title: 'Pengalaman Kami',
        subtitle: 'Jejak Langkah & Kolaborasi'
      },
      dedication: {
        title: 'Dedikasi Terhitung Sejak Tahun 2006',
        content: 'Perjalanan panjang kami dalam mengelola data strategis nasional.'
      }
    },
    isPublished: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Hubungi Kami',
    slug: 'contact',
    sections: {
      intro: {
        title: 'Mari Mulai Kolaborasi Strategis Anda',
        content: 'Tim pakar kami siap membantu merancang solusi berbasis data yang tepat untuk organisasi Anda.'
      }
    },
    isPublished: true,
    updatedAt: new Date().toISOString()
  }
];

export const pageService = {
  async getAll() {
    try {
      const { data } = await api.get('/pages');
      // If API works and has data, use it. But don't delete local storage yet.
      if (data && Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return { data };
      }
      
      // Fallback to local storage if API is empty or fails
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { data: JSON.parse(stored) as PageSection[] };
      return { data: data || [] };
    } catch (error) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { data: JSON.parse(stored) as PageSection[] };
      return { data: [] };
    }
  },

  async getBySlug(slug: string) {
    try {
      const { data } = await api.get<PageSection>(`/pages/${slug}`);
      return { data };
    } catch (error) {
      const response = await pageService.getAll();
      const pages = response.data || [];
      const page = pages.find((p: PageSection) => p.slug === slug);
      return { data: page || null };
    }
  },

  async update(slug: string, updates: Partial<PageSection>) {
    try {
      const { data } = await api.put<PageSection>(`/pages/${slug}`, updates);
      // Sync local storage on success too
      await pageService.getAll();
      return { data };
    } catch (error) {
      const response = await pageService.getAll();
      const pages = response.data || [];
      const updated = pages.map((p: PageSection) => 
        p.slug === slug ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    }
  },

  async publish(slug: string) {
    const { data } = await api.patch(`/pages/${slug}/publish`);
    return data;
  },

  async create(pageData: Partial<PageSection>) {
    try {
      const { data } = await api.post<PageSection>('/pages', pageData);
      return { data };
    } catch (error) {
      const response = await pageService.getAll();
      const pages = response.data || [];
      const newPage = { 
        ...pageData, 
        id: Math.random().toString(36).substr(2, 9),
        updatedAt: new Date().toISOString() 
      } as PageSection;
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...pages, newPage]));
      return { data: newPage };
    }
  },

  async delete(slug: string) {
    try {
      await api.delete(`/pages/${slug}`);
      return { success: true };
    } catch (error) {
      const response = await pageService.getAll();
      const pages = response.data || [];
      const filtered = pages.filter((p: PageSection) => p.slug !== slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return { success: true };
    }
  },

  async resetAll() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPages));
    return { data: defaultPages };
  }
};
