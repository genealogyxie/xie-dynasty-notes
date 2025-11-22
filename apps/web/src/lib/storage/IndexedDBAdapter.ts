import Dexie, { Table } from 'dexie';
import { User, Workspace, Notebook, Section, Page } from '../api';
import { StorageAdapter, OutboxOperation } from './types';

class NotesDatabase extends Dexie {
  user!: Table<{ id: string; data: User | null }>;
  workspaces!: Table<Workspace>;
  notebooks!: Table<Notebook>;
  sections!: Table<Section>;
  pages!: Table<Page>;
  outbox!: Table<OutboxOperation>;

  constructor() {
    super('XieDynastyNotes');
    
    this.version(1).stores({
      user: 'id',
      workspaces: 'id, owner_id, created_at',
      notebooks: 'id, workspace_id, created_at',
      sections: 'id, notebook_id, created_at',
      pages: 'id, section_id, is_favorite, created_at',
      outbox: 'id, timestamp, status, entity',
    });
  }
}

export class IndexedDBAdapter implements StorageAdapter {
  private db: NotesDatabase;

  constructor() {
    this.db = new NotesDatabase();
  }

  async getUser(): Promise<User | null> {
    const result = await this.db.user.get('current');
    return result?.data || null;
  }

  async setUser(user: User | null): Promise<void> {
    await this.db.user.put({ id: 'current', data: user });
  }

  async getWorkspaces(): Promise<Workspace[]> {
    return await this.db.workspaces.toArray();
  }

  async getWorkspace(id: number): Promise<Workspace | null> {
    return (await this.db.workspaces.get(id)) || null;
  }

  async setWorkspaces(workspaces: Workspace[]): Promise<void> {
    await this.db.workspaces.clear();
    await this.db.workspaces.bulkAdd(workspaces);
  }

  async addWorkspace(workspace: Workspace): Promise<void> {
    await this.db.workspaces.add(workspace);
  }

  async updateWorkspace(id: number, data: Partial<Workspace>): Promise<void> {
    await this.db.workspaces.update(id, data);
  }

  async deleteWorkspace(id: number): Promise<void> {
    await this.db.workspaces.delete(id);
  }

  async getNotebooks(workspaceId: number): Promise<Notebook[]> {
    return await this.db.notebooks.where('workspace_id').equals(workspaceId).toArray();
  }

  async getNotebook(id: number): Promise<Notebook | null> {
    return (await this.db.notebooks.get(id)) || null;
  }

  async addNotebook(notebook: Notebook): Promise<void> {
    await this.db.notebooks.add(notebook);
  }

  async updateNotebook(id: number, data: Partial<Notebook>): Promise<void> {
    await this.db.notebooks.update(id, data);
  }

  async deleteNotebook(id: number): Promise<void> {
    await this.db.notebooks.delete(id);
  }

  async getSections(notebookId: number): Promise<Section[]> {
    return await this.db.sections.where('notebook_id').equals(notebookId).toArray();
  }

  async getSection(id: number): Promise<Section | null> {
    return (await this.db.sections.get(id)) || null;
  }

  async addSection(section: Section): Promise<void> {
    await this.db.sections.add(section);
  }

  async updateSection(id: number, data: Partial<Section>): Promise<void> {
    await this.db.sections.update(id, data);
  }

  async deleteSection(id: number): Promise<void> {
    await this.db.sections.delete(id);
  }

  async getPages(sectionId: number): Promise<Page[]> {
    return await this.db.pages.where('section_id').equals(sectionId).toArray();
  }

  async getPage(id: number): Promise<Page | null> {
    return (await this.db.pages.get(id)) || null;
  }

  async addPage(page: Page): Promise<void> {
    await this.db.pages.add(page);
  }

  async updatePage(id: number, data: Partial<Page>): Promise<void> {
    await this.db.pages.update(id, data);
  }

  async deletePage(id: number): Promise<void> {
    await this.db.pages.delete(id);
  }

  async getOutboxOperations(): Promise<OutboxOperation[]> {
    return await this.db.outbox.orderBy('timestamp').toArray();
  }

  async addOutboxOperation(operation: OutboxOperation): Promise<void> {
    await this.db.outbox.add(operation);
  }

  async updateOutboxOperation(id: string, data: Partial<OutboxOperation>): Promise<void> {
    await this.db.outbox.update(id, data);
  }

  async deleteOutboxOperation(id: string): Promise<void> {
    await this.db.outbox.delete(id);
  }

  async clearOutbox(): Promise<void> {
    await this.db.outbox.clear();
  }

  async clear(): Promise<void> {
    await this.db.user.clear();
    await this.db.workspaces.clear();
    await this.db.notebooks.clear();
    await this.db.sections.clear();
    await this.db.pages.clear();
    await this.db.outbox.clear();
  }
}
