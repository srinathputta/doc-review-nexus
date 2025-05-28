
// Sample document metadata template
const createSampleMetadata = (index) => {
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

const createBasicMetadata = (index) => {
  return {
    caseNo: `CASE-${index}-2023`,
    caseName: `Case ${index} v. State`,
    court: `Supreme Court of State ${index % 5 + 1}`,
    date: new Date(2022, index % 12, (index % 28) + 1).toISOString().split('T')[0],
    judges: [`Judge ${index % 10 + 1}`, `Judge ${(index % 10) + 2}`],
    petitioner: `Petitioner ${index}`,
    appellant: `Respondent ${index}`
  };
};

const createSummaryMetadata = (index) => {
  return {
    facts: `These are the facts of case ${index}. The case involves various legal matters that were brought before the court.`,
    summary: `Summary of legal proceedings for case ${index}. The court found in favor of the plaintiff on several counts.`,
    citations: [`Citation ${index}A`, `Citation ${index}B`]
  };
};

// Create sample documents
const createSampleDocuments = (batchId, count, startIndex = 0) => {
  return Array.from({ length: count }).map((_, i) => {
    const index = startIndex + i;
    return {
      id: `doc-${batchId}-${index}`,
      filename: `document-${index}.pdf`,
      batchId,
      status: 'basic_extracted',
      basicMetadata: createBasicMetadata(index),
      summaryMetadata: createSummaryMetadata(index),
      pdfUrl: `/sample-pdf.pdf` // This would be a real URL in a production app
    };
  });
};

// Create sample batches
export const mockBatches = [
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
    status: 'uploaded_to_s3',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: []
  },
  // Queued for basic extraction
  {
    id: 'batch-3',
    name: 'Supreme Court Cases 2023',
    uploadDate: '2023-07-10',
    totalDocuments: 30,
    status: 'pending_basic_extraction',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: []
  },
  // Basic extraction in progress
  {
    id: 'batch-4',
    name: 'District Court Cases',
    uploadDate: '2023-09-05',
    totalDocuments: 15,
    status: 'basic_extraction_in_progress',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('batch-4', 15)
  },
  // Ready for basic review
  {
    id: 'batch-5',
    name: 'Commercial Law Cases',
    uploadDate: '2023-10-12',
    totalDocuments: 22,
    status: 'pending_basic_review',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('batch-5', 22),
    samples: createSampleDocuments('batch-5', 10, 100)
  },
  // Basic review in progress
  {
    id: 'batch-6',
    name: 'Corporate Litigation',
    uploadDate: '2023-11-08',
    totalDocuments: 28,
    status: 'basic_review_in_progress',
    samplesReviewed: 4,
    samplesGood: 3,
    documents: createSampleDocuments('batch-6', 28),
    samples: createSampleDocuments('batch-6', 10, 200)
  },
  // Ready for F/S extraction
  {
    id: 'batch-7',
    name: 'Property Disputes 2023',
    uploadDate: '2023-11-15',
    totalDocuments: 20,
    status: 'pending_summary_extraction',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('batch-7', 20)
  },
  // F/S extraction in progress
  {
    id: 'batch-8',
    name: 'Criminal Appeals',
    uploadDate: '2023-11-20',
    totalDocuments: 16,
    status: 'summary_extraction_in_progress',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('batch-8', 16)
  },
  // Ready for F/S review
  {
    id: 'batch-9',
    name: 'Family Court Cases',
    uploadDate: '2023-11-25',
    totalDocuments: 18,
    status: 'pending_summary_review',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('batch-9', 18),
    samples: createSampleDocuments('batch-9', 10, 300)
  },
  // F/S review in progress
  {
    id: 'batch-10',
    name: 'Tax Law Cases',
    uploadDate: '2023-11-28',
    totalDocuments: 14,
    status: 'summary_review_in_progress',
    samplesReviewed: 6,
    samplesGood: 5,
    documents: createSampleDocuments('batch-10', 14),
    samples: createSampleDocuments('batch-10', 10, 400)
  },
  // Indexed batch
  {
    id: 'batch-11',
    name: 'Historical Cases Archive',
    uploadDate: '2023-12-01',
    totalDocuments: 40,
    status: 'indexed',
    samplesReviewed: 10,
    samplesGood: 8,
    documents: createSampleDocuments('batch-11', 40)
  },
  // Manual intervention required
  {
    id: 'batch-12',
    name: 'Patent Cases 2023',
    uploadDate: '2023-12-10',
    totalDocuments: 12,
    status: 'error',
    samplesReviewed: 10,
    samplesGood: 4,
    documents: createSampleDocuments('batch-12', 12),
    samples: createSampleDocuments('batch-12', 10, 500)
  },
  // Error batch
  {
    id: 'batch-13',
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

export const getMockBatchById = (id) => {
  return mockBatches.find(batch => batch.id === id);
};

export const getMockDocumentsByBatchId = (batchId) => {
  const batch = mockBatches.find(b => b.id === batchId);
  return batch?.documents || [];
};

export const getMockSamplesByBatchId = (batchId) => {
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
    batch => batch.status === 'error'
  );
};

export const getExtractionQueueBatches = () => {
  return mockBatches.filter(
    batch => ['pending_basic_extraction', 'basic_extraction_in_progress', 'basic_extracted'].includes(batch.status)
  );
};

export const getReviewReadyBatches = () => {
  return mockBatches.filter(
    batch => ['review_ready', 'review_in_progress'].includes(batch.status)
  );
};

export const getRecentBatches = () => {
  return mockBatches.filter(
    batch => ['uploading', 'uploaded_to_s3', 'pending_basic_extraction'].includes(batch.status)
  ).slice(0, 5);
};

export const getBasicExtractionQueueBatches = () => {
  return mockBatches.filter(
    batch => ['pending_basic_extraction', 'basic_extraction_in_progress'].includes(batch.status)
  );
};

export const getBasicReviewBatches = () => {
  return mockBatches.filter(
    batch => ['pending_basic_review', 'basic_review_in_progress'].includes(batch.status)
  );
};

export const getSummaryExtractionQueueBatches = () => {
  return mockBatches.filter(
    batch => ['pending_summary_extraction', 'summary_extraction_in_progress'].includes(batch.status)
  );
};

export const getSummaryReviewBatches = () => {
  return mockBatches.filter(
    batch => ['pending_summary_review', 'summary_review_in_progress'].includes(batch.status)
  );
};
