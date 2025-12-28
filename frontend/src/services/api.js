import axios from 'axios';

const inferredBase = (typeof window !== 'undefined' && window.location ? `${window.location.origin}/api` : 'http://localhost:5000/api');
let API_BASE_URL = process.env.REACT_APP_API_URL || inferredBase;

// Normalize to ensure base ends with '/api'
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/+$/, '') + '/api';
}

// Helpful for debugging in production builds (can be removed later)
if (typeof window !== 'undefined' && window.console) {
  console.info('API_BASE_URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
