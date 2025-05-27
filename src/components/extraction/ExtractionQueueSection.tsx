
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { getExtractionQueueBatches } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { Batch } from "@/types";

const ExtractionQueueSection: React.FC = () => {
  const batches = getExtractionQueueBatches();
  
  return (
    <div className="p-6">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Extraction Queue</h1>
        <p className="text-gray-600 mt-2">
          Monitor the extraction process for all uploaded batches.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch Name/ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
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
            {batches.length > 0 ? (
              batches.map((batch) => (
                <BatchRow key={batch.id} batch={batch} />
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

// Extraction queue row component
const BatchRow: React.FC<{ batch: Batch }> = ({ batch }) => {
  return (
    <tr>
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
        <StatusBadge status={batch.status} />
        {batch.status === 'basic_extraction_in_progress' && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-teal-500 h-1.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Button variant="outline" size="sm" className="text-teal-700 hover:text-teal-800">
          View Details
        </Button>
      </td>
    </tr>
  );
};

export default ExtractionQueueSection;
