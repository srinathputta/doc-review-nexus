
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getBasicReviewBatches, getMockDocumentsByBatchId } from "@/lib/mock-data";
import BasicCaseCard from "./BasicCaseCard";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

const BasicDetailsReview = () => {
  const { currentBatch, setCurrentBatch } = useApp();
  const navigate = useNavigate();
  
  const reviewReadyBatches = getBasicReviewBatches();

  if (currentBatch) {
    return <BasicDetailsReviewInterface />;
  }

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate('/basic-extraction')} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Basic Details Review Queue</h1>
        <p className="text-gray-600 mt-2">
          Review and verify basic metadata for all documents in each batch.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total PDFs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviewReadyBatches.length > 0 ? (
              reviewReadyBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.uploadDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.totalDocuments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.status === 'basic_review_in_progress' 
                      ? `${batch.documentsReviewed || 0}/${batch.totalDocuments} reviewed`
                      : 'Not started'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-teal-700 hover:text-teal-800"
                      onClick={() => setCurrentBatch(batch)}
                    >
                      {batch.status === 'basic_review_in_progress' ? 'Continue Review' : 'Start Review'}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No batches ready for basic review
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BasicDetailsReviewInterface = () => {
  const { currentBatch, setCurrentBatch, batches, setBatches, setCurrentStage } = useApp();
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
  const navigate = useNavigate();
  
  if (!currentBatch) return null;
  
  const documents = getMockDocumentsByBatchId(currentBatch.id);
  const selectedDocument = documents[selectedDocumentIndex];
  const reviewedDocuments = documents.filter(doc => doc.reviewStatus && doc.reviewStatus !== 'pending').length;
  const allDocumentsReviewed = reviewedDocuments === documents.length;
  
  const handleSendToFactsSummaryExtraction = () => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === currentBatch.id 
          ? { ...batch, status: 'pending_summary_extraction' }
          : batch
      )
    );
    setCurrentBatch(null);
    setCurrentStage('fs-extraction');
    navigate('/fs-extraction');
    
    toast({
      title: "Basic review completed",
      description: `Batch ${currentBatch.name} has been sent to Facts & Summary extraction queue.`,
    });
  };

  const handleSaveDocument = (documentId, updatedData, wasModified) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== currentBatch.id) return batch;
        
        const updatedDocuments = batch.documents?.map(doc => {
          if (doc.id !== documentId) return doc;
          
          return {
            ...doc,
            basicMetadata: {
              ...doc.basicMetadata,
              ...updatedData
            },
            reviewStatus: wasModified ? 'reviewed_with_modifications' : 'reviewed_no_changes',
            isModified: wasModified
          };
        }) || [];
        
        const newReviewedCount = updatedDocuments.filter(doc => 
          doc.reviewStatus && doc.reviewStatus !== 'pending'
        ).length;
        
        return {
          ...batch,
          documents: updatedDocuments,
          documentsReviewed: newReviewedCount,
          status: 'basic_review_in_progress'
        };
      })
    );
    
    toast({
      title: wasModified ? "Document updated" : "Document approved",
      description: `${selectedDocument?.filename} has been ${wasModified ? 'updated and' : ''} approved.`,
    });
  };

  const handleApproveAndNext = () => {
    if (selectedDocument) {
      const originalData = {
        caseNo: selectedDocument.basicMetadata?.caseNo || '',
        caseName: selectedDocument.basicMetadata?.caseName || '',
        court: selectedDocument.basicMetadata?.court || '',
        caseType: selectedDocument.basicMetadata?.caseType || '',
        date: selectedDocument.basicMetadata?.date || '',
        judges: selectedDocument.basicMetadata?.judges || [],
        citations: selectedDocument.basicMetadata?.citations || [],
        petitioner: selectedDocument.basicMetadata?.petitioner || '',
        respondent: selectedDocument.basicMetadata?.respondent || '',
        advocates: selectedDocument.basicMetadata?.advocates || [],
        actsSections: selectedDocument.basicMetadata?.actsSections || [],
        casesReferred: selectedDocument.basicMetadata?.casesReferred || [],
        verdict: selectedDocument.basicMetadata?.verdict || ''
      };
      
      handleSaveDocument(selectedDocument.id, originalData, false);
      
      if (selectedDocumentIndex < documents.length - 1) {
        setSelectedDocumentIndex(selectedDocumentIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (selectedDocumentIndex > 0) {
      setSelectedDocumentIndex(selectedDocumentIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedDocumentIndex < documents.length - 1) {
      setSelectedDocumentIndex(selectedDocumentIndex + 1);
    }
  };
  
  if (selectedDocument) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton onClick={() => setSelectedDocumentIndex(null)} />
        
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Basic Case Details</h1>
            <p className="text-gray-600 mt-2">
              Reviewing document {selectedDocumentIndex + 1} of {documents.length} from batch: {currentBatch.name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Progress: {reviewedDocuments}/{documents.length} documents reviewed
            </div>
          </div>
        </div>
        
        <BasicCaseCard
          document={selectedDocument}
          onSave={handleSaveDocument}
          onCancel={() => setSelectedDocumentIndex(null)}
          onApproveAndNext={handleApproveAndNext}
        />
        
        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={selectedDocumentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={selectedDocumentIndex === documents.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton onClick={() => setCurrentBatch(null)} />
      
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Basic Details Review</h1>
            <p className="text-gray-600 mt-2">
              Review and verify basic metadata for all documents in batch: {currentBatch.name}
            </p>
          </div>
          
          {allDocumentsReviewed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-800">All Documents Reviewed!</h3>
                  <p className="text-sm text-green-600">Ready to send to Facts & Summary Extraction</p>
                </div>
                <Button
                  onClick={handleSendToFactsSummaryExtraction}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send to Facts & Summary Extraction
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Review Progress:</span>
            <span className="text-sm">{reviewedDocuments}/{documents.length} documents reviewed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(reviewedDocuments / documents.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Court
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((document, index) => (
              <tr key={document.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{document.filename}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {document.basicMetadata?.caseName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {document.basicMetadata?.court || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {document.basicMetadata?.date || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={document.reviewStatus || 'pending'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDocumentIndex(index)}
                    className="text-teal-700 hover:text-teal-800"
                  >
                    Review Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasicDetailsReview;
