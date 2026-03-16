// API Service Layer
// Centralized API communication with error handling and retry logic

import axios from 'axios';
import API_CONFIG from '../config';

// Candidate backend URLs for local development failover.
// This prevents hard failures when backend is started on a different common host/port.
const BACKEND_URL_CANDIDATES = Array.from(
  new Set(
    [
      API_CONFIG.BASE_URL,
      'http://127.0.0.1:8000',
      'http://localhost:8000',
      'http://127.0.0.1:5000',
      'http://localhost:5000',
    ].filter(Boolean)
  )
);

const isNetworkError = (error) =>
  !error?.response &&
  (
    error?.message === 'Network Error' ||
    Boolean(error?.request)
  );

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

const setApiBaseUrl = (baseUrl) => {
  apiClient.defaults.baseURL = baseUrl;
};

const withBaseUrlFailover = async (requestFn) => {
  let lastError = null;

  for (const baseUrl of BACKEND_URL_CANDIDATES) {
    setApiBaseUrl(baseUrl);

    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      if (!isNetworkError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to requests
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response time
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`API ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`);
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response received', error.request);
    } else {
      // Request setup error
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Retry helper function
const retryRequest = async (fn, retries = API_CONFIG.RETRY_ATTEMPTS) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (!error.response || error.response.status >= 500)) {
      console.log(`Retrying... (${API_CONFIG.RETRY_ATTEMPTS - retries + 1}/${API_CONFIG.RETRY_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// API Service Object
const apiService = {
  /**
   * Analyze career identity based on questionnaire data
   * @param {Object} formData - User questionnaire responses
   * @returns {Promise<Object>} Career analysis results
   */
  async analyzeCareer(formData) {
    try {
      const response = await withBaseUrlFailover(() =>
        retryRequest(() => apiClient.post(API_CONFIG.ENDPOINTS.ANALYZE, formData))
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to analyze career identity',
        statusCode: error.response?.status
      };
    }
  },

  /**
   * Check backend health status
   * @returns {Promise<Object>} Health check result
   */
  async checkHealth() {
    try {
      const response = await withBaseUrlFailover(() =>
        apiClient.get(API_CONFIG.ENDPOINTS.HEALTH, {
          timeout: 5000 // Shorter timeout for health check
        })
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Backend server is not responding'
      };
    }
  },

  /**
   * Save career analysis results
   * @param {Object} results - Career analysis results to save
   * @returns {Promise<Object>} Save operation result with ID
   */
  async saveResults(results) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.SAVE_RESULTS, results);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save results'
      };
    }
  },

  /**
   * Retrieve saved results by ID
   * @param {string} id - Result ID
   * @returns {Promise<Object>} Saved results
   */
  async getResults(id) {
    try {
      const url = API_CONFIG.ENDPOINTS.GET_RESULTS.replace(':id', id);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to retrieve results'
      };
    }
  },

  /**
   * Submit user feedback
   * @param {Object} feedback - Feedback data
   * @returns {Promise<Object>} Submission result
   */
  async submitFeedback(feedback) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.SUBMIT_FEEDBACK, feedback);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit feedback'
      };
    }
  },

  /**
   * Track analytics event
   * @param {Object} event - Event data
   * @returns {Promise<Object>} Track result
   */
  async trackEvent(event) {
    try {
      // Fire and forget - don't wait for response
      apiClient.post(API_CONFIG.ENDPOINTS.TRACK_EVENT, event).catch(() => {});
      return { success: true };
    } catch (error) {
      // Silently fail for analytics
      return { success: false };
    }
  }
};

export default apiService;
