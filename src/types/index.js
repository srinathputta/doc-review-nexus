
/**
 * @typedef {Object} Document
 * @property {string} id
 * @property {string} filename
 * @property {string} batchId
 * @property {'uploaded' | 'basic_extracted' | 'basic_reviewed' | 'summary_extracted' | 'summary_reviewed' | 'indexed' | 'error'} status
 * @property {BasicMetadata} [basicMetadata]
 * @property {SummaryMetadata} [summaryMetadata]
 * @property {string} [pdfUrl]
 * @property {string} [s3Key]
 */

/**
 * @typedef {Object} BasicMetadata
 * @property {string} caseNo
 * @property {string} caseName
 * @property {string} court
 * @property {string} date
 * @property {string[]} judges
 * @property {string} petitioner
 * @property {string} appellant
 */

/**
 * @typedef {Object} SummaryMetadata
 * @property {string} facts
 * @property {string} summary
 * @property {string[]} citations
 */

/**
 * @typedef {Object} DocumentMetadata
 * @property {string} caseName
 * @property {string} court
 * @property {string} date
 * @property {string[]} judges
 * @property {string} petitioner
 * @property {string} respondent
 * @property {string} facts
 * @property {string} summary
 * @property {string[]} citations
 */

/**
 * @typedef {Object} Batch
 * @property {string} id
 * @property {string} name
 * @property {string} uploadDate
 * @property {number} totalDocuments
 * @property {BatchStatus} status
 * @property {Document[]} documents
 * @property {string} [errorMessage]
 * @property {number} [samplesReviewed]
 * @property {number} [samplesGood]
 * @property {Document[]} [samples]
 */

/**
 * @typedef {'uploading' | 'uploaded_to_s3' | 'unpacking' | 'queued' | 'extracting' | 'extracted' | 'pending_basic_extraction' | 'basic_extraction_in_progress' | 'pending_basic_review' | 'basic_review_in_progress' | 'pending_summary_extraction' | 'summary_extraction_in_progress' | 'pending_summary_review' | 'summary_review_in_progress' | 'review_ready' | 'basic_review_in_progress' | 'ready_for_indexing' | 'indexing_in_progress' | 'indexed' | 'manual_intervention' | 'error'} BatchStatus
 */

export {};
