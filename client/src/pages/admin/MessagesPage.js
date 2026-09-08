import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, extractError } from '../../services/api';
import { AdminCard, ConfirmDelete, Spinner, useToast } from '../../components/admin/kit';
import { formatDate } from '../../utils/format';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
  { key: 'replied', label: 'Replied' },
];

export default function MessagesPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [meta, setMeta] = useState({ total: 0, unread: 0 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const toast = useToast();

  const load = (f = filter) =>
    adminAPI.contact
      .list(token, f === 'all' ? {} : { status: f })
      .then((res) => {
        setMessages(res.data.data);
        setMeta({ total: res.data.total, unread: res.data.unread });
      })
      .catch((err) => toast.show(extractError(err, 'Could not load messages.'), 'err'));

  useEffect(() => {
    load(filter).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filter]);

  const setStatus = async (id, status) => {
    try {
      await adminAPI.contact.setStatus(token, id, status);
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not update status.'), 'err');
    }
  };

  const remove = async (id) => {
    try {
      await adminAPI.contact.remove(token, id);
      toast.show('Message deleted.');
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not delete message.'), 'err');
    }
  };

  if (loading) return <Spinner />;

  return (
    <AdminCard
      title={`Contact messages (${meta.total})`}
      hint={`${meta.unread} unread. Messages arrive from the public contact form and are stored securely in MongoDB.`}
    >
      <div className="msg-filters">
        {FILTERS.map((f) => (
          <button key={f.key} type="button" className={`cat-chip ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">✉</div>
          <p>No messages here yet.</p>
        </div>
      ) : (
        messages.map((m) => (
          <article className={`msg-card ${m.status === 'unread' ? 'unread' : ''}`} key={m._id}>
            <div className="msg-head">
              <div>
                <div className="from">{m.name}</div>
                <a className="email" href={`mailto:${m.email}`}>{m.email}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`pill ${m.status === 'unread' ? 'green' : m.status === 'replied' ? 'blue' : 'yellow'}`}>{m.status}</span>
                <span className="when">{formatDate(m.createdAt)}</span>
              </div>
            </div>
            <div className="msg-subject">Subject: {m.subject}</div>
            {expanded === m._id ? (
              <p className="msg-body">{m.message}</p>
            ) : (
              <p className="msg-body" style={{ opacity: 0.7 }}>
                {m.message.length > 140 ? `${m.message.slice(0, 140)}…` : m.message}
              </p>
            )}
            <div className="msg-actions">
              <button type="button" className="btn btn-sm btn-outline" onClick={() => setExpanded(expanded === m._id ? null : m._id)}>
                {expanded === m._id ? 'Collapse' : 'View full'}
              </button>
              {m.status === 'unread' && (
                <button type="button" className="btn btn-sm btn-outline" onClick={() => setStatus(m._id, 'read')}>
                  Mark as read
                </button>
              )}
              {m.status !== 'replied' && (
                <button type="button" className="btn btn-sm btn-outline" onClick={() => setStatus(m._id, 'replied')}>
                  Mark as replied
                </button>
              )}
              <a className="btn btn-sm btn-primary" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}>
                Reply by email
              </a>
              <ConfirmDelete onConfirm={() => remove(m._id)} />
            </div>
          </article>
        ))
      )}
      {toast.node}
    </AdminCard>
  );
}
