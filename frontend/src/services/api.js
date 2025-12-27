import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ||
  'https://ciphersqlstudio-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
