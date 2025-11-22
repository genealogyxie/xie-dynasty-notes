import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CanvasPage } from './pages/CanvasPage';
import { InkPage } from './pages/InkPage';
import { PdfPage } from './pages/PdfPage';
import { AppFluentProvider } from './theme/FluentProvider';
import { OfflineProvider } from './contexts/OfflineContext';
import { useStore } from './store/useStore';
import './App.css';

function DashboardWrapper() {
  const [searchParams] = useSearchParams();
  const { currentPage, user } = useStore();
  const canvasMode = searchParams.get('canvas') === '1';
  const inkMode = searchParams.get('ink') === '1';
  const pdfMode = searchParams.get('pdf') === '1';

  if (pdfMode) {
    return <PdfPage />;
  }

  if (inkMode && currentPage && user) {
    return (
      <InkPage
        pageId={currentPage.id}
        userId={user.id}
        userName={user.full_name || user.email}
      />
    );
  }

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
      <OfflineProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardWrapper />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </OfflineProvider>
    </AppFluentProvider>
  );
}

export default App;
