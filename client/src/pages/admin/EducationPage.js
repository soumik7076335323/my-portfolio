import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, extractError } from '../../services/api';
import { AdminCard, ConfirmDelete, Field, Spinner, useToast } from '../../components/admin/kit';
import { EditIcon } from '../../components/Icons';

const BLANK = {
  degree: '',
  field: '',
  institution: '',
  cgpa: '',
  startYear: '',
  endYear: '',
  description: '',
};

export default function EducationPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const load = () =>
    adminAPI.crud
      .list('education', token)
      .then((res) => setItems(res.data.data))
      .catch((err) => toast.show(extractError(err, 'Could not load education.'), 'err'));

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.degree.trim() || !form.institution.trim()) {
      toast.show('Degree and institution are required.', 'err');
      return;
    }
    setBusy(true);
    try {
      if (editingId) {
        await adminAPI.crud.update('education', token, editingId, form);
        toast.show('Education updated.');
      } else {
        await adminAPI.crud.create('education', token, form);
        toast.show('Education added.');
      }
      setForm(BLANK);
      setEditingId(null);
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not save.'), 'err');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    try {
      await adminAPI.crud.remove('education', token, id);
      toast.show('Entry deleted.');
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not delete.'), 'err');
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <AdminCard title={editingId ? 'Edit education' : 'Add education'} hint="Shown in the Education section. Only fill what applies — leave fields blank rather than inventing details.">
        <form className="admin-form" onSubmit={submit}>
          <div className="grid-2">
            <Field label="Degree" required>
              <input className="input" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Bachelor of Engineering" maxLength={140} />
            </Field>
            <Field label="Field / specialisation">
              <input className="input" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="Information Technology" maxLength={140} />
            </Field>
          </div>
          <div className="grid-2">
            <Field label="Institution" required>
              <input className="input" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} maxLength={160} />
            </Field>
            <div className="grid-3" style={{ gap: '0 12px' }}>
              <Field label="CGPA / %">
                <input className="input" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} placeholder="6.57" maxLength={20} />
              </Field>
              <Field label="From">
                <input className="input" value={form.startYear} onChange={(e) => setForm({ ...form, startYear: e.target.value })} placeholder="2016" maxLength={10} />
              </Field>
              <Field label="To">
                <input className="input" value={form.endYear} onChange={(e) => setForm({ ...form, endYear: e.target.value })} placeholder="2020" maxLength={10} />
              </Field>
            </div>
          </div>
          <Field label="Notes (optional)">
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={2000} style={{ minHeight: 80 }} />
          </Field>
          <div className="form-actions">
            <button type="submit" className={`btn btn-primary btn-sm ${busy ? 'loading' : ''}`} disabled={busy}>
              {busy && <span className="spinner" aria-hidden="true" />}
              {editingId ? 'Save changes' : '+ Add education'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditingId(null); setForm(BLANK); }}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`Education entries (${items.length})`}>
        {items.length === 0 ? (
          <div className="empty-state"><p>No education entries yet.</p></div>
        ) : (
          <div className="list-rows">
            {items.map((it) => (
              <div className="list-row" key={it._id}>
                <div className="grow">
                  <div className="title">{it.degree}{it.field ? ` — ${it.field}` : ''}</div>
                  <div className="meta">{it.institution} · {it.startYear}–{it.endYear}{it.cgpa ? ` · CGPA ${it.cgpa}` : ''}</div>
                </div>
                <div className="row-actions">
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => { setEditingId(it._id); setForm({ ...BLANK, ...it, description: it.description || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <EditIcon size={13} /> Edit
                  </button>
                  <ConfirmDelete onConfirm={() => remove(it._id)} />
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
