import axios from 'axios';

// Initial candidates for backend base (may include or omit '/api')
const candidates = [];
if (process.env.REACT_APP_API_URL) candidates.push(process.env.REACT_APP_API_URL);
if (typeof window !== 'undefined' && window.location) {
  candidates.push(`${window.location.origin}/api`);
  candidates.push(window.location.origin);
}
// Known deployed backend host (added as a fallback)
candidates.push('https://cipher-sql-studio-0zlp.onrender.com/api');
candidates.push('https://cipher-sql-studio-0zlp.onrender.com');

// Normalize helper
const normalize = (s) => s ? s.replace(/\/+$/'', '') : s;

let API_BASE_URL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api');
// don't force /api here anymore; detection will decide exact value
if (API_BASE_URL && API_BASE_URL.endsWith('/')) API_BASE_URL = API_BASE_URL.replace(/\/+$/, '');

// create axios instance with a safe default
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

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
