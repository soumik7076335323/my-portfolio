import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, extractError, resolveUrl } from '../../services/api';
import { AdminCard, Spinner, useToast } from '../../components/admin/kit';
import { formatDate } from '../../utils/format';

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024;

export default function PhotoPage() {
  const { token } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null); // {file, url}
  const [drag, setDrag] = useState(false);
  const fileInput = useRef(null);
  const toast = useToast();

  const load = () =>
    adminAPI.profile
      .get(token)
      .then((res) =>
        setPhoto({
          url: res.data.data.photoUrl,
          updatedAt: res.data.data.photoUpdatedAt,
        })
      )
      .catch((err) => toast.show(extractError(err, 'Could not load photo.'), 'err'));

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const pickFile = (file) => {
    if (!file) return;
    if (!ALLOWED.includes(file.type.toLowerCase())) {
      toast.show('Only JPG, JPEG, PNG and WEBP images are allowed.', 'err');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.show('Image must be under 2 MB.', 'err');
      return;
    }
    setPreview({ file, url: URL.createObjectURL(file) });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const upload = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      const res = await adminAPI.upload.photo(token, preview.file);
      setPhoto({ url: res.data.photo.url, updatedAt: res.data.photo.updatedAt });
      setPreview(null);
      if (fileInput.current) fileInput.current.value = '';
      toast.show('Profile photo updated — live on the portfolio now.');
    } catch (err) {
      toast.show(extractError(err, 'Upload failed.'), 'err');
    } finally {
      setBusy(false);
    }
  };

  const removePhoto = async () => {
    setBusy(true);
    try {
      const res = await adminAPI.upload.deletePhoto(token);
      setPhoto({ url: res.data.photo.url, updatedAt: null });
      toast.show('Photo removed. The site falls back to the bundled portrait.');
    } catch (err) {
      toast.show(extractError(err, 'Could not delete photo.'), 'err');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;

  const shown = preview ? preview.url : photo.url ? resolveUrl(photo.url) : null;

  return (
    <>
      <AdminCard
        title="Profile photo"
        hint="Upload a professional portrait (JPG / JPEG / PNG / WEBP, max 2 MB). The public site always shows the latest photo. Files are stored in Cloudinary when configured, otherwise on the server."
      >
        <div className="media-panel">
          <div className="media-preview">
            {shown ? (
              <img src={shown} alt="Currently set profile portrait" />
            ) : (
              <span className="placeholder">no photo uploaded</span>
            )}
          </div>
          <div className="media-info">
            <div className="file-name">Current profile photo</div>
            <div className="file-meta">
              {photo.url ? `updated ${formatDate(photo.updatedAt)}` : 'nothing uploaded yet'}
            </div>
            {photo.url && !preview && (
              <div className="media-actions">
                <button type="button" className="btn btn-sm btn-danger" onClick={removePhoto} disabled={busy}>
                  Delete photo
                </button>
              </div>
            )}

            <div
              className={`dropzone ${drag ? 'drag' : ''}`}
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInput.current?.click()}
              aria-label="Upload new photo"
            >
              <div className="big" aria-hidden="true">↥</div>
              <strong>Click to choose</strong> or drag &amp; drop a new photo here
              <div className="formats">JPG · JPEG · PNG · WEBP — up to 2 MB</div>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => pickFile(e.target.files?.[0])}
              aria-hidden="true"
              tabIndex={-1}
            />

            {preview && (
              <div className="preview-strip">
                <img src={preview.url} alt="Preview of the selected replacement portrait" />
                <div style={{ flex: 1 }}>
                  <div className="file-name">{preview.file.name}</div>
                  <div className="file-meta">{(preview.file.size / 1024).toFixed(0)} KB — preview before saving</div>
                  <div className="media-actions">
                    <button type="button" className="btn btn-sm btn-primary" onClick={upload} disabled={busy}>
                      {busy ? 'Uploading…' : 'Save new photo'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => {
                        setPreview(null);
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
        </div>
      </AdminCard>
      {toast.node}
    </>
  );
}
