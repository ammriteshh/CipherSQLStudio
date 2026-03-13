import axios from 'axios';

/**
 * Configure API base URL based on environment
 */
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://ciphersqlstudio.onrender.com/api';
  }

  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: true,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    
    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. The server might be waking up or busy.';
    } else if (error.message === 'Network Error') {
      message = 'Network error. Please check your connection or ensure the server is running.';
    } else {
      message = error.response?.data?.error || error.response?.data?.message || error.message || message;
    }

    console.error('[API ERROR]', {
      url: error.config?.url,
      status: error.response?.status,
      code: error.code,
      message
    });

    return Promise.reject({ ...error, customMessage: message });
  }
);

export default api;

