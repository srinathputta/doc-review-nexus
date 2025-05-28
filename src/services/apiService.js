
// API service for backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Batch operations
  async uploadBatch(formData) {
    return this.request('/batches/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getBatches() {
    return this.request('/batches');
  }

  async getBatch(batchId) {
    return this.request(`/batches/${batchId}`);
  }

  async updateBatchStatus(batchId, status) {
    return this.request(`/batches/${batchId}/status`, {
      method: 'PUT',
      body: { status },
    });
  }

  // Document operations
  async getDocuments(batchId) {
    return this.request(`/batches/${batchId}/documents`);
  }

  async updateDocument(documentId, data) {
    return this.request(`/documents/${documentId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async getSamples(batchId) {
    return this.request(`/batches/${batchId}/samples`);
  }

  // Extraction operations
  async startBasicExtraction(batchId) {
    return this.request(`/extraction/basic/${batchId}`, {
      method: 'POST',
    });
  }

  async startSummaryExtraction(batchId) {
    return this.request(`/extraction/summary/${batchId}`, {
      method: 'POST',
    });
  }

  // Review operations
  async submitReview(batchId, reviewData) {
    return this.request(`/review/${batchId}`, {
      method: 'POST',
      body: reviewData,
    });
  }

  async markSample(batchId, documentId, isGood) {
    return this.request(`/review/${batchId}/samples/${documentId}`, {
      method: 'POST',
      body: { isGood },
    });
  }
  
  async completeBatchReview(batchId, status) {
    return this.request(`/batches/${batchId}/complete-review`, {
      method: 'POST',
      body: { status },
    });
  }
}

export default new ApiService();
