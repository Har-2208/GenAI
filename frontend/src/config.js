// API Configuration
// Configure your backend API URL via environment variables

const API_CONFIG = {
  // Backend API base URL - use environment variable or default
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000",

  // API endpoints
  ENDPOINTS: {
    // Career analysis
    ANALYZE: "/api/analyze",

    // Health check
    HEALTH: "/api/health",

    // Results management
    SAVE_RESULTS: "/api/results/save",
    GET_RESULTS: "/api/results/:id",

    // User feedback
    SUBMIT_FEEDBACK: "/api/feedback",

    // Analytics
    TRACK_EVENT: "/api/analytics/track",
  },

  // Request configuration
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // milliseconds

  // Full URL builders
  getAnalyzeUrl() {
    return `${this.BASE_URL}${this.ENDPOINTS.ANALYZE}`;
  },

  getHealthUrl() {
    return `${this.BASE_URL}${this.ENDPOINTS.HEALTH}`;
  },

  getSaveResultsUrl() {
    return `${this.BASE_URL}${this.ENDPOINTS.SAVE_RESULTS}`;
  },

  getResultsUrl(id) {
    return `${this.BASE_URL}${this.ENDPOINTS.GET_RESULTS.replace(":id", id)}`;
  },

  getSubmitFeedbackUrl() {
    return `${this.BASE_URL}${this.ENDPOINTS.SUBMIT_FEEDBACK}`;
  },

  getTrackEventUrl() {
    return `${this.BASE_URL}${this.ENDPOINTS.TRACK_EVENT}`;
  },
};

export default API_CONFIG;
