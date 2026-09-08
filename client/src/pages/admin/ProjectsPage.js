import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, extractError } from '../../services/api';
import { AdminCard, ConfirmDelete, Field, LinesEditor, Spinner, useToast } from '../../components/admin/kit';
import { EditIcon } from '../../components/Icons';

const BLANK = {
  name: '',
  shortDescription: '',
  detailedDescription: '',
  techStack: [],
  features: [],
  live: '',
  github: '',
  admin: '',
  backend: '',
  featured: false,
};

export default function ProjectsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const load = () =>
    adminAPI.crud
      .list('projects', token)
      .then((res) => setItems(res.data.data))
      .catch((err) => toast.show(extractError(err, 'Could not load projects.'), 'err'));

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.shortDescription.trim().length < 10) {
      toast.show('Project name and a short description (10+ chars) are required.', 'err');
      return;
    }
    setBusy(true);
    try {
      const payload = {
        name: form.name,
        shortDescription: form.shortDescription,
        detailedDescription: form.detailedDescription,
        techStack: form.techStack.filter(Boolean),
        features: form.features.filter(Boolean),
        featured: form.featured,
        links: { live: form.live, github: form.github, admin: form.admin, backend: form.backend },
      };
      if (editingId) {
        await adminAPI.crud.update('projects', token, editingId, payload);
        toast.show('Project updated.');
      } else {
        await adminAPI.crud.create('projects', token, payload);
        toast.show('Project added.');
      }
      setForm(BLANK);
      setEditingId(null);
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not save project.'), 'err');
    } finally {
      setBusy(false);
    }
  };

  const toggleFeatured = async (project) => {
    try {
      await adminAPI.crud.update('projects', token, project._id, { featured: !project.featured });
      await load();
      toast.show(project.featured ? 'Removed from featured.' : 'Marked as featured.');
    } catch (err) {
      toast.show(extractError(err, 'Could not update.'), 'err');
    }
  };

  const remove = async (id) => {
    try {
      await adminAPI.crud.remove('projects', token, id);
      toast.show('Project deleted.');
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not delete.'), 'err');
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      shortDescription: p.shortDescription,
      detailedDescription: p.detailedDescription || '',
      techStack: p.techStack || [],
      features: p.features || [],
      live: p.links?.live || '',
      github: p.links?.github || '',
      admin: p.links?.admin || '',
      backend: p.links?.backend || '',
      featured: Boolean(p.featured),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Spinner />;

  return (
    <>
      <AdminCard
        title={editingId ? 'Edit project' : 'Add project'}
        hint="The featured project is displayed large at the top of the public Projects section. Project images can be added later via the tech stack of your choice — leave blank to use the built-in preview."
      >
        <form className="admin-form" onSubmit={submit}>
          <div className="grid-2">
            <Field label="Project name" required>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} />
            </Field>
            <Field label="Featured project">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingTop: 10 }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                  Show as the large featured project
                </span>
              </label>
            </Field>
          </div>

          <Field label="Short description" required hint={`${form.shortDescription.length}/300`}>
            <input className="input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} maxLength={300} />
          </Field>

          <Field label="Detailed description" hint={`${form.detailedDescription.length}/6000`}>
            <textarea className="textarea" style={{ minHeight: 130 }} value={form.detailedDescription} onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })} maxLength={6000} />
          </Field>

          <LinesEditor
            label="Tech stack (comma-separated or one per line)"
            value={form.techStack}
            onChange={(v) =>
              setForm({ ...form, techStack: typeof v === 'string' && v.includes(',') ? v.split(',') : v })
            }
            placeholder={'React, Node.js, Express, MongoDB'}
          />

          <LinesEditor
            label="Key features (one per line)"
            value={form.features}
            onChange={(features) => setForm({ ...form, features })}
            placeholder={'User authentication\nStripe checkout'}
          />

          <div className="grid-2">
            <Field label="Live demo URL">
              <input className="input" type="url" value={form.live} onChange={(e) => setForm({ ...form, live: e.target.value })} placeholder="https://…" />
            </Field>
            <Field label="GitHub URL">
              <input className="input" type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/…" />
            </Field>
          </div>
          <div className="grid-2">
            <Field label="Admin panel URL (optional)">
              <input className="input" type="url" value={form.admin} onChange={(e) => setForm({ ...form, admin: e.target.value })} placeholder="https://…" />
            </Field>
            <Field label="Backend API URL (optional)">
              <input className="input" type="url" value={form.backend} onChange={(e) => setForm({ ...form, backend: e.target.value })} placeholder="https://…" />
            </Field>
          </div>

          <div className="form-actions">
            <button type="submit" className={`btn btn-primary btn-sm ${busy ? 'loading' : ''}`} disabled={busy}>
              {busy && <span className="spinner" aria-hidden="true" />}
              {editingId ? 'Save changes' : '+ Add project'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditingId(null); setForm(BLANK); }}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`Projects (${items.length})`} hint="Order matches the public page.">
        {items.length === 0 ? (
          <div className="empty-state"><p>No projects yet.</p></div>
        ) : (
          <div className="list-rows">
            {items.map((p) => (
              <div className="list-row" key={p._id}>
                <div className="grow">
                  <div className="title">
                    {p.name}{' '}
                    {p.featured && <span className="pill green">featured</span>}
                  </div>
                  <div className="meta">
                    {(p.techStack || []).slice(0, 5).join(' · ')}
                    {p.links?.live && <> · live ↗</>}
                  </div>
                </div>
                <div className="row-actions">
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => toggleFeatured(p)}>
                    {p.featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => startEdit(p)}>
                    <EditIcon size={13} /> Edit
                  </button>
                  <ConfirmDelete onConfirm={() => remove(p._id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
      {toast.node}
    </>
  );
}
