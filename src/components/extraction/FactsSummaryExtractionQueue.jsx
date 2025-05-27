
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";

const FactsSummaryExtractionQueue = () => {
  const { batches, setBatches } = useApp();
  const navigate = useNavigate();
  
  const extractionBatches = batches.filter(batch => 
    ['pending_summary_extraction', 'summary_extraction_in_progress'].includes(batch.status)
  );

  const handleStartExtraction = (batchId) => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === batchId 
          ? { ...batch, status: 'summary_extraction_in_progress' }
          : batch
      )
    );
    
    // Simulate extraction completion
    setTimeout(() => {
      setBatches(prev => 
        prev.map(batch => 
          batch.id === batchId 
            ? { ...batch, status: 'pending_summary_review' }
            : batch
        )
      );
    }, 3000);
  };

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate('/basic-details-review')} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Facts & Summary Extraction Queue</h1>
        <p className="text-gray-600 mt-2">
          Batches waiting for or undergoing facts and summary extraction.
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
            {extractionBatches.length > 0 ? (
              extractionBatches.map((batch) => (
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
                      onClick={() => handleStartExtraction(batch.id)}
                      disabled={batch.status === 'summary_extraction_in_progress'}
                    >
                      {batch.status === 'summary_extraction_in_progress' ? 'Processing...' : 'Start F/S Extraction'}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No batches in F/S extraction queue
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FactsSummaryExtractionQueue;
