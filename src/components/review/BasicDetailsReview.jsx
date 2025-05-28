
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getBasicReviewBatches, getMockDocumentsByBatchId } from "@/lib/mock-data";
import EditableCaseCard from "./EditableCaseCard";

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
                      ? `${batch.samplesReviewed || 0}/${batch.totalDocuments} reviewed`
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
  const { currentBatch, setCurrentBatch, batches, setBatches } = useApp();
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  
  if (!currentBatch) return null;
  
  const documents = getMockDocumentsByBatchId(currentBatch.id);
  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);
  
  const handleCompleteReview = () => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === currentBatch.id 
          ? { ...batch, status: 'pending_summary_extraction' }
          : batch
      )
    );
    setCurrentBatch(null);
  };

  const handleSaveDocument = (documentId, updatedData) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== currentBatch.id) return batch;
        
        return {
          ...batch,
          documents: batch.documents.map(doc => {
            if (doc.id !== documentId) return doc;
            
            return {
              ...doc,
              basicMetadata: {
                ...doc.basicMetadata,
                caseName: updatedData.caseName,
                court: updatedData.court,
                date: updatedData.date,
                petitioner: updatedData.petitioner,
                appellant: updatedData.appellant,
                judges: updatedData.judges
              }
            };
          })
        };
      })
    );
    
    console.log('Document saved:', documentId, updatedData);
  };
  
  if (selectedDocument) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton onClick={() => setSelectedDocumentId(null)} />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Review Case Details</h1>
          <p className="text-gray-600 mt-2">
            Reviewing document from batch: {currentBatch.name}
          </p>
        </div>
        
        <EditableCaseCard
          document={selectedDocument}
          onSave={handleSaveDocument}
          onCancel={() => setSelectedDocumentId(null)}
        />
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton onClick={() => setCurrentBatch(null)} />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Basic Details Review</h1>
        <p className="text-gray-600 mt-2">
          Review and verify basic metadata for all documents in batch: {currentBatch.name}
        </p>
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((document) => (
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
                  <StatusBadge status={document.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDocumentId(document.id)}
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
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleCompleteReview}
          className="bg-teal-700 hover:bg-teal-800"
        >
          Complete Basic Review & Move to F/S Extraction
        </Button>
      </div>
    </div>
  );
};

export default BasicDetailsReview;
