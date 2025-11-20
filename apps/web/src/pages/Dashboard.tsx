import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { workspacesAPI } from '../lib/api';
import { Sidebar } from '../components/Sidebar';
import { Editor } from '../components/Editor';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    currentPage,
    setUser,
    setCurrentWorkspace,
    setWorkspaces,
  } = useStore();

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
    <div className="h-screen flex flex-col">
      <header className="border-b bg-white px-4 py-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Xie Dynasty Notes</h1>
        <div className="flex items-center gap-4">
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
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
