const createSampleMetadata = (index) => {
 return {
    caseNo: `CASE-${index}-2023`,
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

const getMockDocumentsByBatchIdWithOriginal = (batchId) => {
  // Find the batch to get the total number of documents
  const batch = mockBatches.find(b => b.id === batchId);
  if (!batch) return [];

  return Array.from({ length: batch.totalDocuments }).map((_, i) => {
    const index = i; // Use index directly for document numbering within the batch
    const basicMetadata = createBasicMetadata(index);
    return {
      id: `doc-${batchId}-${index}`,
      filename: `document-${index}.pdf`,
      batchId,
      status: 'basic_extracted',
      basicMetadata: basicMetadata, // Current metadata
      originalBasicMetadata: { ...basicMetadata }, // Copy for original
      summaryMetadata: createSummaryMetadata(index),
      pdfUrl: `/sample-pdf.pdf`,
      reviewStatus: null,
      isModified: false
    };
  });
};


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
  // This function is now deprecated as we are using individual documents for extraction queue
  return [];
};

export const getMockExtractionDocuments = () => {
  const now = new Date().toISOString();
  return [
    {
      id: 'doc-mock-1',
      filename: 'example-case-brief.pdf',
      status: 'pending basic details extraction',
      uploadedAt: now,
      uploadedBy: 'user@example.com',
    },
    {
      id: 'doc-mock-2',
      filename: 'sample-contract.pdf',
      status: 'extraction completed pending review',
      uploadedAt: now,
      uploadedBy: 'user@example.com',
    },
  ];
};

// Add new mock batches for basic extraction queue
const mockBasicExtractionBatches = [
  {
    id: 'basic-batch-1',
    name: 'Contract Documents Set A',
    uploadedAt: '2023-12-15T10:00:00Z',
    uploadedBy: 'john.doe@company.com',
    totalDocuments: 15,
    status: 'pending_basic_extraction',
    documents: [
      {
        id: 'doc-basic-1',
        filename: 'employment_contract_2023.pdf',
        status: 'pending_basic_extraction',
        uploadedAt: '2023-12-15T10:00:00Z',
        uploadedBy: 'john.doe@company.com',
        batchId: 'basic-batch-1',
        pdfUrl: '/sample-pdf.pdf'
      },
      {
        id: 'doc-basic-2',
        filename: 'service_agreement_draft.pdf',
        status: 'basic_extraction_in_progress',
        uploadedAt: '2023-12-15T10:00:00Z',
        uploadedBy: 'john.doe@company.com',
        batchId: 'basic-batch-1',
        pdfUrl: '/sample-pdf.pdf'
      },
      {
        id: 'doc-basic-3',
        filename: 'vendor_contract_v2.pdf',
        status: 'basic_extracted',
        uploadedAt: '2023-12-15T10:00:00Z',
        uploadedBy: 'john.doe@company.com',
        batchId: 'basic-batch-1',
        pdfUrl: '/sample-pdf.pdf'
      }
      // ... additional documents would be generated
    ]
  },
  {
    id: 'basic-batch-2',
    name: 'Legal Briefs Collection',
    uploadedAt: '2023-12-14T11:30:00Z',
    uploadedBy: 'sarah.wilson@lawfirm.com',
    totalDocuments: 8,
    status: 'basic_extraction_in_progress',
    documents: [
      {
        id: 'doc-basic-4',
        filename: 'case_brief_smith_v_jones.pdf',
        status: 'basic_extraction_in_progress',
        uploadedAt: '2023-12-14T11:30:00Z',
        uploadedBy: 'sarah.wilson@lawfirm.com',
        batchId: 'basic-batch-2',
        pdfUrl: '/sample-pdf.pdf'
      },
      {
        id: 'doc-basic-5',
        filename: 'motion_to_dismiss.pdf',
        status: 'basic_extracted',
        uploadedAt: '2023-12-14T11:30:00Z',
        uploadedBy: 'sarah.wilson@lawfirm.com',
        batchId: 'basic-batch-2',
        pdfUrl: '/sample-pdf.pdf'
      }
    ]
  }
];

// Add facts & summary review batches
const mockFactsSummaryBatches = [
  {
    id: 'fs-batch-1',
    name: 'Supreme Court Cases 2023',
    uploadDate: '2023-12-10',
    totalDocuments: 25,
    status: 'pending_summary_review',
    samplesReviewed: 0,
    samplesGood: 0,
    documents: createSampleDocuments('fs-batch-1', 25, 500)
  },
  {
    id: 'fs-batch-2',
    name: 'Commercial Disputes Q4',
    uploadDate: '2023-12-08',
    totalDocuments: 18,
    status: 'summary_review_in_progress',
    samplesReviewed: 3,
    samplesGood: 2,
    documents: createSampleDocuments('fs-batch-2', 18, 525)
  }
];

const mockBatches = [
  {
    id: 'batch-1',
    name: 'Legal Documents Batch 1',
    uploadDate: '2023-10-26T10:00:00Z',
    status: 'indexed',
    totalDocuments: 50,
    documents: createSampleDocuments('batch-1', 50, 1),
  },
  {
    id: 'batch-2',
    name: 'Court Filings Q3 2023',
    uploadDate: '2023-10-25T11:30:00Z',
    status: 'error',
    totalDocuments: 25,
    documents: createSampleDocuments('batch-2', 25, 51),
    samplesGood: 20,
    samplesReviewed: 25,
  },
  {
    id: 'batch-3',
    name: 'Client Cases August',
    uploadDate: '2023-10-24T14:00:00Z',
    status: 'pending_basic_extraction',
    totalDocuments: 75,
    documents: createSampleDocuments('batch-3', 75, 76),
  },
  {
    id: 'batch-4',
    name: 'Partnership Agreements',
    uploadDate: '2023-10-23T09:15:00Z',
    status: 'basic_extraction_in_progress',
    totalDocuments: 30,
    documents: createSampleDocuments('batch-4', 30, 151),
  },
  {
    id: 'batch-5',
    name: 'Property Deeds October',
    uploadDate: '2023-10-22T16:45:00Z',
    status: 'basic_extracted',
    totalDocuments: 40,
    documents: createSampleDocuments('batch-5', 40, 181),
  },
  {
    id: 'batch-6',
 name: 'IP Law Cases (Basic Review)',
    uploadDate: '2023-10-21T10:00:00Z',
 status: 'pending_basic_review', // Changed status
    totalDocuments: 20,
    documents: createSampleDocuments('batch-6', 20, 221),
  },
   {
    id: 'batch-7',
 name: 'Recent Contracts (Basic Review In Progress)',
    uploadDate: '2023-10-20T11:30:00Z',
 status: 'basic_review_in_progress', // Changed status
    totalDocuments: 35,
    documents: createSampleDocuments('batch-7', 35, 241),
  },
 {
    id: 'batch-8',
 name: 'Trademark Filings (Summary Review)',
 uploadDate: '2023-10-19T08:00:00Z',
 status: 'pending_summary_review', // Added new status
    totalDocuments: 15,
 documents: createSampleDocuments('batch-8', 15, 276),
 },
];

export const getBasicExtractionQueueBatchesDetailed = () => {
  return mockBasicExtractionBatches;
};

export const getBasicExtractionBatchById = (batchId) => {
  return mockBasicExtractionBatches.find(batch => batch.id === batchId);
};

export const getFactsSummaryReviewBatches = () => {
  return mockFactsSummaryBatches;
};

export const getFactsSummaryBatchById = (batchId) => {
  return mockFactsSummaryBatches.find(batch => batch.id === batchId);
};
