
import { Batch, Document, DocumentMetadata } from "../types";

// Sample document metadata template
const createSampleMetadata = (index: number): DocumentMetadata => {
  return {
    caseName: `Case ${index} v. State`,
    court: `Supreme Court of State ${index % 5 + 1}`,
    date: new Date(2022, index % 12, (index % 28) + 1).toISOString().split('T')[0],
    judges: [`Judge ${index % 10 + 1}`, `Judge ${(index % 10) + 2}`],
    petitioner: `Petitioner ${index}`,
    respondent: `Respondent ${index}`,
    facts: `These are the facts of case ${index}. The case involves various legal matters that were brought before the court.`,
    summary: `Summary of legal proceedings for case ${index}. The court found in favor of the plaintiff on several counts.`,
    citations: [`Citation ${index}A`, `Citation ${index}B`]
  };
};

// Create sample documents
const createSampleDocuments = (batchId: string, count: number, startIndex = 0): Document[] => {
  return Array.from({ length: count }).map((_, i) => {
    const index = startIndex + i;
    return {
      id: `doc-${batchId}-${index}`,
      filename: `document-${index}.pdf`,
      batchId,
      status: 'extracted',
      metadata: createSampleMetadata(index),
      pdfUrl: `/sample-pdf.pdf` // This would be a real URL in a production app
    };
  });
};

// Create sample batches
export const mockBatches: Batch[] = [
  // Uploading batch
  {
    id: 'batch-1',
    name: 'Legal Cases Q1 2023',
    uploadDate: '2023-01-15',
    totalDocuments: 25,
    status: 'uploading',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: []
  },
  // Unpacking batch
  {
    id: 'batch-2',
    name: 'Legal Cases Q2 2023',
    uploadDate: '2023-04-02',
    totalDocuments: 18,
    status: 'unpacking',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: []
  },
  // Queued batch
  {
    id: 'batch-3',
    name: 'Legal Cases Q3 2023',
    uploadDate: '2023-07-10',
    totalDocuments: 30,
    status: 'queued',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: []
  },
  // Extracting batch
  {
    id: 'batch-4',
    name: 'Special Cases 2023',
    uploadDate: '2023-09-05',
    totalDocuments: 15,
    status: 'extracting',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('batch-4', 15)
  },
  // Extracted batch ready for review
  {
    id: 'batch-5',
    name: 'Supreme Court Cases',
    uploadDate: '2023-10-12',
    totalDocuments: 22,
    status: 'review_ready',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('batch-5', 22),
    samples: createSampleDocuments('batch-5', 10, 100)
  },
  // Review in progress
  {
    id: 'batch-6',
    name: 'International Cases',
    uploadDate: '2023-11-08',
    totalDocuments: 28,
    status: 'review_in_progress',
    samplesReviewed: 4,
    samplesGood: 3,
    documents: createSampleDocuments('batch-6', 28),
    samples: createSampleDocuments('batch-6', 10, 200)
  },
  // Indexed batch
  {
    id: 'batch-7',
    name: 'Historical Cases Archive',
    uploadDate: '2023-12-01',
    totalDocuments: 40,
    status: 'indexed',
    samplesReviewed: 10,
    samplesGood: 8,
    documents: createSampleDocuments('batch-7', 40)
  },
  // Manual intervention required
  {
    id: 'batch-8',
    name: 'Patent Cases 2023',
    uploadDate: '2023-12-10',
    totalDocuments: 12,
    status: 'manual_intervention',
    samplesReviewed: 10,
    samplesGood: 4,
    documents: createSampleDocuments('batch-8', 12),
    samples: createSampleDocuments('batch-8', 10, 300)
  },
  // Error batch
  {
    id: 'batch-9',
    name: 'Corporate Law Cases',
    uploadDate: '2023-12-15',
    totalDocuments: 0,
    status: 'error',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: [],
    errorMessage: 'Failed to unpack ZIP file: Corrupted archive'
  }
];

export const getMockBatches = () => {
  return mockBatches;
};

export const getMockBatchById = (id: string) => {
  return mockBatches.find(batch => batch.id === id);
};

export const getMockDocumentsByBatchId = (batchId: string) => {
  const batch = mockBatches.find(b => b.id === batchId);
  return batch?.documents || [];
};

export const getMockSamplesByBatchId = (batchId: string) => {
  const batch = mockBatches.find(b => b.id === batchId);
  return batch?.samples || [];
};

export const getIndexedDocuments = () => {
  return mockBatches
    .filter(batch => batch.status === 'indexed')
    .flatMap(batch => batch.documents);
};

export const getManualInterventionBatches = () => {
  return mockBatches.filter(
    batch => batch.status === 'manual_intervention' || batch.status === 'error'
  );
};

export const getExtractionQueueBatches = () => {
  return mockBatches.filter(
    batch => ['queued', 'extracting', 'extracted'].includes(batch.status)
  );
};

export const getReviewReadyBatches = () => {
  return mockBatches.filter(
    batch => ['review_ready', 'review_in_progress'].includes(batch.status)
  );
};

export const getRecentBatches = () => {
  return mockBatches.filter(
    batch => ['uploading', 'unpacking', 'queued'].includes(batch.status)
  ).slice(0, 5);
};
