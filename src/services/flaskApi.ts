
const FLASK_API_BASE_URL = 'http://localhost:5000/api';

export interface UploadResponse {
  batchId: string;
  message: string;
  documents: Array<{
    id: string;
    filename: string;
    s3Key: string;
  }>;
}

export interface BasicExtractionResponse {
  documentId: string;
  basicMetadata: {
    caseNo: string;
    caseName: string;
    court: string;
    date: string;
    judges: string[];
    petitioner: string;
    appellant: string;
  };
}

export interface SummaryExtractionResponse {
  documentId: string;
  summaryMetadata: {
    facts: string;
    summary: string;
    citations: string[];
  };
}

class FlaskApiService {
  async uploadBatch(file: File): Promise<UploadResponse> {
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
  
  async startBasicExtraction(batchId: string): Promise<{ message: string }> {
    const response = await fetch(`${FLASK_API_BASE_URL}/extract/basic/${batchId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Basic extraction failed');
    }
    
    return response.json();
  }
  
  async getBasicExtraction(documentId: string): Promise<BasicExtractionResponse> {
    const response = await fetch(`${FLASK_API_BASE_URL}/extract/basic/${documentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get basic extraction');
    }
    
    return response.json();
  }
  
  async submitBasicReview(documentId: string, basicMetadata: any): Promise<{ message: string }> {
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
  
  async startSummaryExtraction(documentId: string): Promise<{ message: string }> {
    const response = await fetch(`${FLASK_API_BASE_URL}/extract/summary/${documentId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Summary extraction failed');
    }
    
    return response.json();
  }
  
  async getSummaryExtraction(documentId: string): Promise<SummaryExtractionResponse> {
    const response = await fetch(`${FLASK_API_BASE_URL}/extract/summary/${documentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get summary extraction');
    }
    
    return response.json();
  }
  
  async submitSummaryReview(documentId: string, summaryMetadata: any): Promise<{ message: string }> {
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
  
  async indexDocument(documentId: string): Promise<{ message: string }> {
    const response = await fetch(`${FLASK_API_BASE_URL}/index/${documentId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Indexing failed');
    }
    
    return response.json();
  }
  
  async getBatches(): Promise<any[]> {
    const response = await fetch(`${FLASK_API_BASE_URL}/batches`);
    
    if (!response.ok) {
      throw new Error('Failed to get batches');
    }
    
    return response.json();
  }
}

export const flaskApi = new FlaskApiService();
