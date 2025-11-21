import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CanvasPage } from './pages/CanvasPage';
import { AppFluentProvider } from './theme/FluentProvider';
import { useStore } from './store/useStore';
import './App.css';

function DashboardWrapper() {
  const [searchParams] = useSearchParams();
  const { currentPage, user } = useStore();
  const canvasMode = searchParams.get('canvas') === '1';

  if (canvasMode && currentPage && user) {
    return (
      <CanvasPage
        pageId={currentPage.id}
        userId={user.id}
        userName={user.full_name || user.email}
      />
    );
  }

  return <Dashboard />;
}

function App() {
  return (
    <AppFluentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<DashboardWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppFluentProvider>
  );
}

export default App;
