import api from './api';

export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'wdu_media';

const getLocalMedia = (): MediaFile[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [
    { id: '1', filename: 'building.jpg', url: 'https://sis.wahanadata.co.id/img/wdu-building.jpg', mimeType: 'image/jpeg', size: 1024500, createdAt: new Date().toISOString() },
    { id: '2', filename: 'research_data.png', url: 'https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&q=80', mimeType: 'image/png', size: 2048000, createdAt: new Date().toISOString() },
    { id: '3', filename: 'team_meeting.jpg', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80', mimeType: 'image/jpeg', size: 3072000, createdAt: new Date().toISOString() },
    { id: '4', filename: 'logo_wdu.png', url: 'https://imd2022.wahanadata.co.id/img/WDU_02.png', mimeType: 'image/png', size: 512000, createdAt: new Date().toISOString() }
  ];
};

const saveLocalMedia = (files: MediaFile[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
};

export const mediaService = {
  getAll: async () => {
    try {
      const res = await api.get<MediaFile[]>('/media');
      if (res.data) {
        saveLocalMedia(res.data);
        return res;
      }
    } catch (e) {
      console.warn('API Offline, using local media');
    }
    return { data: getLocalMedia() };
  },

  upload: async (file: File, filename?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (filename) {
        formData.append('filename', filename);
      }
      
      return await api.post<MediaFile>('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (e) {
      console.error('API Upload failed, falling back to local storage', e);
      // Fallback logic for offline mode (using base64 for local storage)
      return new Promise<any>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const files = getLocalMedia();
          const newFile = { 
            id: Math.random().toString(36).substr(2, 9),
            filename: filename || file.name,
            url: reader.result as string,
            mimeType: file.type,
            size: file.size,
            createdAt: new Date().toISOString() 
          } as MediaFile;
          saveLocalMedia([newFile, ...files]);
          resolve({ data: newFile });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  delete: async (id: string) => {
    try {
      return await api.delete(`/media/${id}`);
    } catch (e) {
      const files = getLocalMedia();
      const updated = files.filter(f => f.id !== id);
      saveLocalMedia(updated);
      return { data: null };
    }
  },
};
