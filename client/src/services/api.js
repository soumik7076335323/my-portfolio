import axios from 'axios';

/**
 * API base URL:
 *  - local dev: '' (same origin; CRA dev server proxies /api + /uploads → :5000)
 *  - production: set REACT_APP_API_URL to the API root (e.g. https://x.onrender.com)
 */
export const API_BASE = process.env.REACT_APP_API_URL || '';

/** Resolve root-relative asset URLs (/uploads/…) against the API origin. */
export const resolveUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url}`;
};

const instance = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

const attach = (token) => ({ Authorization: `Bearer ${token}` });

const extractError = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || fallback;

// ── Public portfolio endpoints ───────────────────────────────────
export const publicAPI = {
  getProfile: () => instance.get('/profile'),
  getSkills: () => instance.get('/skills'),
  getExperience: () => instance.get('/experience'),
  getProjects: () => instance.get('/projects'),
  getEducation: () => instance.get('/education'),
  getCertifications: () => instance.get('/certifications'),
  getSettings: () => instance.get('/settings'),
  sendContact: (payload) => instance.post('/contact', payload),
};

// ── Auth ─────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => instance.post('/auth/login', { email, password }),
  me: (token) => instance.get('/auth/me', { headers: attach(token) }),
  changePassword: (token, payload) =>
    instance.put('/auth/change-password', payload, { headers: attach(token) }),
};

// ── Admin (token-protected) ──────────────────────────────────────
const adminGet = (path, token) => instance.get(path, { headers: attach(token) });
const adminSend = (method, path, token, data) =>
  instance({ method, url: path, data, headers: attach(token) });

export const adminAPI = {
  overview: (token) => adminGet('/overview', token),

  profile: {
    get: (token) => adminGet('/profile', token),
    update: (token, data) => adminSend('put', '/profile', token, data),
  },
  settings: {
    get: (token) => adminGet('/settings', token),
    update: (token, data) => adminSend('put', '/settings', token, data),
  },
  crud: {
    list: (resource, token) => adminGet(`/${resource}`, token),
    create: (resource, token, data) => adminSend('post', `/${resource}`, token, data),
    update: (resource, token, id, data) => adminSend('put', `/${resource}/${id}`, token, data),
    remove: (resource, token, id) =>
      instance.delete(`/${resource}/${id}`, { headers: attach(token) }),
    reorder: (resource, token, ids) =>
      adminSend('put', `/${resource}/reorder`, token, { ids }),
  },
  contact: {
    list: (token, params) => instance.get('/contact', { params, headers: attach(token) }),
    setStatus: (token, id, status) =>
      adminSend('put', `/contact/${id}/status`, token, { status }),
    remove: (token, id) =>
      instance.delete(`/contact/${id}`, { headers: attach(token) }),
  },
  upload: {
    photo: (token, file) => {
      const fd = new FormData();
      fd.append('photo', file);
      return instance.post('/upload/photo', fd, {
        headers: { ...attach(token), 'Content-Type': 'multipart/form-data' },
      });
    },
    deletePhoto: (token) =>
      instance.delete('/upload/photo', { headers: attach(token) }),
    resume: (token, file) => {
      const fd = new FormData();
      fd.append('resume', file);
      return instance.post('/upload/resume', fd, {
        headers: { ...attach(token), 'Content-Type': 'multipart/form-data' },
      });
    },
    deleteResume: (token) =>
      instance.delete('/upload/resume', { headers: attach(token) }),
  },
};

export { extractError };
