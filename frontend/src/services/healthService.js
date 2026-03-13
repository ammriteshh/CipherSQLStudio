import api from './api';

/**
 * Service to check backend health and handle wake-from-sleep logic
 */
const healthService = {
  /**
   * Check if backend is alive
   * @returns {Promise<boolean>}
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/health', {
        // Shorter timeout for quick checks, but enough for a slow start
        timeout: 15000, 
        // Avoid interceptor error handling for quiet checks if needed
        headers: { 'X-Quiet-Request': 'true' } 
      });
      return response.status === 200;
    } catch (error) {
      console.warn('Backend health check failed', error.message);
      return false;
    }
  },

  /**
   * Wait for backend to be ready
   * @param {number} maxRetries 
   * @param {number} interval 
   * @returns {Promise<boolean>}
   */
  waitForReady: async (maxRetries = 5, interval = 3000) => {
    for (let i = 0; i < maxRetries; i++) {
      const isReady = await healthService.checkHealth();
      if (isReady) return true;
      
      console.log(`Waiting for backend... attempt ${i + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    return false;
  }
};

export default healthService;
