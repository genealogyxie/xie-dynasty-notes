import { User, Workspace, Notebook, Section, Page } from '../api';

export interface OutboxOperation {
  id: string; // ULID
  type: 'create' | 'update' | 'delete';
  entity: 'workspace' | 'notebook' | 'section' | 'page';
  entityId: string | number; // temp ID for creates, real ID for updates/deletes
  data: any;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'processing' | 'failed';
  error?: string;
}

export interface StorageAdapter {
  getUser(): Promise<User | null>;
  setUser(user: User | null): Promise<void>;
  
  getWorkspaces(): Promise<Workspace[]>;
  getWorkspace(id: number): Promise<Workspace | null>;
  setWorkspaces(workspaces: Workspace[]): Promise<void>;
  addWorkspace(workspace: Workspace): Promise<void>;
  updateWorkspace(id: number, data: Partial<Workspace>): Promise<void>;
  deleteWorkspace(id: number): Promise<void>;
  
  getNotebooks(workspaceId: number): Promise<Notebook[]>;
  getNotebook(id: number): Promise<Notebook | null>;
  addNotebook(notebook: Notebook): Promise<void>;
  updateNotebook(id: number, data: Partial<Notebook>): Promise<void>;
  deleteNotebook(id: number): Promise<void>;
  
  getSections(notebookId: number): Promise<Section[]>;
  getSection(id: number): Promise<Section | null>;
  addSection(section: Section): Promise<void>;
  updateSection(id: number, data: Partial<Section>): Promise<void>;
  deleteSection(id: number): Promise<void>;
  
  getPages(sectionId: number): Promise<Page[]>;
  getPage(id: number): Promise<Page | null>;
  addPage(page: Page): Promise<void>;
  updatePage(id: number, data: Partial<Page>): Promise<void>;
  deletePage(id: number): Promise<void>;
  
  getOutboxOperations(): Promise<OutboxOperation[]>;
  addOutboxOperation(operation: OutboxOperation): Promise<void>;
  updateOutboxOperation(id: string, data: Partial<OutboxOperation>): Promise<void>;
  deleteOutboxOperation(id: string): Promise<void>;
  clearOutbox(): Promise<void>;
  
  clear(): Promise<void>;
}

export interface SyncStatus {
  status: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncTime: Date | null;
  pendingOperations: number;
  error?: string;
}
