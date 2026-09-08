/** Format an ISO date as a short human date, e.g. "05 Sep 2026". */
export const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return '—';
  }
};

/** Format bytes into a readable size. */
export const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/** Basic email shape check for quick client-side feedback. */
export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value || '');
