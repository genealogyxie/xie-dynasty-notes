import MiniSearch from 'minisearch';
import { Page, Notebook, Section } from '../api';

export interface SearchResult {
  id: number;
  type: 'page' | 'notebook' | 'section';
  title: string;
  content?: string;
  score: number;
  match: {
    [field: string]: string[];
  };
}

export class SearchIndex {
  private pageIndex: MiniSearch<Page & { content?: string }>;
  private notebookIndex: MiniSearch<Notebook>;
  private sectionIndex: MiniSearch<Section>;

  constructor() {
    this.pageIndex = new MiniSearch({
      fields: ['title', 'content'],
      storeFields: ['id', 'title', 'section_id', 'is_favorite'],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    this.notebookIndex = new MiniSearch({
      fields: ['name'],
      storeFields: ['id', 'name', 'workspace_id', 'color'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    this.sectionIndex = new MiniSearch({
      fields: ['name'],
      storeFields: ['id', 'name', 'notebook_id'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });
  }

  indexPage(page: Page, content?: string) {
    this.pageIndex.add({ ...page, content });
  }

  indexPages(pages: Array<Page & { content?: string }>) {
    this.pageIndex.addAll(pages);
  }

  updatePage(page: Page, content?: string) {
    this.pageIndex.discard(page.id);
    this.pageIndex.add({ ...page, content });
  }

  removePage(pageId: number) {
    this.pageIndex.discard(pageId);
  }

  indexNotebook(notebook: Notebook) {
    this.notebookIndex.add(notebook);
  }

  indexNotebooks(notebooks: Notebook[]) {
    this.notebookIndex.addAll(notebooks);
  }

  updateNotebook(notebook: Notebook) {
    this.notebookIndex.discard(notebook.id);
    this.notebookIndex.add(notebook);
  }

  removeNotebook(notebookId: number) {
    this.notebookIndex.discard(notebookId);
  }

  indexSection(section: Section) {
    this.sectionIndex.add(section);
  }

  indexSections(sections: Section[]) {
    this.sectionIndex.addAll(sections);
  }

  updateSection(section: Section) {
    this.sectionIndex.discard(section.id);
    this.sectionIndex.add(section);
  }

  removeSection(sectionId: number) {
    this.sectionIndex.discard(sectionId);
  }

  search(query: string, options?: {
    types?: Array<'page' | 'notebook' | 'section'>;
    limit?: number;
  }): SearchResult[] {
    const types = options?.types || ['page', 'notebook', 'section'];
    const limit = options?.limit || 50;
    const results: SearchResult[] = [];

    if (types.includes('page')) {
      const pageResults = this.pageIndex.search(query, { boost: { title: 2 } });
      results.push(...pageResults.map(r => ({
        id: r.id as number,
        type: 'page' as const,
        title: r.title,
        content: r.content,
        score: r.score,
        match: r.match,
      })));
    }

    if (types.includes('notebook')) {
      const notebookResults = this.notebookIndex.search(query);
      results.push(...notebookResults.map(r => ({
        id: r.id as number,
        type: 'notebook' as const,
        title: r.name,
        score: r.score,
        match: r.match,
      })));
    }

    if (types.includes('section')) {
      const sectionResults = this.sectionIndex.search(query);
      results.push(...sectionResults.map(r => ({
        id: r.id as number,
        type: 'section' as const,
        title: r.name,
        score: r.score,
        match: r.match,
      })));
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  clear() {
    this.pageIndex.removeAll();
    this.notebookIndex.removeAll();
    this.sectionIndex.removeAll();
  }
}
