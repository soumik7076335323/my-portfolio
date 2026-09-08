import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, authAPI, extractError } from '../../services/api';
import { AdminCard, Field, Spinner, useToast } from '../../components/admin/kit';

const STEP_BLANK = [
  { label: 'BUILD', detail: 'React UIs & REST APIs' },
  { label: 'SHIP', detail: 'Tested & integrated releases' },
  { label: 'SCALE', detail: 'Cloud-deployed & data-driven' },
];

export default function SettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState(null);
  const [steps, setSteps] = useState(STEP_BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);
  const toast = useToast();

  useEffect(() => {
    adminAPI.settings
      .get(token)
      .then((res) => {
        const s = res.data.data;
        setSettings({
          seoTitle: s.seoTitle || '',
          seoDescription: s.seoDescription || '',
          footerNote: s.footerNote || '',
          showBuildShipScale: s.showBuildShipScale !== false,
        });
        if (Array.isArray(s.buildShipScale) && s.buildShipScale.length === 3) {
          setSteps(s.buildShipScale.map((x) => ({ label: x.label || '', detail: x.detail || '' })));
        }
      })
      .catch((err) => toast.show(extractError(err, 'Could not load settings.'), 'err'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.settings.update(token, { ...settings, buildShipScale: steps });
      toast.show('Settings saved — live on the portfolio.');
    } catch (err) {
      toast.show(extractError(err, 'Could not save settings.'), 'err');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword.length < 8) {
      toast.show('New password must be at least 8 characters.', 'err');
      return;
    }
    if (pw.newPassword !== pw.confirm) {
      toast.show('New passwords do not match.', 'err');
      return;
    }
    setSavingPw(true);
    try {
      await authAPI.changePassword(token, {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      toast.show('Password changed.');
    } catch (err) {
      toast.show(extractError(err, 'Could not change password.'), 'err');
    } finally {
      setSavingPw(false);
    }
  };

  if (loading || !settings) return <Spinner />;

  return (
    <>
      <AdminCard title="Site settings" hint="SEO metadata and the BUILD → SHIP → SCALE strip shown under the hero.">
        <form className="admin-form" onSubmit={saveSettings}>
          <Field label="Browser tab title (SEO)" required>
            <input className="input" value={settings.seoTitle} onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })} maxLength={120} />
          </Field>
          <Field label="Meta description (SEO)" hint={`${settings.seoDescription.length}/300`}>
            <textarea className="textarea" style={{ minHeight: 80 }} value={settings.seoDescription} onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })} maxLength={300} />
          </Field>
          <Field label="Footer note">
            <input className="input" value={settings.footerNote} onChange={(e) => setSettings({ ...settings, footerNote: e.target.value })} maxLength={200} />
          </Field>

          <Field label="Hero strip">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingTop: 8 }}>
              <input
                type="checkbox"
                checked={settings.showBuildShipScale}
                onChange={(e) => setSettings({ ...settings, showBuildShipScale: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>Show the BUILD → SHIP → SCALE strip</span>
            </label>
          </Field>

          <div className="grid-3">
            {steps.map((s, i) => (
              <Field label={`Step ${i + 1}`} key={i}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <input
                    className="input"
                    value={s.label}
                    aria-label={`Step ${i + 1} label`}
                    onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, label: e.target.value.toUpperCase() } : x)))}
                    maxLength={40}
                  />
                  <input
                    className="input"
                    value={s.detail}
                    aria-label={`Step ${i + 1} detail`}
                    onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, detail: e.target.value } : x)))}
                    maxLength={120}
                  />
                </div>
              </Field>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className={`btn btn-primary btn-sm ${saving ? 'loading' : ''}`} disabled={saving}>
              {saving && <span className="spinner" aria-hidden="true" />}
              Save settings
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title="Change admin password" hint="Passwords are hashed with bcrypt on the server — this is the only place to change it after setup.">
        <form className="admin-form" onSubmit={changePassword}>
          <div className="grid-3">
            <Field label="Current password" required>
              <input className="input" type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} autoComplete="current-password" />
            </Field>
            <Field label="New password" required>
              <input className="input" type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} autoComplete="new-password" placeholder="min. 8 characters" />
            </Field>
            <Field label="Confirm new password" required>
              <input className="input" type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" />
            </Field>
          </div>
          <div className="form-actions">
            <button type="submit" className={`btn btn-primary btn-sm ${savingPw ? 'loading' : ''}`} disabled={savingPw}>
              {savingPw && <span className="spinner" aria-hidden="true" />}
              Update password
            </button>
          </div>
        </form>
      </AdminCard>
      {toast.node}
    </>
  );
}
