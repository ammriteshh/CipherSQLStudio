import axios from 'axios';

const inferredBase = (typeof window !== 'undefined' && window.location ? `${window.location.origin}/api` : 'http://localhost:5000/api');
const API_BASE_URL = process.env.REACT_APP_API_URL || inferredBase;

// Helpful for debugging in production builds (can be removed later)
if (typeof window !== 'undefined' && window.console) {
  console.info('API_BASE_URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
