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
      if (response.status === 200) {
        console.log('[HEALTH] Backend is reachable and healthy.');
        return true;
      }
      return false;
    } catch (error) {
      console.warn(`[HEALTH] Backend health check failed: ${error.message}`);
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
      
      console.warn(`[HEALTH] Waiting for backend... attempt ${i + 1}/${maxRetries}. Will retry in ${interval}ms`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    console.error(`[HEALTH] Backend failed to become ready after ${maxRetries} attempts.`);
    return false;
  }
};

export default healthService;
