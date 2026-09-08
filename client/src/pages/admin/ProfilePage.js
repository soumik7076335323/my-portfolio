import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, extractError } from '../../services/api';
import { AdminCard, Field, Spinner, useToast } from '../../components/admin/kit';

const BLANK = {
  name: '',
  title: '',
  tagline: '',
  summary: '',
  email: '',
  phone: '',
  location: '',
  github: '',
  linkedin: '',
  website: '',
};

export default function ProfilePage() {
  const { token, updateAdminName } = useAuth();
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    adminAPI.profile
      .get(token)
      .then((res) => {
        const p = res.data.data;
        setForm({ ...BLANK, ...Object.fromEntries(Object.keys(BLANK).map((k) => [k, p[k] ?? ''])) });
      })
      .catch((err) => toast.show(extractError(err, 'Could not load profile.'), 'err'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.profile.update(token, form);
      updateAdminName(form.name);
      toast.show('Profile saved — changes are live on the portfolio.');
    } catch (err) {
      toast.show(extractError(err, 'Could not save profile.'), 'err');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <AdminCard
        title="Profile"
        hint="This information appears across the public portfolio (hero, about, contact, footer). Changes go live immediately after saving."
      >
        <form className="admin-form" onSubmit={onSubmit}>
          <div className="grid-2">
            <Field label="Full name" required>
              <input className="input" value={form.name} onChange={set('name')} maxLength={100} />
            </Field>
            <Field label="Professional title" required>
              <input className="input" value={form.title} onChange={set('title')} placeholder="Full Stack MERN Developer" maxLength={120} />
            </Field>
          </div>

          <Field label="Hero tagline" hint={`${form.tagline.length}/300`} className="full">
            <input
              className="input"
              value={form.tagline}
              onChange={set('tagline')}
              placeholder="Building scalable, secure and data-driven web applications…"
              maxLength={300}
            />
          </Field>

          <Field label="About / professional summary" hint={`${form.summary.length}/4000 characters`}>
            <textarea className="textarea" style={{ minHeight: 170 }} value={form.summary} onChange={set('summary')} maxLength={4000} />
          </Field>

          <div className="grid-3">
            <Field label="Email">
              <input className="input" type="email" value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Phone">
              <input className="input" value={form.phone} onChange={set('phone')} maxLength={30} />
            </Field>
            <Field label="Location">
              <input className="input" value={form.location} onChange={set('location')} maxLength={120} />
            </Field>
          </div>

          <div className="grid-3">
            <Field label="GitHub URL">
              <input className="input" type="url" value={form.github} onChange={set('github')} placeholder="https://github.com/…" />
            </Field>
            <Field label="LinkedIn URL">
              <input className="input" type="url" value={form.linkedin} onChange={set('linkedin')} placeholder="https://www.linkedin.com/in/…" />
            </Field>
            <Field label="Website (optional)">
              <input className="input" type="url" value={form.website} onChange={set('website')} placeholder="https://…" />
            </Field>
          </div>

          <div className="form-actions">
            <button type="submit" className={`btn btn-primary ${saving ? 'loading' : ''}`} disabled={saving}>
              {saving && <span className="spinner" aria-hidden="true" />}
              {saving ? 'Saving…' : 'Save profile'}
            </button>
            <span className="inline-note">Saved to MongoDB — the public site reads it live.</span>
          </div>
        </form>
      </AdminCard>
      {toast.node}
    </>
  );
}
