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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: new_refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', new_refresh_token);

        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
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
