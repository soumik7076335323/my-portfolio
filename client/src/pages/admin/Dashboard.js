import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, extractError, resolveUrl } from '../../services/api';
import { AdminCard, Spinner } from '../../components/admin/kit';
import { formatDate, formatBytes } from '../../utils/format';

export default function Dashboard() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminAPI
      .overview(token)
      .then((res) => setData(res.data.data))
      .catch((err) => setError(extractError(err, 'Could not load dashboard.')));
  }, [token]);

  if (error) {
    return (
      <div className="error-banner">
        <h3>Could not load dashboard</h3>
        <p>{error}</p>
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }
  if (!data) return <Spinner label="loading dashboard…" />;

  const { counts, resume, photo, profileComplete, recentMessages } = data;

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="ico" aria-hidden="true">⌘</span>
          <div>
            <div className="num">{counts.projects}</div>
            <div className="lbl">Projects</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="ico" aria-hidden="true">⚡</span>
          <div>
            <div className="num">{counts.skills}</div>
            <div className="lbl">Skills</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="ico" aria-hidden="true">✉</span>
          <div>
            <div className="num">{counts.messages}</div>
            <div className="lbl">Messages</div>
            <div className="sub">{counts.unreadMessages} unread</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="ico" aria-hidden="true">◷</span>
          <div>
            <div className="num">{counts.experience}</div>
            <div className="lbl">Experience entries</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="ico" aria-hidden="true">✓</span>
          <div>
            <div className="num">{counts.certifications}</div>
            <div className="lbl">Certifications</div>
          </div>
        </div>
      </div>

      <div className="overview-row">
        <AdminCard title="Resume" hint="What visitors download right now.">
          {resume.fileName ? (
            <>
              <div className="file-name">{resume.fileName}</div>
              <div className="file-meta">
                {formatBytes(resume.fileSize)} · updated {formatDate(resume.updatedAt)}
              </div>
              <div className="media-actions">
                <a className="btn btn-sm btn-outline" href={resolveUrl('/api/resume/download')} target="_blank" rel="noopener noreferrer">
                  Preview
                </a>
                <Link className="btn btn-sm btn-primary" to="/admin/resume">
                  Manage
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>No resume uploaded yet.</p>
              <Link className="btn btn-sm btn-primary" to="/admin/resume" style={{ marginTop: 10 }}>
                Upload resume
              </Link>
            </div>
          )}
        </AdminCard>

        <AdminCard title="Profile status" hint="Public profile completeness.">
          <ul className="check-list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li className="item">
              <span className={profileComplete ? 'ok' : 'missing'}>{profileComplete ? '✓' : '!'}</span>
              {profileComplete ? 'Core profile is complete' : 'Core profile is incomplete'}
            </li>
            <li className="item">
              <span className={photo.url ? 'ok' : 'missing'}>{photo.url ? '✓' : '!'}</span>
              {photo.url ? `Photo updated ${formatDate(photo.updatedAt)}` : 'No profile photo'}
            </li>
            <li className="item">
              <span className={resume.fileName ? 'ok' : 'missing'}>{resume.fileName ? '✓' : '!'}</span>
              {resume.fileName ? 'Resume is live' : 'No resume'}
            </li>
          </ul>
          <div className="media-actions">
            <Link className="btn btn-sm btn-outline" to="/admin/profile">
              Edit profile
            </Link>
            <Link className="btn btn-sm btn-outline" to="/admin/photo">
              Manage photo
            </Link>
          </div>
        </AdminCard>
      </div>

      <AdminCard
        title="Recent messages"
        hint="Latest contact form submissions."
        actions={
          <Link className="btn btn-sm btn-outline" to="/admin/messages">
            View all
          </Link>
        }
      >
        {recentMessages.length === 0 ? (
          <div className="empty-state">
            <div className="glyph">✉</div>
            <p>No messages yet — they will land here when visitors use the contact form.</p>
          </div>
        ) : (
          <div className="list-rows">
            {recentMessages.map((m) => (
              <div className="list-row" key={m._id}>
                <div className="grow">
                  <div className="title">
                    {m.name} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>· {m.subject}</span>
                  </div>
                  <div className="meta">
                    {formatDate(m.createdAt)} · <span className={`pill ${m.status === 'unread' ? 'green' : m.status === 'replied' ? 'blue' : ''}`}>{m.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </>
  );
}
