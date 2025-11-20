import { create } from 'zustand';
import { User, Workspace, Notebook, Section, Page } from '../lib/api';

interface AppState {
  user: User | null;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  notebooks: Notebook[];
  sections: Section[];
  pages: Page[];
  currentNotebook: Notebook | null;
  currentSection: Section | null;
  currentPage: Page | null;
  
  setUser: (user: User | null) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setNotebooks: (notebooks: Notebook[]) => void;
  setSections: (sections: Section[]) => void;
  setPages: (pages: Page[]) => void;
  setCurrentNotebook: (notebook: Notebook | null) => void;
  setCurrentSection: (section: Section | null) => void;
  setCurrentPage: (page: Page | null) => void;
  
  addNotebook: (notebook: Notebook) => void;
  updateNotebook: (id: number, data: Partial<Notebook>) => void;
  deleteNotebook: (id: number) => void;
  
  addSection: (section: Section) => void;
  updateSection: (id: number, data: Partial<Section>) => void;
  deleteSection: (id: number) => void;
  
  addPage: (page: Page) => void;
  updatePage: (id: number, data: Partial<Page>) => void;
  deletePage: (id: number) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  currentWorkspace: null,
  workspaces: [],
  notebooks: [],
  sections: [],
  pages: [],
  currentNotebook: null,
  currentSection: null,
  currentPage: null,
  
  setUser: (user) => set({ user }),
  setCurrentWorkspace: (currentWorkspace) => set({ currentWorkspace }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setNotebooks: (notebooks) => set({ notebooks }),
  setSections: (sections) => set({ sections }),
  setPages: (pages) => set({ pages }),
  setCurrentNotebook: (currentNotebook) => set({ currentNotebook }),
  setCurrentSection: (currentSection) => set({ currentSection }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  
  addNotebook: (notebook) => set((state) => ({ notebooks: [...state.notebooks, notebook] })),
  updateNotebook: (id, data) => set((state) => ({
    notebooks: state.notebooks.map((n) => (n.id === id ? { ...n, ...data } : n)),
  })),
  deleteNotebook: (id) => set((state) => ({
    notebooks: state.notebooks.filter((n) => n.id !== id),
  })),
  
  addSection: (section) => set((state) => ({ sections: [...state.sections, section] })),
  updateSection: (id, data) => set((state) => ({
    sections: state.sections.map((s) => (s.id === id ? { ...s, ...data } : s)),
  })),
  deleteSection: (id) => set((state) => ({
    sections: state.sections.filter((s) => s.id !== id),
  })),
  
  addPage: (page) => set((state) => ({ pages: [...state.pages, page] })),
  updatePage: (id, data) => set((state) => ({
    pages: state.pages.map((p) => (p.id === id ? { ...p, ...data } : p)),
  })),
  deletePage: (id) => set((state) => ({
    pages: state.pages.filter((p) => p.id !== id),
  })),
}));
