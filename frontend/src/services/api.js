import axios from 'axios';

// Candidates and detection policy
const candidates = [];
const envUrl = process.env.REACT_APP_API_URL ? String(process.env.REACT_APP_API_URL).trim() : '';
if (envUrl) candidates.push(envUrl.replace(/\/+$/, ''));

const isProd = process.env.NODE_ENV === 'production';
if (typeof window !== 'undefined' && window.location) {
  candidates.push(`${window.location.origin}/api`.replace(/\/+$/, ''));
  candidates.push(`${window.location.origin}`.replace(/\/+$/, ''));
}
if (!isProd) {
  candidates.push('http://localhost:5000/api');
}

const normalize = (s) => s ? s.replace(/\/+$/, '') : s;

// Resolve initial API base
let API_BASE_URL = '';
if (envUrl) {
  API_BASE_URL = normalize(envUrl);
} else if (isProd && typeof window !== 'undefined' && window.location) {
  API_BASE_URL = normalize(`${window.location.origin}/api`);
} else if (!isProd) {
  API_BASE_URL = 'http://localhost:5000/api';
}

// create axios instance with the initial base (may be empty in rare cases)
const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
});

// Response interceptor to log real backend errors for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const info = {
        url: error.config && error.config.url ? `${error.config.baseURL || ''}${error.config.url}` : undefined,
        method: error.config && error.config.method,
        status: error.response && error.response.status,
        data: error.response && error.response.data,
        message: error.message,
      };
      console.error('API Error:', info);
    } catch (e) {
      console.error('API Error (failed to log details):', e);
    }

    return Promise.reject(error);
  }
);

// Async probe to detect which candidate (with or without /api) works.
export async function detectApiBase(timeout = 5000) {
  const tried = [];
  const uniqueCandidates = [...new Set(candidates.map(c => (c || '').replace(/\/+$/, '')))].filter(Boolean);

  for (const cand of uniqueCandidates) {
    // Try both the candidate as-is and candidate + '/api' if needed
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
        if (res && res.ok) {
          api.defaults.baseURL = v.replace(/\/+$/, '');
          if (typeof window !== 'undefined' && window.console) console.info('Detected API base:', api.defaults.baseURL);
          return api.defaults.baseURL;
        }
      } catch (err) {
        // fetch will throw on network errors or CORS blocks; try next
        if (typeof window !== 'undefined' && window.console) console.warn('Probe failed for', url, err && err.message ? err.message : err);
      }
    }
  }

  // If none succeeded, leave default and return null
  if (typeof window !== 'undefined' && window.console) console.warn('No API base detected via probing; using default:', api.defaults.baseURL);
  return null;
}

// Run detection in background on load
if (typeof window !== 'undefined') {
  detectApiBase().catch((e) => console.warn('Api detection error:', e && e.message ? e.message : e));
}

export default api;
