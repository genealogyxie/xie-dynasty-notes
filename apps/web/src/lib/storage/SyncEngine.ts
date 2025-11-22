import { ulid } from 'ulid';
import { StorageAdapter, OutboxOperation, SyncStatus } from './types';
import { workspacesAPI, notebooksAPI, sectionsAPI, pagesAPI } from '../api';

export class SyncEngine {
  private storage: StorageAdapter;
  private isOnline: boolean = navigator.onLine;
  private isSyncing: boolean = false;
  private syncInterval: number | null = null;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  constructor(storage: StorageAdapter) {
    this.storage = storage;
    this.setupOnlineListener();
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
      this.sync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  onStatusChange(listener: (status: SyncStatus) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async notifyListeners() {
    const status = await this.getStatus();
    this.listeners.forEach(listener => listener(status));
  }

  async getStatus(): Promise<SyncStatus> {
    const operations = await this.storage.getOutboxOperations();
    const pendingOps = operations.filter(op => op.status === 'pending').length;
    
    if (!this.isOnline) {
      return {
        status: 'offline',
        lastSyncTime: null,
        pendingOperations: pendingOps,
      };
    }

    if (this.isSyncing) {
      return {
        status: 'syncing',
        lastSyncTime: null,
        pendingOperations: pendingOps,
      };
    }

    const failedOps = operations.filter(op => op.status === 'failed');
    if (failedOps.length > 0) {
      return {
        status: 'error',
        lastSyncTime: null,
        pendingOperations: pendingOps,
        error: `${failedOps.length} operations failed`,
      };
    }

    return {
      status: 'synced',
      lastSyncTime: new Date(),
      pendingOperations: pendingOps,
    };
  }

  startAutoSync(intervalMs: number = 30000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = window.setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.sync();
      }
    }, intervalMs);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async sync(): Promise<void> {
    if (!this.isOnline || this.isSyncing) {
      return;
    }

    this.isSyncing = true;
    this.notifyListeners();

    try {
      const operations = await this.storage.getOutboxOperations();
      const pendingOps = operations.filter(op => op.status === 'pending');

      for (const op of pendingOps) {
        try {
          await this.processOperation(op);
          await this.storage.deleteOutboxOperation(op.id);
        } catch (error) {
          console.error('Failed to process operation:', op, error);
          await this.storage.updateOutboxOperation(op.id, {
            status: 'failed',
            retryCount: op.retryCount + 1,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  private async processOperation(op: OutboxOperation): Promise<void> {
    await this.storage.updateOutboxOperation(op.id, { status: 'processing' });

    switch (op.entity) {
      case 'workspace':
        await this.processWorkspaceOperation(op);
        break;
      case 'notebook':
        await this.processNotebookOperation(op);
        break;
      case 'section':
        await this.processSectionOperation(op);
        break;
      case 'page':
        await this.processPageOperation(op);
        break;
    }
  }

  private async processWorkspaceOperation(op: OutboxOperation): Promise<void> {
    switch (op.type) {
      case 'create':
        await workspacesAPI.create(op.data.name);
        break;
      case 'update':
        break;
      case 'delete':
        break;
    }
  }

  private async processNotebookOperation(op: OutboxOperation): Promise<void> {
    switch (op.type) {
      case 'create':
        const notebook = await notebooksAPI.create(
          op.data.workspace_id,
          op.data.name,
          op.data.color,
          op.data.icon
        );
        await this.storage.deleteNotebook(op.entityId as number);
        await this.storage.addNotebook(notebook.data);
        break;
      case 'update':
        await notebooksAPI.update(op.entityId as number, op.data);
        break;
      case 'delete':
        await notebooksAPI.delete(op.entityId as number);
        break;
    }
  }

  private async processSectionOperation(op: OutboxOperation): Promise<void> {
    switch (op.type) {
      case 'create':
        const section = await sectionsAPI.create(op.data.notebook_id, op.data.name);
        await this.storage.deleteSection(op.entityId as number);
        await this.storage.addSection(section.data);
        break;
      case 'update':
        await sectionsAPI.update(op.entityId as number, op.data);
        break;
      case 'delete':
        await sectionsAPI.delete(op.entityId as number);
        break;
    }
  }

  private async processPageOperation(op: OutboxOperation): Promise<void> {
    switch (op.type) {
      case 'create':
        const page = await pagesAPI.create(op.data.section_id, op.data.title);
        await this.storage.deletePage(op.entityId as number);
        await this.storage.addPage(page.data);
        break;
      case 'update':
        await pagesAPI.update(op.entityId as number, op.data);
        break;
      case 'delete':
        await pagesAPI.delete(op.entityId as number);
        break;
    }
  }

  async queueOperation(
    type: 'create' | 'update' | 'delete',
    entity: 'workspace' | 'notebook' | 'section' | 'page',
    entityId: string | number,
    data: any
  ): Promise<void> {
    const operation: OutboxOperation = {
      id: ulid(),
      type,
      entity,
      entityId,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    await this.storage.addOutboxOperation(operation);
    
    if (this.isOnline) {
      this.sync();
    }
  }
}
