import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, extractError, resolveUrl } from '../../services/api';
import { AdminCard, ConfirmDelete, Spinner, useToast } from '../../components/admin/kit';
import { formatDate, formatBytes } from '../../utils/format';

const MAX_SIZE = 5 * 1024 * 1024;

export default function ResumePage() {
  const { token } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(null); // File chosen but not saved
  const fileInput = useRef(null);
  const toast = useToast();

  const load = () =>
    adminAPI.profile
      .get(token)
      .then((res) =>
        setResume({
          fileName: res.data.data.resumeFileName,
          fileSize: res.data.data.resumeFileSize,
          updatedAt: res.data.data.resumeUpdatedAt,
        })
      )
      .catch((err) => toast.show(extractError(err, 'Could not load resume info.'), 'err'));

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const pickFile = (file) => {
    if (!file) return;
    if (file.type.toLowerCase() !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.show('Only PDF files are allowed.', 'err');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.show('PDF must be under 5 MB.', 'err');
      return;
    }
    setPending(file);
  };

  const upload = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      const res = await adminAPI.upload.resume(token, pending);
      setResume(res.data.resume);
      setPending(null);
      if (fileInput.current) fileInput.current.value = '';
      toast.show('Resume replaced — every "Download Resume" button now serves the new file.');
    } catch (err) {
      toast.show(extractError(err, 'Upload failed.'), 'err');
    } finally {
      setBusy(false);
    }
  };

  const removeResume = async () => {
    setBusy(true);
    try {
      await adminAPI.upload.deleteResume(token);
      setResume({ fileName: '', fileSize: 0, updatedAt: null });
      toast.show('Resume removed.');
    } catch (err) {
      toast.show(extractError(err, 'Could not delete resume.'), 'err');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <AdminCard
        title="Resume management"
        hint="The public navbar, hero and footer “Download Resume” buttons all point to the latest file uploaded here — no code changes needed. PDF only, max 5 MB."
      >
        <div className="media-info" style={{ minWidth: '100%' }}>
          <div className="file-name" style={{ fontSize: '1.05rem' }}>
            Current resume: {resume.fileName || '— none uploaded —'}
          </div>
          {resume.fileName && (
            <div className="file-meta">
              {formatBytes(resume.fileSize)} · updated {formatDate(resume.updatedAt)}
            </div>
          )}

          <div className="media-actions">
            {resume.fileName && (
              <>
                <a className="btn btn-sm btn-outline" href={resolveUrl('/api/resume/download')} target="_blank" rel="noopener noreferrer">
                  Preview
                </a>
                <a className="btn btn-sm btn-primary" href={resolveUrl('/api/resume/download')} download>
                  Download
                </a>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => fileInput.current?.click()} disabled={busy}>
                  Replace resume
                </button>
                <ConfirmDelete label="Delete" onConfirm={removeResume} />
              </>
            )}
            {!resume.fileName && (
              <button type="button" className="btn btn-sm btn-primary" onClick={() => fileInput.current?.click()} disabled={busy}>
                Upload resume (PDF)
              </button>
            )}
          </div>

          <div
            className="dropzone"
            onClick={() => fileInput.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInput.current?.click()}
            aria-label="Upload resume PDF"
          >
            <div className="big" aria-hidden="true">⎘</div>
            <strong>Click to choose</strong> or drop a new resume PDF here
            <div className="formats">PDF only — up to 5 MB</div>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => pickFile(e.target.files?.[0])}
            aria-hidden="true"
            tabIndex={-1}
          />

          {pending && (
            <div className="preview-strip">
              <span style={{ fontSize: '1.6rem' }} aria-hidden="true">📄</span>
              <div style={{ flex: 1 }}>
                <div className="file-name">{pending.name}</div>
                <div className="file-meta">{(pending.size / 1024).toFixed(0)} KB — ready to replace the current resume</div>
                <div className="media-actions">
                  <button type="button" className="btn btn-sm btn-primary" onClick={upload} disabled={busy}>
                    {busy ? 'Uploading…' : 'Save new resume'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      setPending(null);
                      if (fileInput.current) fileInput.current.value = '';
                    }}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminCard>
      {toast.node}
    </>
  );
}
