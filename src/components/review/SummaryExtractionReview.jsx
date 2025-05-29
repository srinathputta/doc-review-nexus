import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import flaskApi from '@/services/flaskApi';
import { toast, useToast } from "@/hooks/use-toast";
import { Send, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const SummaryExtractionReview = () => {
  const { currentBatch, setCurrentBatch, batches, setBatches, setCurrentStage, apiService } = useApp();
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(null);
  const [documentToDiffId, setDocumentToDiffId] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchDocs = async () => {
      if (!currentBatch?.id) {
        if (isMounted) setDocuments([]);
        return;
      }
      if (isMounted) setIsLoading(true);
      if (isMounted) setError(null);

      try {
        const fetchedDocuments = await apiService.getDocuments(currentBatch.id);
        if (isMounted && fetchedDocuments) {
          const documentsWithOriginal = fetchedDocuments.map(doc => ({
            ...doc,
            originalSummary: doc.originalSummary || { ...(doc.summary || {}) },
            reviewStatus: doc.reviewStatus || 'pending_summary_review'
          }));
          setDocuments(documentsWithOriginal);

          setBatches(prevBatches => {
            const existingBatch = prevBatches.find(b => b.id === currentBatch.id);
            if (existingBatch) {
              return prevBatches.map(batch =>
                batch.id === currentBatch.id ? { 
                  ...batch, 
                  documents: documentsWithOriginal, 
                  documentsReviewed: documentsWithOriginal.filter(d => 
                    d.reviewStatus && 
                    d.reviewStatus !== 'pending_summary_review' && 
                    d.reviewStatus !== 'pending'
                  ).length 
                } : batch
              );
            }
            return prevBatches;
          });
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        if (isMounted) {
          setError("Failed to load documents for this batch. " + (err.message || ''));
          setDocuments([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDocs();

    return () => {
      isMounted = false;
    };
  }, [currentBatch?.id]);

  const documentToDiff = React.useMemo(() => {
    if (!documentToDiffId) return null;
    return documents.find(doc => doc.id === documentToDiffId);
  }, [documentToDiffId, documents]);

  const handleViewPdf = (document) => {
    setPdfDocument(document);
    setShowPdfModal(true);
  };

  const selectedDocument = (selectedDocumentIndex !== null && documents[selectedDocumentIndex])
    ? documents[selectedDocumentIndex]
    : null;

  const reviewedDocumentsCount = React.useMemo(() => {
    const batchInState = batches.find(b => b.id === currentBatch?.id);
    const docsInBatch = batchInState?.documents || documents;
    return docsInBatch.filter(doc => 
      doc.reviewStatus && 
      doc.reviewStatus !== 'pending_summary_review' && 
      doc.reviewStatus !== 'pending'
    ).length;
  }, [batches, currentBatch?.id, documents]);

  const allDocumentsReviewed = reviewedDocumentsCount === documents.length && documents.length > 0;

  const handleSendToIndex = async () => {
    setBatches(prevBatches =>
      prevBatches.map(batch =>
        batch.id === currentBatch.id
          ? { ...batch, status: 'pending_indexing', documentsReviewed: reviewedDocumentsCount }
          : batch
      )
    );
    setCurrentBatch(null);
    setCurrentStage('indexed');
    navigate('/indexed');

    toast({
      title: "Summary review completed",
      description: `Batch ${currentBatch.name} has been sent to the indexing queue.`,
    });
  };

  const handleSaveDocument = (documentId, updatedData, wasModified) => {
    let updatedDocumentFilename = "Document";
    const docToUpdate = documents.find(d => d.id === documentId) || selectedDocument;
    if (docToUpdate) updatedDocumentFilename = docToUpdate.filename || documentId;

    setDocuments(prevDocs => prevDocs.map(doc => {
      if (doc.id !== documentId) return doc;
      return {
        ...doc,
        summary: { ...(doc.summary || {}), ...updatedData },
        reviewStatus: wasModified ? 'reviewed_manual_edit_approved' : 'reviewed_ai_output_approved',
        isModifiedInThisReview: wasModified,
      };
    }));

    setBatches(prevBatches =>
      prevBatches.map(batch => {
        if (batch.id !== currentBatch.id) return batch;

        const updatedBatchDocuments = documents.map(doc => {
          if (doc.id !== documentId) return doc; 
          return {
            ...doc,
            summary: { ...(doc.summary || {}), ...updatedData },
            reviewStatus: wasModified ? 'reviewed_manual_edit_approved' : 'reviewed_ai_output_approved',
            isModifiedInThisReview: wasModified,
          };
        });

        const newReviewedCount = updatedBatchDocuments.filter(doc =>
          doc.reviewStatus && 
          doc.reviewStatus !== 'pending_summary_review' && 
          doc.reviewStatus !== 'pending'
        ).length;

        const batchIsFullyReviewed = newReviewedCount === updatedBatchDocuments.length && updatedBatchDocuments.length > 0;

        return {
          ...batch,
          documents: updatedBatchDocuments,
          documentsReviewed: newReviewedCount,
          status: batchIsFullyReviewed
                  ? 'summary_review_completed_ready_for_index'
                  : 'summary_review_in_progress',
        };
      })
    );

    toast({
      title: wasModified ? "Document updated" : "Document approved",
      description: `${updatedDocumentFilename} summary ${wasModified ? 'updated' : 'approved'}.`,
    });
  };

  const handleApproveAndNext = () => {
    if (selectedDocument) {
      handleSaveDocument(
        selectedDocument.id, 
        { ...selectedDocument.summary }, 
        selectedDocument.isModifiedInThisReview || false
      );

      if (selectedDocumentIndex < documents.length - 1) {
        setSelectedDocumentIndex(selectedDocumentIndex + 1);
      } else if (allDocumentsReviewed) {
        setSelectedDocumentIndex(null);
      }
    }
  };

  const handlePrevious = () => {
    if (selectedDocumentIndex > 0) {
      setSelectedDocumentIndex(selectedDocumentIndex - 1);
    }
  };

  const handleNext = () => {
    const currentDocForCheck = documents[selectedDocumentIndex];
    if (currentDocForCheck && 
        currentDocForCheck.reviewStatus && 
        currentDocForCheck.reviewStatus !== 'pending_summary_review' && 
        currentDocForCheck.reviewStatus !== 'pending') {
      if (selectedDocumentIndex < documents.length - 1) {
        setSelectedDocumentIndex(selectedDocumentIndex + 1);
      }
    } else {
      toast({
        title: "Review Current Document",
        description: "Please approve or save edits for the current document before proceeding.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading documents for batch {currentBatch?.name}...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {error}
        <Button 
          onClick={() => {
            const id = currentBatch.id;
            setCurrentBatch(prev => ({...prev, id: null}));
            setTimeout(() => setCurrentBatch(prev => ({...prev, id})), 0);
          }} 
          className="ml-4 mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (selectedDocument) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton onClick={() => setSelectedDocumentIndex(null)} className="mb-6" />
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Summary</h1>
            <p className="text-gray-600 mt-2">
              Reviewing document {selectedDocumentIndex + 1} of {documents.length} from batch: {currentBatch.name}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Batch Progress: {reviewedDocumentsCount}/{documents.length} documents reviewed
          </div>
        </div>

        {/* SummaryReviewCard
          document={selectedDocument}
          onCancel={() => setSelectedDocumentIndex(null)}
          onSave={handleSaveDocument}
          onApproveAndNext={handleApproveAndNext}
          showApproveButton={selectedDocumentIndex < documents.length - 1 || !allDocumentsReviewed}
          onViewPdf={handleViewPdf}
        /> */}

        <div className="mt-6 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={selectedDocumentIndex === 0} 
            className="flex items-center px-4 py-2"
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={handleNext} 
            disabled={selectedDocumentIndex === documents.length - 1} 
            className="flex items-center"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton onClick={() => setCurrentBatch(null)} className="mb-6" />
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Summary Review</h1>
            <p className="text-gray-600 mt-2">Review and verify summary for all documents in batch: <strong>{currentBatch.name}</strong></p>
          </div>
          {allDocumentsReviewed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex-shrink-0">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-green-700">All Documents Reviewed!</h3>
                  <p className="text-sm text-green-600">This batch is ready for Indexing.</p>
                </div>
                <Button 
                  onClick={handleSendToIndex} 
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-6 py-3 text-base" 
                  size="lg"
                >
                  <Send className="w-5 h-5 mr-2" />Send to Index
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Review Progress:</span>
            <span className="text-sm text-gray-700">{reviewedDocumentsCount}/{documents.length || 0} documents reviewed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-teal-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(reviewedDocumentsCount / (documents.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Name</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Status</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {documents.length > 0
              ? documents.map((document, index) => (
                <TableRow key={document.id} className={selectedDocumentIndex === index ? "bg-teal-50" : "hover:bg-gray-50"}>
                  <TableCell className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{document.filename || document.id}</div></TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{document.basicMetadata?.caseName || 'N/A'}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{document.basicMetadata?.court || 'N/A'}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{document.basicMetadata?.date || 'N/A'}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={document.reviewStatus || 'pending_summary_review'} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {document.reviewStatus === 'reviewed_manual_edit_approved' && document.originalSummary && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-700 hover:text-blue-800 border-blue-600 hover:bg-blue-50 px-3 py-1.5 text-xs"
                        onClick={(e) => { e.stopPropagation(); setDocumentToDiffId(document.id); }}
                      >
                        View Diff
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-700 hover:text-purple-800 border-purple-600 hover:bg-purple-50 px-3 py-1.5 text-xs"
                      onClick={(e) => { e.stopPropagation(); handleViewPdf(document); }}
                    >
                      View PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDocumentIndex(index)}
                      className="text-teal-700 hover:text-teal-800 border-teal-600 hover:bg-teal-50"
                    >
                      {document.reviewStatus && document.reviewStatus !== 'pending_summary_review' && document.reviewStatus !== 'pending' ? 'View/Edit' : 'Review'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
              : <TableRow><TableCell colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No documents found for this batch or still loading.</TableCell></TableRow>
            }
          </TableBody>
        </Table>
      </div>

      {/* Diff Viewer Dialog */}
      {documentToDiff && (
        <Dialog open={!!documentToDiffId} onOpenChange={(open) => !open && setDocumentToDiffId(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Summary Comparison</DialogTitle>
              <DialogDescription>
                Comparing original AI extraction with manual edits for {documentToDiff.filename || documentToDiff.id}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edited Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.keys({
                      ...documentToDiff.originalSummary,
                      ...documentToDiff.summary
                    }).map((key) => (
                      <tr key={key} className={
                        JSON.stringify(documentToDiff.originalSummary?.[key]) !== 
                        JSON.stringify(documentToDiff.summary?.[key]) 
                          ? "bg-yellow-50" 
                          : ""
                      }>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {documentToDiff.originalSummary?.[key] ? 
                            (typeof documentToDiff.originalSummary[key] === 'object' 
                              ? JSON.stringify(documentToDiff.originalSummary[key], null, 2)
                              : String(documentToDiff.originalSummary[key]))
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {documentToDiff.summary?.[key] ? 
                            (typeof documentToDiff.summary[key] === 'object' 
                              ? JSON.stringify(documentToDiff.summary[key], null, 2)
                              : String(documentToDiff.summary[key]))
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* PDF Viewer Dialog */}
      <Dialog key={pdfDocument?.id || 'pdf-viewer'} open={showPdfModal} onOpenChange={setShowPdfModal}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Document Preview: {pdfDocument?.filename}</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-100 p-8 rounded-md h-[70vh] flex flex-col items-center justify-center">
            <div className="text-center max-w-2xl">
              <Eye size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">PDF Preview</h3>
              <p className="text-gray-600 mb-4">This is a mock preview of the document. In production, this would show the actual PDF content.</p>
              <div className="bg-white p-6 rounded border shadow-sm text-left">
                <div className="border-b pb-4 mb-4">
                  <h4 className="font-bold text-lg text-center mb-2">SUPREME COURT OF INDIA</h4>
                  <p className="text-sm text-center text-gray-600">Civil Appeal No. {pdfDocument?.basicMetadata?.caseNo}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-lg">{pdfDocument?.basicMetadata?.caseName}</h4>
                  <p className="text-sm"><strong>Court:</strong> {pdfDocument?.basicMetadata?.court}</p>
                  <p className="text-sm"><strong>Date:</strong> {pdfDocument?.basicMetadata?.date}</p>
                  <p className="text-sm"><strong>Judges:</strong> {pdfDocument?.basicMetadata?.judges?.join(', ')}</p>
                  <p className="text-sm"><strong>Petitioner:</strong> {pdfDocument?.basicMetadata?.petitioner}</p>
                  <p className="text-sm"><strong>Respondent:</strong> {pdfDocument?.basicMetadata?.respondent}</p>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">This is a sample preview showing the structured data extracted from the PDF. The actual implementation would display the full PDF content.</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">File: {pdfDocument?.filename}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SummaryExtractionReview;
