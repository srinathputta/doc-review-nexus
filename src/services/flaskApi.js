
const FLASK_API_BASE_URL = 'http://localhost:5000/api';

class FlaskApiService {
  async uploadBatch(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${FLASK_API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return response.json();
  }
  
  async startBasicExtraction(batchId) {
    const response = await fetch(`${FLASK_API_BASE_URL}/extract/basic/${batchId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Basic extraction failed');
    }
    
    return response.json();
  }
  
  async getBasicExtraction(documentId) {
    const response = await fetch(`${FLASK_API_BASE_URL}/extract/basic/${documentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get basic extraction');
    }
    
    return response.json();
  }
  
  async submitBasicReview(documentId, basicMetadata) {
    const response = await fetch(`${FLASK_API_BASE_URL}/review/basic/${documentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ basicMetadata }),
    });
    
    if (!response.ok) {
      throw new Error('Basic review submission failed');
    }
    
    return response.json();
  }
  
  async startSummaryExtraction(documentId) {
    const response = await fetch(`${FLASK_API_BASE_URL}/extract/summary/${documentId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Summary extraction failed');
    }
    
    return response.json();
  }
  
  async getSummaryExtraction(documentId) {
    const response = await fetch(`${FLASK_API_BASE_URL}/extract/summary/${documentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get summary extraction');
    }
    
    return response.json();
  }
  
  async submitSummaryReview(documentId, summaryMetadata) {
    const response = await fetch(`${FLASK_API_BASE_URL}/review/summary/${documentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ summaryMetadata }),
    });
    
    if (!response.ok) {
      throw new Error('Summary review submission failed');
    }
    
    return response.json();
  }
  
  async indexDocument(documentId) {
    const response = await fetch(`${FLASK_API_BASE_URL}/index/${documentId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Indexing failed');
    }
    
    return response.json();
  }
  
  async getBatches() {
    const response = await fetch(`${FLASK_API_BASE_URL}/batches`);
    
    if (!response.ok) {
      throw new Error('Failed to get batches');
    }
    
    return response.json();
  }
}

export const flaskApi = new FlaskApiService();
