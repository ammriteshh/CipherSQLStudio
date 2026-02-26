import axios from 'axios';

/**
 * Configure API base URL based on environment
 */
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://cipher-sql-backend.onrender.com/api';
  }

  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  withCredentials: true,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';

    console.error('[API ERROR]', {
      url: error.config?.url,
      status: error.response?.status,
      message
    });

    return Promise.reject({ ...error, customMessage: message });
  }
);

export default api;

