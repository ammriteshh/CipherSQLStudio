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
      console.log("API test started");
      const response = await api.get('/health', {
        timeout: 15000
      });

      console.log('[HEALTH] Response status:', response.status);
      console.log('[HEALTH] Response data:', response.data);

      if (response.status === 200) {
        console.log('[HEALTH] Backend is reachable and healthy.');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[HEALTH] Error message:', error.message);
      return false;
    }
  },

  /**
   * Wait for backend to be ready
   * @param {number} maxRetries
   * @param {number} interval
   * @returns {Promise<boolean>}
   */
  waitForReady: async (maxRetries = 10, interval = 6000) => {
    const maxWaitTime = 60000;
    const startedAt = Date.now();

    for (let i = 0; i < maxRetries; i++) {
      const attempt = i + 1;
      const elapsed = Date.now() - startedAt;

      if (elapsed >= maxWaitTime) {
        console.error(`[HEALTH] Stopping health checks after ${elapsed}ms because the limit was reached.`);
        return false;
      }

      console.log(`[HEALTH] Attempt ${attempt}/${maxRetries} starting after ${elapsed}ms elapsed.`);

      const isReady = await healthService.checkHealth();
      if (isReady) {
        console.log(`[HEALTH] Backend became ready on attempt ${attempt}.`);
        return true;
      }

      const remainingTime = maxWaitTime - (Date.now() - startedAt);
      if (attempt >= maxRetries || remainingTime <= 0) {
        break;
      }

      const delay = Math.min(interval * Math.pow(2, i), remainingTime);

      console.log(`[HEALTH] Retry attempt ${attempt} failed. Waiting ${delay}ms before retrying.`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.error(`[HEALTH] Backend failed to become ready within ${maxWaitTime}ms.`);
    return false;
  }
};

export default healthService;
