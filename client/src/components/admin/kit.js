import React, { useCallback, useRef, useState } from 'react';

/** ── Toast ─────────────────────────────────────────────────────── */
export function useToast(timeout = 3500) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const show = useCallback(
    (text, type = 'ok') => {
      clearTimeout(timer.current);
      setToast({ text, type });
      timer.current = setTimeout(() => setToast(null), timeout);
    },
    [timeout]
  );
  const node = toast ? (
    <div className={`toast ${toast.type === 'err' ? 'error' : ''}`} role="status" aria-live="polite">
      {toast.text}
    </div>
  ) : null;
  return { show, node };
}

/** ── Field wrapper ─────────────────────────────────────────────── */
export function Field({ label, required, hint, children, className = '' }) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label>
          {label} {required && <span className="req" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {hint && <div className="char-hint">{hint}</div>}
    </div>
  );
}

/** ── Array-of-strings editor (one item per line) ───────────────── */
export function LinesEditor({ value = [], onChange, placeholder, min = 0, label, hint }) {
  return (
    <Field
      label={label}
      hint={hint || `${value.length} line${value.length === 1 ? '' : 's'} — one item per line`}
    >
      <textarea
        className="textarea"
        value={value.join('\n')}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value.split('\n').map((s) => s.trimStart()).filter((s, i, arr) => s !== '' || i < arr.length - 1))
        }
        onBlur={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
        aria-label={label}
      />
      {value.length < min && (
        <div className="char-hint" style={{ color: 'var(--danger)' }}>
          At least {min} item{min === 1 ? '' : 's'} required
        </div>
      )}
    </Field>
  );
}

/** ── Two-step delete button ────────────────────────────────────── */
export function ConfirmDelete({ onConfirm, label = 'Delete', small = true }) {
  const [arming, setArming] = useState(false);
  if (!arming) {
    return (
      <button
        type="button"
        className={`btn btn-danger ${small ? 'btn-sm' : ''}`}
        onClick={() => setArming(true)}
      >
        {label}
      </button>
    );
  }
  return (
    <span style={{ display: 'inline-flex', gap: 6 }}>
      <button type="button" className="btn btn-sm btn-danger" onClick={() => onConfirm().finally(() => setArming(false))}>
        Confirm
      </button>
      <button type="button" className="btn btn-sm btn-ghost" onClick={() => setArming(false)}>
        Cancel
      </button>
    </span>
  );
}

/** ── Admin page header card ────────────────────────────────────── */
export function AdminCard({ title, hint, children, actions }) {
  return (
    <section className="admin-card">
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
          <div>
            {title && <h2>{title}</h2>}
            {hint && <p className="hint" style={{ marginBottom: 0 }}>{hint}</p>}
          </div>
          {actions}
        </div>
      )}
      {(title || actions) && <div style={{ height: 18 }} />}
      {children}
    </section>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="page-loading" style={{ minHeight: 220 }}>
      <div className="loader-ring" />
      <span>{label}</span>
    </div>
  );
}
