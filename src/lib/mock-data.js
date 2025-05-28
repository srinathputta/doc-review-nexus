// Sample document metadata template
const createSampleMetadata = (index) => {
  return {
    caseNo: `CASE-${index}-2023`,
    caseName: `Case ${index} v. State`,
    court: `Supreme Court of State ${index % 5 + 1}`,
    caseType: ['Civil', 'Criminal', 'Constitutional', 'Commercial', 'Family'][index % 5],
    date: new Date(2022, index % 12, (index % 28) + 1).toISOString().split('T')[0],
    judges: [`Judge ${index % 10 + 1}`, `Judge ${(index % 10) + 2}`],
    citations: [`Citation ${index}A`, `Citation ${index}B`],
    petitioner: `Petitioner ${index}`,
    respondent: `Respondent ${index}`,
    advocates: [`Advocate ${index}A`, `Advocate ${index}B`],
    actsSections: [`Act ${index}/Section ${index}`, `Act ${index+1}/Section ${index+1}`],
    casesReferred: [`Reference Case ${index}`, `Reference Case ${index+1}`],
    verdict: ['Allowed', 'Dismissed', 'Partly Allowed', 'Reserved'][index % 4],
    facts: `These are the facts of case ${index}. The case involves various legal matters that were brought before the court.`,
    summary: `Summary of legal proceedings for case ${index}. The court found in favor of the plaintiff on several counts.`
  };
};

const createBasicMetadata = (index) => {
  return {
    caseNo: `CASE-${index}-2023`,
    caseName: `Case ${index} v. State`,
    court: `Supreme Court of State ${index % 5 + 1}`,
    caseType: ['Civil', 'Criminal', 'Constitutional', 'Commercial', 'Family'][index % 5],
    date: new Date(2022, index % 12, (index % 28) + 1).toISOString().split('T')[0],
    judges: [`Judge ${index % 10 + 1}`, `Judge ${(index % 10) + 2}`],
    citations: [`Citation ${index}A`, `Citation ${index}B`],
    petitioner: `Petitioner ${index}`,
    respondent: `Respondent ${index}`,
    advocates: [`Advocate ${index}A`, `Advocate ${index}B`],
    actsSections: [`Act ${index}/Section ${index}`, `Act ${index+1}/Section ${index+1}`],
    casesReferred: [`Reference Case ${index}`, `Reference Case ${index+1}`],
    verdict: ['Allowed', 'Dismissed', 'Partly Allowed', 'Reserved'][index % 4]
  };
};

const createSummaryMetadata = (index) => {
  return {
    caseNo: `CASE-${index}-2023`,
    caseName: `Case ${index} v. State`,
    facts: `These are the facts of case ${index}. The case involves various legal matters that were brought before the court including property disputes, contract violations, and constitutional questions.`,
    summary: `Summary of legal proceedings for case ${index}. The court examined evidence, heard arguments from both parties, and delivered a comprehensive judgment addressing all raised issues.`
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
      pdfUrl: `/sample-pdf.pdf`,
      reviewStatus: null,
      isModified: false
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
    documentsReviewed: 0
  },
  // Basic review in progress
  {
    id: 'batch-6',
    name: 'Corporate Litigation',
    uploadDate: '2023-11-08',
    totalDocuments: 28,
    status: 'basic_review_in_progress',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('batch-6', 28),
    documentsReviewed: 5
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
    documents: createSampleDocuments('batch-9', 18)
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
    documents: createSampleDocuments('batch-10', 14)
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
  // Error batches
  {
    id: 'batch-12',
    name: 'Patent Cases 2023',
    uploadDate: '2023-12-10',
    totalDocuments: 12,
    status: 'error',
    samplesReviewed: 10,
    samplesGood: 4,
    documents: createSampleDocuments('batch-12', 12),
    errorMessage: 'Low quality extraction - requires manual review',
    errorType: 'quality_threshold_failed'
  },
  {
    id: 'batch-13',
    name: 'Corporate Law Cases',
    uploadDate: '2023-12-15',
    totalDocuments: 0,
    status: 'error',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: [],
    errorMessage: 'Failed to unpack ZIP file: Corrupted archive',
    errorType: 'upload_failed'
  },
  {
    id: 'batch-14',
    name: 'Constitutional Cases 2023',
    uploadDate: '2023-12-18',
    totalDocuments: 25,
    status: 'error',
    samplesReviewed: 8,
    samplesGood: 2,
    documents: createSampleDocuments('batch-14', 25),
    errorMessage: 'AI extraction confidence below threshold',
    errorType: 'extraction_confidence_low'
  },
  {
    id: 'batch-15',
    name: 'Labour Law Cases',
    uploadDate: '2023-12-20',
    totalDocuments: 15,
    status: 'error',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('batch-15', 15),
    errorMessage: 'Network timeout during processing',
    errorType: 'processing_timeout'
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
  const allDocuments = batch?.documents || [];
  
  if (allDocuments.length <= 10) return allDocuments;
  
  // Fisher-Yates shuffle to get random 10 samples
  const shuffled = [...allDocuments];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 10);
};

export const getIndexedDocuments = () => {
  return mockBatches
    .filter(batch => batch.status === 'indexed')
    .flatMap(batch => batch.documents);
};

export const getErrorBatches = () => {
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
