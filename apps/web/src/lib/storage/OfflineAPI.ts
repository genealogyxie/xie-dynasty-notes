import { StorageAdapter } from './types';
import { SyncEngine } from './SyncEngine';
import { SearchIndex } from './SearchIndex';
import { Workspace, Notebook, Section, Page, authAPI, workspacesAPI, notebooksAPI, sectionsAPI, pagesAPI } from '../api';

/**
 * OfflineAPI wraps the regular API and provides offline-first functionality.
 * It uses IndexedDB for local storage and syncs with the server when online.
 */
export class OfflineAPI {
  private storage: StorageAdapter;
  private syncEngine: SyncEngine;
  private searchIndex: SearchIndex;
  private isOnline: boolean = navigator.onLine;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
    this.syncEngine = new SyncEngine(storage);
    this.searchIndex = new SearchIndex();
    
    this.syncEngine.startAutoSync(30000);
    
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  getSyncEngine(): SyncEngine {
    return this.syncEngine;
  }

  getSearchIndex(): SearchIndex {
    return this.searchIndex;
  }

  auth = {
    register: authAPI.register,
    login: authAPI.login,
    me: async () => {
      try {
        const response = await authAPI.me();
        await this.storage.setUser(response.data);
        return response;
      } catch (error) {
        if (!this.isOnline) {
          const user = await this.storage.getUser();
          if (user) {
            return { data: user };
          }
        }
        throw error;
      }
    },
  };

  workspaces = {
    list: async () => {
      try {
        if (this.isOnline) {
          const response = await workspacesAPI.list();
          await this.storage.setWorkspaces(response.data);
          return response;
        }
      } catch (error) {
        console.warn('Failed to fetch workspaces from server, using cached data:', error);
      }
      
      const workspaces = await this.storage.getWorkspaces();
      return { data: workspaces };
    },

    create: async (name: string) => {
      const tempId = -Date.now(); // Temporary negative ID
      const workspace: Workspace = {
        id: tempId,
        name,
        owner_id: 0, // Will be set by server
        created_at: new Date().toISOString(),
      };

      await this.storage.addWorkspace(workspace);

      await this.syncEngine.queueOperation('create', 'workspace', tempId, { name });

      return { data: workspace };
    },

    get: async (id: number) => {
      const workspace = await this.storage.getWorkspace(id);
      if (workspace) {
        return { data: workspace };
      }
      
      if (this.isOnline) {
        const response = await workspacesAPI.get(id);
        await this.storage.addWorkspace(response.data);
        return response;
      }
      
      throw new Error('Workspace not found');
    },
  };

  notebooks = {
    list: async (workspaceId: number) => {
      try {
        if (this.isOnline) {
          const response = await notebooksAPI.list(workspaceId);
          for (const notebook of response.data) {
            await this.storage.addNotebook(notebook);
            this.searchIndex.indexNotebook(notebook);
          }
          return response;
        }
      } catch (error) {
        console.warn('Failed to fetch notebooks from server, using cached data:', error);
      }
      
      const notebooks = await this.storage.getNotebooks(workspaceId);
      return { data: notebooks };
    },

    create: async (workspaceId: number, name: string, color?: string, icon?: string) => {
      const tempId = -Date.now();
      const notebook: Notebook = {
        id: tempId,
        workspace_id: workspaceId,
        name,
        color: color || null,
        icon: icon || null,
        position: 0,
        created_at: new Date().toISOString(),
        updated_at: null,
      };

      await this.storage.addNotebook(notebook);
      this.searchIndex.indexNotebook(notebook);

      await this.syncEngine.queueOperation('create', 'notebook', tempId, {
        workspace_id: workspaceId,
        name,
        color,
        icon,
      });

      return { data: notebook };
    },

    get: async (id: number) => {
      const notebook = await this.storage.getNotebook(id);
      if (notebook) {
        return { data: notebook };
      }
      
      if (this.isOnline) {
        const response = await notebooksAPI.get(id);
        await this.storage.addNotebook(response.data);
        this.searchIndex.indexNotebook(response.data);
        return response;
      }
      
      throw new Error('Notebook not found');
    },

    update: async (id: number, data: Partial<Notebook>) => {
      await this.storage.updateNotebook(id, data);
      const notebook = await this.storage.getNotebook(id);
      if (notebook) {
        this.searchIndex.updateNotebook(notebook);
      }

      await this.syncEngine.queueOperation('update', 'notebook', id, data);

      return { data: notebook };
    },

    delete: async (id: number) => {
      await this.storage.deleteNotebook(id);
      this.searchIndex.removeNotebook(id);

      await this.syncEngine.queueOperation('delete', 'notebook', id, {});

      return { data: null };
    },
  };

