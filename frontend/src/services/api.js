import axios from 'axios';

/**
 * Configure API base URL based on environment
 */
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Always log the API URL so developers can verify it in the production browser console
console.log(`[API INITIALIZED] Base URL is currently resolving to: ${baseURL}`);

const api = axios.create({
  baseURL,
  timeout: 60000,
  withCredentials: true,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Avoid retrying if no config is present
    if (!config) {
      return Promise.reject(error);
    }

    // Setup retry count. Max retries = 3
    config.retryCount = config.retryCount || 0;
    const maxRetries = 3;

    // Retry on timeouts (ECONNABORTED), Network Errors, or 5xx Server Errors
    const shouldRetry = error.code === 'ECONNABORTED' || 
                        error.message === 'Network Error' || 
                        (error.response && error.response.status >= 500);

    if (shouldRetry && config.retryCount < maxRetries) {
      config.retryCount += 1;
      
      // Calculate exponential backoff delay (e.g., 2000, 4000, 8000 + random jitter)
      const baseDelay = 2000;
      const delay = (baseDelay * Math.pow(2, config.retryCount - 1)) + (Math.random() * 500);
      
      console.warn(`[API] Request failed, retrying (${config.retryCount}/${maxRetries}) in ${Math.round(delay)}ms... -> ${config.url}`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(config);
    }

    let message = 'An unexpected error occurred';
    
    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out after maximum retries. The server might be waking up or busy.';
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

