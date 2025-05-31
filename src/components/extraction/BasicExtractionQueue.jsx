
import React, { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getBasicExtractionQueueBatchesDetailed } from "@/lib/mock-data";
import BatchDetailView from "./BatchDetailView";
import { toast } from "@/hooks/use-toast";

const BasicExtractionQueue = () => {
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  
  const extractionBatches = getBasicExtractionQueueBatchesDetailed();

  const handleViewProgress = (batch) => {
    setSelectedBatchId(batch.id);
    toast({
      title: "Viewing batch details",
      description: `Opening detailed view for ${batch.name}`,
      className: "bg-blue-50 border-blue-200 text-blue-800"
    });
  };

  const handleBackToQueue = () => {
    setSelectedBatchId(null);
  };

  if (selectedBatchId) {
    return <BatchDetailView batchId={selectedBatchId} onBack={handleBackToQueue} />;
  }

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate("/upload")} />
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
                Uploaded At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Documents
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
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                    <div className="text-sm text-gray-500">{batch.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(batch.uploadedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.totalDocuments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button 
                      size="sm" 
                      onClick={() => handleViewProgress(batch)}
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      View Progress
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No batches in the queue.
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
