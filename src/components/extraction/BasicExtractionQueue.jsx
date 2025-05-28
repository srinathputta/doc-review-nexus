
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getBasicExtractionQueueBatches } from "@/lib/mock-data";

const BasicExtractionQueue = () => {
  const { setCurrentBatch, setBatches } = useApp();
  const navigate = useNavigate();
  
  const extractionBatches = getBasicExtractionQueueBatches();

  const handleStartExtraction = (batch) => {
    if (batch.status === 'pending_basic_extraction') {
      setBatches(prev => 
        prev.map(b => 
          b.id === batch.id 
            ? { ...b, status: 'basic_extraction_in_progress' }
            : b
        )
      );
      
      // Simulate extraction completion
      setTimeout(() => {
        setBatches(prev => 
          prev.map(b => 
            b.id === batch.id 
              ? { ...b, status: 'pending_basic_review' }
              : b
          )
        );
      }, 3000);
    }
  };

  const handleViewBatch = (batch) => {
    setCurrentBatch(batch);
    navigate('/basic-details-review');
  };

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate('/upload')} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Basic Extraction Queue</h1>
        <p className="text-gray-600 mt-2">
          Batches waiting for or undergoing basic metadata extraction.
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {batch.status === 'basic_extraction_in_progress' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-teal-700 hover:text-teal-800"
                          onClick={() => handleViewBatch(batch)}
                        >
                          View Progress
                        </Button>
                      )}
                      {batch.status === 'pending_basic_extraction' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-teal-700 hover:text-teal-800"
                          onClick={() => handleStartExtraction(batch)}
                        >
                          Start Extraction
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No batches in extraction queue
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasicExtractionQueue;
