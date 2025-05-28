
import React, { useState } from "react";
import { getErrorBatches } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ErrorSection = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const errorBatches = getErrorBatches();

  const handleViewBatch = (batch) => {
    setSelectedBatch(batch);
    setModalOpen(true);
  };

  const handleRetryBatch = (batchId) => {
    console.log(`Retrying batch ${batchId}`);
    // This would trigger a retry API call in production
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />Error
          Error Queue - Manual Intervention Required
        </h1>
        <p className="text-gray-600 mt-2">
          Batches that encountered errors during processing and require manual review or intervention.
        </p>
      </div>

      {errorBatches.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-green-600 mb-2">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-green-800 mb-2">No Errors Found</h3>
          <p className="text-green-600">All batches are processing successfully!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Type
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
              {errorBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                    <div className="text-sm text-gray-500">{batch.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.uploadDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.totalDocuments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">
                      {batch.samplesGood !== undefined ? 'Low Quality Extraction' : 'Processing Error'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {batch.samplesGood !== undefined 
                        ? `Only ${batch.samplesGood}/${batch.samplesReviewed} samples passed review`
                        : 'Failed during upload/extraction'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewBatch(batch)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetryBatch(batch.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Retry
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              Error Details: {selectedBatch?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Error Information</h4>
                <p className="text-red-700">
                  {selectedBatch.errorMessage || 'An error occurred during processing'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Batch ID:</span> {selectedBatch.id}
                </div>
                <div>
                  <span className="font-medium">Upload Date:</span> {selectedBatch.uploadDate}
                </div>
                <div>
                  <span className="font-medium">Total Documents:</span> {selectedBatch.totalDocuments}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <StatusBadge status={selectedBatch.status} className="ml-2" />
                </div>
              </div>

              {selectedBatch.samplesReviewed && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Review Results</h4>
                  <div className="text-yellow-700">
                    <p>Samples Reviewed: {selectedBatch.samplesReviewed}</p>
                    <p>Samples Passed: {selectedBatch.samplesGood}</p>
                    <p>Success Rate: {Math.round((selectedBatch.samplesGood / selectedBatch.samplesReviewed) * 100)}%</p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Recommended Actions</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Review the source documents for quality issues</li>
                  <li>• Check if the document format is supported</li>
                  <li>• Verify extraction settings and parameters</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ErrorSection;
