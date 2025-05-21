
export interface Document {
  id: string;
  filename: string;
  batchId: string;
  status: 'extracted' | 'reviewed' | 'indexed' | 'error';
  metadata: DocumentMetadata;
  pdfUrl?: string; // URL to view the PDF
}

export interface DocumentMetadata {
  caseName: string;
  court: string;
  date: string;
  judges: string[];
  petitioner: string;
  respondent: string;
  facts: string;
  summary: string;
  citations: string[];
}

export interface Batch {
  id: string;
  name: string;
  uploadDate: string;
  totalDocuments: number;
  status: BatchStatus;
  samplesReviewed: number;
  samplesGood: number;
  documents: Document[];
  samples?: Document[];
  errorMessage?: string;
}

export type BatchStatus = 
  | 'uploading'
  | 'unpacking'
  | 'queued'
  | 'extracting'
  | 'extracted'
  | 'review_ready'
  | 'review_in_progress'
  | 'indexed'
  | 'manual_intervention'
  | 'error';
