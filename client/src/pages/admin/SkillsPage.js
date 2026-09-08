import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, extractError } from '../../services/api';
import { AdminCard, ConfirmDelete, Field, Spinner, useToast } from '../../components/admin/kit';
import { ArrowUpIcon, ArrowDownIcon, EditIcon } from '../../components/Icons';

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'Authentication & Security',
  'Payment & Uploads',
  'Developer Tools',
  'Deployment',
];

const BLANK = { name: '', category: 'Frontend' };

export default function SkillsPage() {
  const { token } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('All');
  const toast = useToast();

  const load = () =>
    adminAPI.crud
      .list('skills', token)
      .then((res) => setSkills(res.data.data))
      .catch((err) => toast.show(extractError(err, 'Could not load skills.'), 'err'));

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) {
      toast.show('Skill name and category are required.', 'err');
      return;
    }
    setBusy(true);
    try {
      if (editingId) {
        await adminAPI.crud.update('skills', token, editingId, form);
        toast.show('Skill updated.');
      } else {
        await adminAPI.crud.create('skills', token, form);
        toast.show('Skill added.');
      }
      setForm(BLANK);
      setEditingId(null);
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not save skill.'), 'err');
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({ name: s.name, category: s.category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    try {
      await adminAPI.crud.remove('skills', token, id);
      toast.show('Skill deleted.');
      await load();
    } catch (err) {
      toast.show(extractError(err, 'Could not delete skill.'), 'err');
    }
  };

  const move = async (index, dir) => {
    const arr = [...skills];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setSkills(arr);
    try {
      const res = await adminAPI.crud.reorder('skills', token, arr.map((s) => s._id));
      setSkills(res.data.data);
    } catch (err) {
      toast.show(extractError(err, 'Reorder failed.'), 'err');
      load();
    }
  };

  if (loading) return <Spinner />;

  const visible = filter === 'All' ? skills : skills.filter((s) => s.category === filter);
  const catOptions = [...new Set([...CATEGORIES, ...skills.map((s) => s.category)])];

  return (
    <>
      <AdminCard
        title={editingId ? 'Edit skill' : 'Add a skill'}
        hint="Skills are grouped by category on the public page. Use the buttons below to reorder."
      >
        <form className="admin-form" onSubmit={submit}>
          <div className="grid-2">
            <Field label="Skill name" required>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. React.js"
                maxLength={60}
              />
            </Field>
            <Field label="Category" required>
              <input
                className="input"
                list="skill-categories"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Choose or type a category"
                maxLength={60}
              />
              <datalist id="skill-categories">
                {catOptions.map((c) => (
                  <option value={c} key={c} />
                ))}
              </datalist>
            </Field>
          </div>
          <div className="form-actions">
            <button type="submit" className={`btn btn-primary btn-sm ${busy ? 'loading' : ''}`} disabled={busy}>
              {busy && <span className="spinner" aria-hidden="true" />}
              {editingId ? 'Save changes' : '+ Add skill'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setEditingId(null);
                  setForm(BLANK);
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`All skills (${skills.length})`} hint="Reorder with the arrows — order applies within the full list and per category display.">
        <div className="cat-chips">
          {['All', ...catOptions].map((c) => (
            <button
              key={c}
              type="button"
              className={`cat-chip ${filter === c ? 'active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="empty-state">
            <p>No skills in this category yet.</p>
          </div>
        ) : (
          <div className="list-rows">
            {visible.map((s) => {
              const realIndex = skills.findIndex((x) => x._id === s._id);
              return (
                <div className="list-row" key={s._id}>
                  <div style={{ display: 'grid', gap: 2 }}>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '2px 6px' }} onClick={() => move(realIndex, -1)} aria-label={`Move ${s.name} up`}>
                      <ArrowUpIcon size={14} />
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '2px 6px' }} onClick={() => move(realIndex, 1)} aria-label={`Move ${s.name} down`}>
                      <ArrowDownIcon size={14} />
                    </button>
                  </div>
                  <div className="grow">
                    <div className="title">{s.name}</div>
                    <div className="meta">{s.category}</div>
                  </div>
                  <div className="row-actions">
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => startEdit(s)}>
                      <EditIcon size={13} /> Edit
                    </button>
                    <ConfirmDelete onConfirm={() => remove(s._id)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
      {toast.node}
    </>
  );
}
