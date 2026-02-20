// API Configuration
// Update this file with your backend API URL

const API_CONFIG = {
  // Backend API base URL
  BASE_URL: 'http://localhost:5000',
  
  // API endpoints
  ENDPOINTS: {
    ANALYZE: '/api/analyze'
  },
  
  // Full URL builder
  getAnalyzeUrl() {
    return `${this.BASE_URL}${this.ENDPOINTS.ANALYZE}`;
  }
};

export default API_CONFIG;
