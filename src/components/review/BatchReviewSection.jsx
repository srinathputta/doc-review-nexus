
import React, { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { getReviewReadyBatches } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { Batch } from "@/types";
import SampleReviewInterface from "./SampleReviewInterface";
import { useNavigate } from "react-router-dom";

const BatchReviewSection: React.FC = () => {
  const { currentBatch, setCurrentBatch } = useApp();
  const reviewReadyBatches = getReviewReadyBatches();
  const navigate = useNavigate();
  
  // If a batch is selected, show the sample review interface
  if (currentBatch) {
    return <SampleReviewInterface />;
  }
  
  return (
    <div className="p-6">
      <BackButton onClick={() => navigate('/')} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Batch Review</h1>
        <p className="text-gray-600 mt-2">
          Review extracted samples to evaluate data quality before indexing.
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
                Date Extracted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviewReadyBatches.length > 0 ? (
              reviewReadyBatches.map((batch) => (
                <BatchRow
                  key={batch.id}
                  batch={batch}
                  onSelect={() => setCurrentBatch(batch)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No batches ready for review
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Batch review row component
const BatchRow: React.FC<{ batch: Batch; onSelect: () => void }> = ({ batch, onSelect }) => {
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
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {batch.samplesReviewed || 0} / 10{" "}
        {batch.samplesReviewed && batch.samplesReviewed > 0 && `(${batch.samplesGood || 0} Good)`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-teal-700 hover:text-teal-800"
          onClick={onSelect}
        >
          {batch.samplesReviewed && batch.samplesReviewed > 0 ? "Continue Review" : "Start Review"}
        </Button>
      </td>
    </tr>
  );
};

export default BatchReviewSection;
