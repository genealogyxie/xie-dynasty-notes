import { useStore } from '../store/useStore';
import { notebooksAPI, sectionsAPI, pagesAPI } from '../lib/api';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronRight, ChevronDown, Book, FileText, Folder } from 'lucide-react';
import { SectionCreateDialog } from './SectionCreateDialog';

export function Sidebar() {
  const {
    currentWorkspace,
    notebooks,
    sections,
    pages,
    currentNotebook,
    currentSection,
    currentPage,
    setNotebooks,
    setSections,
    setPages,
    setCurrentNotebook,
    setCurrentSection,
    setCurrentPage,
    addNotebook,
    addSection,
    addPage,
  } = useStore();

  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<number>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [newNotebookName, setNewNotebookName] = useState('');
  const [showNewNotebook, setShowNewNotebook] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [sectionDialogNotebookId, setSectionDialogNotebookId] = useState<number | null>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      loadNotebooks();
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (currentNotebook) {
      loadSections(currentNotebook.id);
    }
  }, [currentNotebook]);

  useEffect(() => {
    if (currentSection) {
      loadPages(currentSection.id);
    }
  }, [currentSection]);

  const loadNotebooks = async () => {
    if (!currentWorkspace) return;
    try {
      const response = await notebooksAPI.list(currentWorkspace.id);
      setNotebooks(response.data);
    } catch (error) {
      console.error('Failed to load notebooks:', error);
    }
  };

  const loadSections = async (notebookId: number) => {
    try {
      const response = await sectionsAPI.list(notebookId);
      setSections(response.data);
    } catch (error) {
      console.error('Failed to load sections:', error);
    }
  };

  const loadPages = async (sectionId: number) => {
    try {
      const response = await pagesAPI.list(sectionId);
      setPages(response.data);
    } catch (error) {
      console.error('Failed to load pages:', error);
    }
  };

  const handleCreateNotebook = async () => {
    if (!currentWorkspace || !newNotebookName.trim() || isCreatingNotebook) return;
    setIsCreatingNotebook(true);
    try {
      const response = await notebooksAPI.create(currentWorkspace.id, newNotebookName);
      addNotebook(response.data);
      setNewNotebookName('');
      setShowNewNotebook(false);
    } catch (error) {
      console.error('Failed to create notebook:', error);
    } finally {
      setIsCreatingNotebook(false);
    }
  };

  const handleCreateSection = (notebookId: number) => {
    setSectionDialogNotebookId(notebookId);
    setSectionDialogOpen(true);
  };

  const handleSectionCreate = async (name: string, notebookId: string) => {
    try {
      const response = await sectionsAPI.create(parseInt(notebookId), name);
      addSection(response.data);
      const newExpanded = new Set(expandedNotebooks);
      newExpanded.add(parseInt(notebookId));
      setExpandedNotebooks(newExpanded);
      if (!currentNotebook || currentNotebook.id !== parseInt(notebookId)) {
        setCurrentNotebook(notebooks.find((n) => n.id === parseInt(notebookId)) || null);
      }
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  const handleCreatePage = async (sectionId: number) => {
    if (isCreatingPage) return;
    setIsCreatingPage(true);
    try {
      const response = await pagesAPI.create(sectionId, 'Untitled');
      addPage(response.data);
      setCurrentPage(response.data);
    } catch (error) {
      console.error('Failed to create page:', error);
    } finally {
      setIsCreatingPage(false);
    }
  };

  const toggleNotebook = (notebookId: number) => {
    const newExpanded = new Set(expandedNotebooks);
    if (newExpanded.has(notebookId)) {
      newExpanded.delete(notebookId);
    } else {
      newExpanded.add(notebookId);
      setCurrentNotebook(notebooks.find((n) => n.id === notebookId) || null);
    }
    setExpandedNotebooks(newExpanded);
  };

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
      setCurrentSection(sections.find((s) => s.id === sectionId) || null);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <>
      <SectionCreateDialog
        open={sectionDialogOpen}
        notebooks={notebooks.map((n) => ({ id: String(n.id), name: n.name }))}
        defaultNotebookId={sectionDialogNotebookId ? String(sectionDialogNotebookId) : undefined}
        onClose={() => setSectionDialogOpen(false)}
        onCreate={handleSectionCreate}
      />
      <div className="w-64 border-r bg-gray-50 flex flex-col h-full">
        <div className="p-4 border-b bg-white">
          <h2 className="font-semibold text-lg">{currentWorkspace?.name}</h2>
        </div>
      
      <div className="flex-1 overflow-auto p-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Notebooks</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewNotebook(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {showNewNotebook && (
          <div className="mb-2 flex gap-1">
            <Input
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              placeholder="Notebook name"
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateNotebook();
                if (e.key === 'Escape') setShowNewNotebook(false);
              }}
              autoFocus
            />
          </div>
        )}

        {notebooks.map((notebook) => (
          <div key={notebook.id} className="mb-1">
            <div className="flex items-center gap-1 hover:bg-gray-100 rounded p-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleNotebook(notebook.id)}
              >
                {expandedNotebooks.has(notebook.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <Book className="h-4 w-4 text-blue-600" />
              <span className="text-sm flex-1">{notebook.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleCreateSection(notebook.id)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {expandedNotebooks.has(notebook.id) && (
              <div className="ml-6">
                {sections
                  .filter((s) => s.notebook_id === notebook.id)
                  .map((section) => (
                    <div key={section.id} className="mb-1">
                      <div className="flex items-center gap-1 hover:bg-gray-100 rounded p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleSection(section.id)}
                        >
                          {expandedSections.has(section.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <Folder className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm flex-1">{section.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCreatePage(section.id)}
                          disabled={isCreatingPage}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {expandedSections.has(section.id) && (
                        <div className="ml-6">
                          {pages
                            .filter((p) => p.section_id === section.id)
                            .map((page) => (
                              <div
                                key={page.id}
                                className={`flex items-center gap-1 hover:bg-gray-100 rounded p-1 cursor-pointer ${
                                  currentPage?.id === page.id ? 'bg-blue-100' : ''
                                }`}
                                onClick={() => setCurrentPage(page)}
                              >
                                <FileText className="h-4 w-4 text-gray-600" />
                                <span className="text-sm">{page.title}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
