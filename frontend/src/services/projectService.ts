import api from './api';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  year: number;
  description?: string;
  imageUrl?: string;
  isHighlight: boolean;
  order: number;
  createdAt?: string;
}

const STORAGE_KEY = 'wdu_projects';

const getLocalProjects = (): Project[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [
    { id: '1', title: 'Digitalization Study', client: 'Bank ABC', category: 'Research', year: 2023, isHighlight: true, order: 1 },
    { id: '2', title: 'Market Analysis', client: 'Retail Corp', category: 'Analytics', year: 2022, isHighlight: false, order: 2 }
  ];
};

const saveLocalProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const projectService = {
  getAll: async () => {
    try {
      const res = await api.get<Project[]>('/projects');
      if (res.data) {
        saveLocalProjects(res.data);
        return res;
      }
    } catch (e) {
      console.warn('API Offline, using local storage');
    }
    return { data: getLocalProjects() };
  },

  getHighlights: async () => {
    try {
      return await api.get<Project[]>('/projects?highlight=true');
    } catch (e) {
      const projects = getLocalProjects();
      return { data: projects.filter(p => p.isHighlight) };
    }
  },

  getById: async (id: string) => {
    try {
      return await api.get<Project>(`/projects/${id}`);
    } catch (e) {
      const projects = getLocalProjects();
      return { data: projects.find(p => p.id === id) || null };
    }
  },

  create: async (data: Partial<Project>) => {
    try {
      return await api.post<Project>('/projects', data);
    } catch (e) {
      const projects = getLocalProjects();
      const newProject = { 
        ...data, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString() 
      } as Project;
      saveLocalProjects([...projects, newProject]);
      return { data: newProject };
    }
  },

  update: async (id: string, data: Partial<Project>) => {
    try {
      return await api.put<Project>(`/projects/${id}`, data);
    } catch (e) {
      const projects = getLocalProjects();
      const updated = projects.map(p => p.id === id ? { ...p, ...data } as Project : p);
      saveLocalProjects(updated);
      return { data: updated.find(p => p.id === id) as Project };
    }
  },

  delete: async (id: string) => {
    try {
      return await api.delete(`/projects/${id}`);
    } catch (e) {
      const projects = getLocalProjects();
      const updated = projects.filter(p => p.id !== id);
      saveLocalProjects(updated);
      return { data: null };
    }
  },
};
