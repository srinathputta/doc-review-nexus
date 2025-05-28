
// API service for backend integration
import { getMockDocumentsByBatchIdWithOriginal } from '../lib/mock-data';
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

  async sendToFactsSummaryExtraction(batchId) {
    return this.request(`/batches/${batchId}/send-to-fs-extraction`, {
      method: 'POST',
    });
  }

  // Document operations
  getDocuments(batchId) {
 return getMockDocumentsByBatchIdWithOriginal(batchId);
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

  async getIndexedDocuments(searchTerm = '') {
    return this.request(`/documents/indexed?search=${encodeURIComponent(searchTerm)}`);
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

  async getExtractionProgress(batchId) {
    return this.request(`/extraction/progress/${batchId}`);
  }

  // Review operations
  async submitBasicReview(batchId, documentId, reviewData) {
    return this.request(`/review/basic/${batchId}/${documentId}`, {
      method: 'POST',
      body: reviewData,
    });
  }

  async submitSummaryReview(batchId, documentId, reviewData) {
    return this.request(`/review/summary/${batchId}/${documentId}`, {
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
  
  async completeBatchReview(batchId, reviewType, status) {
    return this.request(`/batches/${batchId}/complete-review`, {
      method: 'POST',
      body: { reviewType, status },
    });
  }

  async approveDocumentForNext(batchId, documentId) {
    return this.request(`/review/${batchId}/${documentId}/approve-and-next`, {
      method: 'POST',
    });
  }

  // Error and retry operations
  async getErrorBatches() {
    return this.request('/batches/errors');
  }

  async retryBatch(batchId) {
    return this.request(`/batches/${batchId}/retry`, {
      method: 'POST',
    });
  }

  // Statistics and monitoring
  async getDashboardStats() {
    return this.request('/stats/dashboard');
  }

  async getBatchProgress(batchId) {
    return this.request(`/batches/${batchId}/progress`);
  }
}

export default new ApiService();
