
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { getManualInterventionBatches } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { AlertCircle } from "lucide-react";

const ManualInterventionSection: React.FC = () => {
  const { retrySampleReview } = useApp();
  const batches = getManualInterventionBatches();
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manual Intervention</h1>
        <p className="text-gray-600 mt-2">
          Review and resolve issues with batches that require manual attention.
        </p>
      </div>
      
      {batches.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Name/ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                    <div className="text-sm text-gray-500">{batch.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.uploadDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {batch.status === 'manual_intervention' ? (
                      <div>
                        <span className="font-medium">Sample review failed</span>
                        <div className="mt-1 text-xs">
                          {batch.samplesGood} out of {batch.samplesReviewed} samples marked as good
                        </div>
                      </div>
                    ) : (
                      <span className="text-red-600">
                        {batch.errorMessage || "Unknown error"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {}}
                      >
                        View Details
                      </Button>
                      
                      {batch.status === 'manual_intervention' ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => retrySampleReview(batch.id)}
                            className="text-teal-700 border-teal-700 hover:bg-teal-50"
                          >
                            Retry Sample Review
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {}}
                            className="bg-teal-700 hover:bg-teal-800"
                          >
                            Override &amp; Index
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {}}
                          className="text-red-700 border-red-700 hover:bg-red-50"
                        >
                          Discard Batch
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <AlertCircle className="text-teal-700" size={24} />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
          <p className="text-gray-500">
            All batches have been processed successfully.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManualInterventionSection;
