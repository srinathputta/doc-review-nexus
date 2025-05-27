
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getMockDocumentsByBatchId } from "@/lib/mock-data";

const BasicDetailsReview = () => {
  const { batches, currentBatch, setCurrentBatch } = useApp();
  const navigate = useNavigate();
  
  const reviewReadyBatches = batches.filter(batch => 
    batch.status === 'pending_basic_review'
  );

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
                Extraction Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total PDFs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewer
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
                    Unassigned
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
                      Start Basic Review
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
  
  if (!currentBatch) return null;
  
  const documents = getMockDocumentsByBatchId(currentBatch.id);
  
  const handleCompleteReview = () => {
    // Update batch status to move to next stage
    setBatches(prev => 
      prev.map(batch => 
        batch.id === currentBatch.id 
          ? { ...batch, status: 'pending_summary_extraction' }
          : batch
      )
    );
    setCurrentBatch(null);
  };
  
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
                Petitioner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {document.basicMetadata?.petitioner || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={document.status} />
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
