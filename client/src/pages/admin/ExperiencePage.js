import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, extractError } from '../../services/api';
import { AdminCard, ConfirmDelete, Field, LinesEditor, Spinner, useToast } from '../../components/admin/kit';
import { EditIcon } from '../../components/Icons';

const BLANK = {
  company: '',
  position: '',
  employmentType: 'Full-time',
  startDate: '',
  endDate: '',
  description: [],
  technologies: [],
};

export default function ExperiencePage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const load = () =>
    adminAPI.crud
      .list('experience', token)
      .then((res) => setItems(res.data.data))
      .catch((err) => toast.show(extractError(err, 'Could not load experience.'), 'err'));

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim() || !form.startDate.trim()) {
      toast.show('Company, position and start date are required.', 'err');
      return;
    }
    setBusy(true);
    try {
      const payload = {
        ...form,
        description: form.description.filter(Boolean),
        technologies: form.technologies.filter(Boolean),
      };
      if (editingId) {
        await adminAPI.crud.update('experience', token, editingId, payload);
        toast.show('Experience updated.');
      } else {
        await adminAPI.crud.create('experience', token, payload);
        toast.show('Experience added.');
      }
      setForm(BLANK);
      setEditingId(null);
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not save experience.'), 'err');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    try {
      await adminAPI.crud.remove('experience', token, id);
      toast.show('Experience deleted.');
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not delete.'), 'err');
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <AdminCard
        title={editingId ? 'Edit experience' : 'Add experience'}
        hint="Dates are shown exactly as typed (e.g. 02/2024 or Present). Bullet points appear in the public timeline."
      >
        <form className="admin-form" onSubmit={submit}>
          <div className="grid-2">
            <Field label="Company" required>
              <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} maxLength={120} />
            </Field>
            <Field label="Position" required>
              <input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} maxLength={120} />
            </Field>
          </div>
          <div className="grid-2">
            <Field label="Employment type">
              <input className="input" list="emp-types" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} maxLength={60} />
              <datalist id="emp-types">
                <option value="Full-time" />
                <option value="Part-time" />
                <option value="Freelance" />
                <option value="Contract" />
                <option value="Internship" />
              </datalist>
            </Field>
            <div className="grid-2" style={{ gap: '0 12px' }}>
              <Field label="Start date" required>
                <input className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="02/2024" maxLength={20} />
              </Field>
              <Field label="End date">
                <input className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="Present — leave blank for current" maxLength={20} />
              </Field>
            </div>
          </div>
          <LinesEditor
            label="Description (bullet points, one per line)"
            value={form.description}
            onChange={(description) => setForm({ ...form, description })}
            placeholder={'Delivered end-to-end MERN applications…\nEngineered RESTful APIs…'}
          />
          <LinesEditor
            label="Technologies (comma-separated or one per line)"
            value={form.technologies}
            onChange={(technologies) =>
              setForm({ ...form, technologies: String(technologies).includes(',') && typeof technologies === 'string' ? technologies.split(',') : technologies })
            }
            placeholder={'React.js, Node.js, MongoDB'}
          />
          <div className="form-actions">
            <button type="submit" className={`btn btn-primary btn-sm ${busy ? 'loading' : ''}`} disabled={busy}>
              {busy && <span className="spinner" aria-hidden="true" />}
              {editingId ? 'Save changes' : '+ Add experience'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditingId(null); setForm(BLANK); }}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`Experience entries (${items.length})`} hint="Newest role should be first — use the dashboard order or edit dates.">
        {items.length === 0 ? (
          <div className="empty-state"><p>No experience entries yet.</p></div>
        ) : (
          <div className="list-rows">
            {items.map((it) => (
              <div className="list-row" key={it._id}>
                <div className="grow">
                  <div className="title">{it.position} — {it.company}</div>
                  <div className="meta">{it.startDate} – {it.endDate || 'Present'} · {it.employmentType} · {it.technologies?.length || 0} techs</div>
                </div>
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setEditingId(it._id);
                      setForm({
                        company: it.company,
                        position: it.position,
                        employmentType: it.employmentType || 'Full-time',
                        startDate: it.startDate,
                        endDate: it.endDate || '',
                        description: it.description || [],
                        technologies: it.technologies || [],
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
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
