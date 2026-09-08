import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NotFoundPage() {
  const location = useLocation();
  return (
    <main className="notfound">
      <div>
        <div className="code">404</div>
        <h1>Page not found</h1>
        <p className="path">GET {location.pathname}</p>
        <p>The route you're looking for doesn't exist.</p>
        <div style={{ marginTop: 26, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/">
            ← Back to portfolio
          </Link>
          <Link className="btn btn-outline" to="/admin/login">
            Admin login
          </Link>
        </div>
      </div>
    </main>
  );
}
