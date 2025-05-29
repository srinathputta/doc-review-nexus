
// Flask API service for backend integration
const FLASK_API_BASE_URL = process.env.REACT_APP_FLASK_API_URL || 'http://localhost:5000/api';

class FlaskApiService {
  async request(endpoint, options = {}) {
    const url = `${FLASK_API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Flask API request failed:', error);
      throw error;
    }
  }

  // Summary extraction operations
  async startSummaryExtraction(batchId) {
    return this.request(`/extraction/summary/${batchId}`, {
      method: 'POST',
    });
  }

  async getSummaryExtractionProgress(batchId) {
    return this.request(`/extraction/summary/progress/${batchId}`);
  }
}

export default new FlaskApiService();
