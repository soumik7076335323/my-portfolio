import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resolveUrl } from '../../services/api';
import { PageLoading } from '../../components/ui';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/profile', label: 'Profile', icon: '◉' },
  { to: '/admin/photo', label: 'Profile Photo', icon: '☗' },
  { to: '/admin/resume', label: 'Resume', icon: '⎘' },
  { to: '/admin/skills', label: 'Skills', icon: '⚡' },
  { to: '/admin/experience', label: 'Experience', icon: '◷' },
  { to: '/admin/projects', label: 'Projects', icon: '⌘' },
  { to: '/admin/education', label: 'Education', icon: '✦' },
  { to: '/admin/certifications', label: 'Certifications', icon: '✓' },
  { to: '/admin/messages', label: 'Messages', icon: '✉' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export default function AdminLayout() {
  const { token, admin, checking, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!token && !checking) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  if (checking) return <PageLoading label="checking session…" />;

  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          soumik<span style={{ color: 'var(--accent)' }}>.</span>dev
          <span className="tag">ADMIN</span>
        </div>
        <nav className="admin-nav" aria-label="Admin">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setSidebarOpen(false)}>
              <span className="nav-ico" aria-hidden="true">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
          <div className="divider" />
          <a href={resolveUrl('/')} onClick={() => setSidebarOpen(false)}>
            <span className="nav-ico" aria-hidden="true">↗</span>
            View Live Site
          </a>
        </nav>
        <div className="side-foot">
          <button type="button" className="btn btn-outline btn-sm" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sidebar-backdrop show" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button type="button" className="admin-burger" onClick={() => setSidebarOpen(true)} aria-label="Open admin menu">
              ☰
            </button>
            <h1>{current?.label || 'Admin'}</h1>
          </div>
          <div className="who">
            <span>
              {admin?.email} <span className="pill green">{admin?.role}</span>
            </span>
            {admin?.name && (
              <span className="avatar" aria-hidden="true" style={{ display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>
                {admin.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </span>
            )}
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
