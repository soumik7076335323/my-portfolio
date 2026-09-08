import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProfilePage from './pages/admin/ProfilePage';
import PhotoPage from './pages/admin/PhotoPage';
import ResumePage from './pages/admin/ResumePage';
import SkillsPage from './pages/admin/SkillsPage';
import ExperiencePage from './pages/admin/ExperiencePage';
import ProjectsPage from './pages/admin/ProjectsPage';
import EducationPage from './pages/admin/EducationPage';
import CertificationsPage from './pages/admin/CertificationsPage';
import MessagesPage from './pages/admin/MessagesPage';
import SettingsPage from './pages/admin/SettingsPage';
import ScrollToTop from './components/ScrollToTop';

/**
 * The public portfolio is a single, recruiter-friendly page with anchored
 * sections; the admin panel lives under /admin with protected sub-routes.
 */
function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Admin area uses its own background treatment
    document.body.classList.toggle('admin-body', isAdmin);
    return () => document.body.classList.remove('admin-body');
  }, [isAdmin]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="photo" element={<PhotoPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
