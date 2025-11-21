import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { workspacesAPI } from '../lib/api';
import { Sidebar } from '../components/Sidebar';
import { Editor } from '../components/Editor';
import { CommandPalette } from '../components/CommandPalette';
import { GlobalSearch } from '../components/GlobalSearch';
import { VersionHistory } from '../components/VersionHistory';
import { RecycleBin } from '../components/RecycleBin';
import { ExportDialog } from '../components/ExportDialog';
import { ImportDialog } from '../components/ImportDialog';
import { PageTemplates } from '../components/PageTemplates';
import { PageBackgrounds } from '../components/PageBackgrounds';
import { SyncStatusIndicator } from '../components/SyncStatusIndicator';
import { OfflineBanner } from '../components/OfflineBanner';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { LogOut, Search, History, Trash2, Download, Upload, FileText, Palette } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [recycleBinOpen, setRecycleBinOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [backgroundsOpen, setBackgroundsOpen] = useState(false);
  const [syncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const {
    user,
    currentPage,
    setUser,
    setCurrentWorkspace,
    setWorkspaces,
  } = useStore();

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      handler: () => setCommandPaletteOpen(true),
    },
    {
      key: 'p',
      ctrl: true,
      handler: () => setCommandPaletteOpen(true),
    },
    {
      key: 'f',
      ctrl: true,
      shift: true,
      handler: () => setGlobalSearchOpen(true),
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const response = await workspacesAPI.list();
      setWorkspaces(response.data);
      if (response.data.length > 0) {
        setCurrentWorkspace(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <OfflineBanner />
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <GlobalSearch
        open={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
      />
      {currentPage && (
        <VersionHistory
          open={versionHistoryOpen}
          onClose={() => setVersionHistoryOpen(false)}
          pageId={currentPage.id}
        />
      )}
      <RecycleBin
        open={recycleBinOpen}
        onClose={() => setRecycleBinOpen(false)}
      />
      {currentPage && (
        <ExportDialog
          open={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
          pageTitle={currentPage.title}
          pageContent="Page content would be here"
        />
      )}
      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={(content, format) => {
          console.log('Imported content:', content, 'Format:', format);
        }}
      />
      <PageTemplates
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onSelectTemplate={(template) => {
          console.log('Selected template:', template);
        }}
      />
      <PageBackgrounds
        open={backgroundsOpen}
        onClose={() => setBackgroundsOpen(false)}
        onSelectBackground={(background) => {
          console.log('Selected background:', background);
        }}
      />
      <div className="h-screen flex flex-col">
        <header className="border-b bg-white px-4 py-2 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">Xie Dynasty Notes</h1>
          <div className="flex items-center gap-2">
            <SyncStatusIndicator status={syncStatus} lastSyncTime={new Date()} />
            <Button variant="ghost" size="sm" onClick={() => setGlobalSearchOpen(true)}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setTemplatesOpen(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            {currentPage && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setBackgroundsOpen(true)}>
                  <Palette className="h-4 w-4 mr-2" />
                  Background
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setVersionHistoryOpen(true)}>
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setExportDialogOpen(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={() => setRecycleBinOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Recycle Bin
            </Button>
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {currentPage && user ? (
              <Editor
                pageId={currentPage.id}
                userId={user.id}
                userName={user.full_name || user.email}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Welcome to Xie Dynasty Notes</h2>
                  <p>Create a notebook and start taking notes</p>
                  <p className="text-xs mt-4">Press Ctrl+K for quick navigation, Ctrl+Shift+F for global search</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
