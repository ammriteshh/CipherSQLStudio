import axios from 'axios';

const candidates = [];

// Check for environment variables (CRA uses REACT_APP_, Vite uses VITE_)
const rawEnvUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;
const envUrl = (rawEnvUrl && rawEnvUrl.trim()) ? rawEnvUrl.trim() : null;

// If env var is set, it's the primary candidate
if (envUrl) {
  candidates.push(envUrl.replace(/\/+$/, ''));
}

const isProd = process.env.NODE_ENV === 'production';

// Add current origin as candidate (for relative paths or same-domain hosting)
if (typeof window !== 'undefined' && window.location) {
  const origin = window.location.origin.replace(/\/+$/, '');
  candidates.push(`${origin}/api`);
  candidates.push(origin);
}

// Add hardcoded fallbacks for development or specific deployments
if (!isProd) {
  candidates.push('http://localhost:5000/api');
  candidates.push('http://localhost:5000');
}

// Add Render fallback
candidates.push('https://cipher-sql-backend.onrender.com/api');


const normalize = (s) => s ? s.replace(/\/+$/, '') : s;

// Default API_BASE_URL logic
let API_BASE_URL = '';
if (envUrl) {
  API_BASE_URL = normalize(envUrl);
} else if (isProd) {
  // In production, default to the relative /api if no env var is set, 
  // assuming frontend/backend are on same domain or proxy is set up.
  // However, for this specific user issue, we know it might be separate.
  // So we'll trust the candidates probing or fall back to the likely render URL.
  API_BASE_URL = normalize("https://cipher-sql-backend.onrender.com/api");
} else {
  API_BASE_URL = 'http://localhost:5000/api';
}

const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (err) => {
    try {
      if (!err.response) {
        err.customMessage = 'Cannot reach server / backend is down. Please check the backend service and CORS settings.';
      } else {
        err.customMessage = `Error ${err.response.status}: ${err.response.data?.message || 'Request failed'}`;
      }

      console.error('API ERROR:', {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
    } catch (e) {
      console.error('API interceptor logging error:', e);
    }

    return Promise.reject(err);
  }
);

export async function detectApiBase(timeout = 5000) {
  const tried = [];
  const uniqueCandidates = [...new Set(candidates.map(c => (c || '').replace(/\/+$/, '')))].filter(Boolean);

  for (const cand of uniqueCandidates) {
    const variants = [cand, `${cand}/api`];
    for (const v of variants) {
      if (tried.includes(v)) continue;
      tried.push(v);

      const url = v.replace(/\/+$/, '') + '/health';
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const res = await fetch(url, { method: 'GET', credentials: 'include', signal: controller.signal });
        clearTimeout(id);
        const contentType = res.headers.get('content-type');
        if (res && res.ok && contentType && contentType.includes('application/json')) {
          api.defaults.baseURL = v.replace(/\/+$/, '');
          if (!isProd && typeof window !== 'undefined' && window.console) console.info('Detected API base:', api.defaults.baseURL);
          return api.defaults.baseURL;
        }
      } catch (err) {
        if (!isProd && typeof window !== 'undefined' && window.console) console.warn('Probe failed for', url, err && err.message ? err.message : err);
      }
    }
  }

  if (!isProd && typeof window !== 'undefined' && window.console) console.warn('No API base detected via probing; using default:', api.defaults.baseURL);
  return null;
}

if (typeof window !== 'undefined' && !isProd) {
  detectApiBase().catch((e) => !isProd && console.warn('Api detection error:', e && e.message ? e.message : e));
}

export default api;
