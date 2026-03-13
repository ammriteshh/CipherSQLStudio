import axios from 'axios';

/**
 * Configure API base URL based on environment
 */
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Log the API URL in development mode
if (process.env.NODE_ENV !== 'production') {
  console.log(`[API INITIALIZED] Base URL: ${baseURL}`);
}

const api = axios.create({
  baseURL,
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

