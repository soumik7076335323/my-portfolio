import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { extractError } from '../../services/api';
import { Field } from '../../components/admin/kit';

export default function AdminLogin() {
  const { token, checking, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (token && !checking) return <Navigate to="/admin" replace />;
  if (checking) {
    return (
      <div className="login-page">
        <div className="page-loading">
          <div className="loader-ring" />
          <span>checking session…</span>
        </div>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(extractError(err, 'Login failed. Check your credentials.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={onSubmit} noValidate>
        <div className="logo">
          soumik<span className="dot">.</span>dev<span style={{ color: 'var(--muted)', fontWeight: 500 }}>/admin</span>
        </div>
        <p className="sub">Sign in to manage your portfolio content.</p>

        <Field label="Email" required>
          <input
            className="input"
            type="email"
            name="email"
            placeholder="admin@soumik.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </Field>
        <Field label="Password" required>
          <input
            className="input"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Field>

        {error && (
          <p className="form-status err" role="alert" style={{ marginBottom: 14 }}>
            {error}
          </p>
        )}

        <button type="submit" className={`btn btn-primary ${busy ? 'loading' : ''}`} disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
          {busy && <span className="spinner" aria-hidden="true" />}
          {busy ? 'Signing in…' : 'Sign In'}
        </button>

        <div className="hint-box">
          First time? The admin account is seeded from server/.env
          <br />
          (ADMIN_EMAIL / ADMIN_PASSWORD).
        </div>

        <div className="login-back">
          <Link to="/">← Back to portfolio</Link>
        </div>
      </form>
    </main>
  );
}