  sections = {
    list: async (notebookId: number) => {
      try {
        if (this.isOnline) {
          const response = await sectionsAPI.list(notebookId);
          for (const section of response.data) {
            await this.storage.addSection(section);
            this.searchIndex.indexSection(section);
          }
          return response;
        }
      } catch (error) {
        console.warn('Failed to fetch sections from server, using cached data:', error);
      }
      
      const sections = await this.storage.getSections(notebookId);
      return { data: sections };
    },

    create: async (notebookId: number, name: string) => {
      const tempId = -Date.now();
      const section: Section = {
        id: tempId,
        notebook_id: notebookId,
        name,
        position: 0,
        created_at: new Date().toISOString(),
        updated_at: null,
      };

      await this.storage.addSection(section);
      this.searchIndex.indexSection(section);

      await this.syncEngine.queueOperation('create', 'section', tempId, {
        notebook_id: notebookId,
        name,
      });

      return { data: section };
    },

    update: async (id: number, data: Partial<Section>) => {
      await this.storage.updateSection(id, data);
      const section = await this.storage.getSection(id);
      if (section) {
        this.searchIndex.updateSection(section);
      }

      await this.syncEngine.queueOperation('update', 'section', id, data);

      return { data: section };
    },

    delete: async (id: number) => {
      await this.storage.deleteSection(id);
      this.searchIndex.removeSection(id);

      await this.syncEngine.queueOperation('delete', 'section', id, {});

      return { data: null };
    },
  };

  pages = {
    list: async (sectionId: number) => {
      try {
        if (this.isOnline) {
          const response = await pagesAPI.list(sectionId);
          for (const page of response.data) {
            await this.storage.addPage(page);
            this.searchIndex.indexPage(page);
          }
          return response;
        }
      } catch (error) {
        console.warn('Failed to fetch pages from server, using cached data:', error);
      }
      
      const pages = await this.storage.getPages(sectionId);
      return { data: pages };
    },

    create: async (sectionId: number, title: string) => {
      const tempId = -Date.now();
      const page: Page = {
        id: tempId,
        section_id: sectionId,
        title,
        position: 0,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: null,
      };

      await this.storage.addPage(page);
      this.searchIndex.indexPage(page);

      await this.syncEngine.queueOperation('create', 'page', tempId, {
        section_id: sectionId,
        title,
      });

      return { data: page };
    },

    get: async (id: number) => {
      const page = await this.storage.getPage(id);
      if (page) {
        return { data: page };
      }
      
      if (this.isOnline) {
        const response = await pagesAPI.get(id);
        await this.storage.addPage(response.data);
        this.searchIndex.indexPage(response.data);
        return response;
      }
      
      throw new Error('Page not found');
    },

    update: async (id: number, data: Partial<Page>) => {
      await this.storage.updatePage(id, data);
      const page = await this.storage.getPage(id);
      if (page) {
        this.searchIndex.updatePage(page);
      }

      await this.syncEngine.queueOperation('update', 'page', id, data);

      return { data: page };
    },

    delete: async (id: number) => {
      await this.storage.deletePage(id);
      this.searchIndex.removePage(id);

      await this.syncEngine.queueOperation('delete', 'page', id, {});

      return { data: null };
    },
  };
}
