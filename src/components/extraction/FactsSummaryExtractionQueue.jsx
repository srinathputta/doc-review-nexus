
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getSummaryExtractionQueueBatches } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const FactsSummaryExtractionQueue = () => {
  const { setCurrentBatch, setBatches } = useApp();
  const navigate = useNavigate();
  
  const extractionBatches = getSummaryExtractionQueueBatches();

  const handleStartExtraction = (batch) => {
    if (batch.status === 'pending_summary_extraction') {
      setBatches(prev => 
        prev.map(b => 
          b.id === batch.id 
            ? { ...b, status: 'summary_extraction_in_progress' }
            : b
        )
      );
      
      toast({
        title: "Extraction started",
        description: `Facts & Summary extraction started for ${batch.name}`,
        className: "bg-blue-50 border-blue-200 text-blue-800"
      });
      
      // Simulate extraction completion
      setTimeout(() => {
        setBatches(prev => 
          prev.map(b => 
            b.id === batch.id 
              ? { ...b, status: 'pending_summary_review' }
              : b
          )
        );
        
        toast({
          title: "Extraction completed",
          description: `${batch.name} is ready for Facts & Summary review`,
          className: "bg-green-50 border-green-200 text-green-800"
        });
      }, 3000);
    }
  };

  const handleSendToReview = (batch) => {
    toast({
      title: "Batch sent to review",
      description: `${batch.name} has been sent to Facts & Summary Review`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
    navigate('/facts-summary-review');
  };

  const handleViewBatch = (batch) => {
    setCurrentBatch(batch);
    navigate('/facts-summary-review');
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
                      {batch.status === 'summary_extraction_in_progress' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-teal-700 hover:text-teal-800 border-teal-600 hover:bg-teal-50"
                          onClick={() => handleViewBatch(batch)}
                        >
                          View Progress
                        </Button>
                      )}
                      {batch.status === 'pending_summary_extraction' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-teal-700 hover:text-teal-800 border-teal-600 hover:bg-teal-50"
                          onClick={() => handleStartExtraction(batch)}
                        >
                          Start F/S Extraction
                        </Button>
                      )}
                      {batch.status === 'pending_summary_review' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleSendToReview(batch)}
                        >
                          Send to F/S Review
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
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
