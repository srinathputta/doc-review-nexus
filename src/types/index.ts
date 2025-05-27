
export interface Document {
  id: string;
  filename: string;
  batchId: string;
  status: 'uploaded' | 'basic_extracted' | 'basic_reviewed' | 'summary_extracted' | 'summary_reviewed' | 'indexed' | 'error';
  basicMetadata?: BasicMetadata;
  summaryMetadata?: SummaryMetadata;
  pdfUrl?: string;
  s3Key?: string;
}

export interface BasicMetadata {
  caseNo: string;
  caseName: string;
  court: string;
  date: string;
  judges: string[];
  petitioner: string;
  appellant: string;
}

export interface SummaryMetadata {
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
  documents: Document[];
  errorMessage?: string;
}

export type BatchStatus = 
  | 'uploading'
  | 'uploaded_to_s3'
  | 'pending_basic_extraction'
  | 'basic_extraction_in_progress'
  | 'pending_basic_review'
  | 'basic_review_in_progress'
  | 'pending_summary_extraction'
  | 'summary_extraction_in_progress'
  | 'pending_summary_review'
  | 'summary_review_in_progress'
  | 'ready_for_indexing'
  | 'indexing_in_progress'
  | 'indexed'
  | 'error';
