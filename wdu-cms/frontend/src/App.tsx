import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './components/PublicLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ExperiencePage from './pages/ExperiencePage';
import CollaborationDetailPage from './pages/CollaborationDetailPage';
import ContactPage from './pages/ContactPage';
import DynamicPage from './pages/DynamicPage';
import SisWduPage from './pages/SisWduPage';
import DownloadProfilePage from './pages/DownloadProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminDashboard from './admin/Dashboard';
import AdminLoginPage from './admin/LoginPage';
import ProjectPage from './admin/ProjectPage';
import ServicePage from './admin/ServicePage';
import MediaLibraryPage from './admin/MediaLibraryPage';
import ContactInboxPage from './admin/ContactInboxPage';
import ClientManagementPage from './admin/ClientManagementPage';
import GalleryManagementPage from './admin/GalleryManagementPage';
import PagesManagementPage from './admin/PagesManagementPage';
import ExperienceManagementPage from './admin/ExperienceManagementPage';
import UserManagementPage from './admin/UserManagementPage';
import ProfilePage from './admin/ProfilePage';
import SiteConfigPage from './admin/SiteConfigPage';
import EditorDashboard from './admin/EditorDashboard';

import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';

const ProtectedRoute = ({ children, requiresSuperAdmin = false }: { children: JSX.Element, requiresSuperAdmin?: boolean }) => {
  const { user } = useUser();
  
  console.log('Security Check:', { userId: user.id, path: window.location.pathname });
  
  // Security check: Redirect to login if guest
  if (user.id === 'guest') {
    return <Navigate to="/admin/login" replace />;
  }

  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  
  if (requiresSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

const AdminRedirect = () => {
  return <Navigate to="/admin/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            {/* Admin Routes (Priority) */}
            <Route path="/admin" element={<ProtectedRoute><AdminRedirect /></ProtectedRoute>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/pages" element={<ProtectedRoute><PagesManagementPage /></ProtectedRoute>} />
            <Route path="/admin/services" element={<ProtectedRoute><ServicePage /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
            <Route path="/admin/media" element={<ProtectedRoute><MediaLibraryPage /></ProtectedRoute>} />
            <Route path="/admin/contact" element={<ProtectedRoute><ContactInboxPage /></ProtectedRoute>} />
            <Route path="/admin/config" element={<ProtectedRoute><SiteConfigPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiresSuperAdmin={true}><UserManagementPage /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute><ClientManagementPage /></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute><GalleryManagementPage /></ProtectedRoute>} />
            <Route path="/admin/experience" element={<ProtectedRoute><ExperienceManagementPage /></ProtectedRoute>} />
            <Route path="/admin/editor-dashboard" element={<ProtectedRoute><EditorDashboard /></ProtectedRoute>} />
            
            {/* Fallback for any other admin paths to prevent 404 before security check */}
            <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />

            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/tentang-kami" element={<AboutPage />} />
              <Route path="/layanan" element={<ServicesPage />} />
              <Route path="/pengalaman" element={<ExperiencePage />} />
              <Route path="/project/:id" element={<CollaborationDetailPage />} />
              <Route path="/kontak" element={<ContactPage />} />
              <Route path="/sis-wdu" element={<SisWduPage />} />
              <Route path="/unduh-profil" element={<DownloadProfilePage />} />
              <Route path="/:slug" element={<DynamicPage />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;