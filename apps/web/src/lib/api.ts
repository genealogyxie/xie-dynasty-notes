import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface Workspace {
  id: number;
  name: string;
  owner_id: number;
  created_at: string;
}

export interface Notebook {
  id: number;
  workspace_id: number;
  name: string;
  color: string | null;
  icon: string | null;
  position: number;
  created_at: string;
  updated_at: string | null;
}

export interface Section {
  id: number;
  notebook_id: number;
  name: string;
  position: number;
  created_at: string;
  updated_at: string | null;
}

export interface Page {
  id: number;
  section_id: number;
  title: string;
  position: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string | null;
}

export const authAPI = {
  register: (email: string, password: string, full_name?: string) =>
    api.post('/auth/register', { email, password, full_name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get<User>('/auth/me'),
};

export const workspacesAPI = {
  list: () => api.get<Workspace[]>('/workspaces'),
  create: (name: string) => api.post<Workspace>('/workspaces', { name }),
  get: (id: number) => api.get<Workspace>(`/workspaces/${id}`),
};

export const notebooksAPI = {
  list: (workspaceId: number) => api.get<Notebook[]>(`/notebooks/workspace/${workspaceId}`),
  create: (workspaceId: number, name: string, color?: string, icon?: string) =>
    api.post<Notebook>(`/notebooks/workspace/${workspaceId}`, { name, color, icon }),
  get: (id: number) => api.get<Notebook>(`/notebooks/${id}`),
  update: (id: number, data: Partial<Notebook>) => api.patch<Notebook>(`/notebooks/${id}`, data),
  delete: (id: number) => api.delete(`/notebooks/${id}`),
};

export const sectionsAPI = {
  list: (notebookId: number) => api.get<Section[]>(`/sections/notebook/${notebookId}`),
  create: (notebookId: number, name: string) =>
    api.post<Section>(`/sections/notebook/${notebookId}`, { name }),
  update: (id: number, data: Partial<Section>) => api.patch<Section>(`/sections/${id}`, data),
  delete: (id: number) => api.delete(`/sections/${id}`),
};

export const pagesAPI = {
  list: (sectionId: number) => api.get<Page[]>(`/pages/section/${sectionId}`),
  create: (sectionId: number, title: string) =>
    api.post<Page>(`/pages/section/${sectionId}`, { title }),
  get: (id: number) => api.get<Page>(`/pages/${id}`),
  update: (id: number, data: Partial<Page>) => api.patch<Page>(`/pages/${id}`, data),
  delete: (id: number) => api.delete(`/pages/${id}`),
};
