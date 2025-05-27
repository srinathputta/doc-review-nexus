
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { getReviewReadyBatches } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import SampleReviewInterface from "./SampleReviewInterface";
import BasicReviewSection from "./BasicReviewSection";
import { useNavigate } from "react-router-dom";

const BatchReviewSection = () => {
  const { currentBatch, setCurrentBatch } = useApp();
  const reviewReadyBatches = getReviewReadyBatches();
  const navigate = useNavigate();
  
  // Show basic review for basic_review stage
  if (currentBatch && currentBatch.status === 'pending_basic_review') {
    return <BasicReviewSection />;
  }
  
  // Show sample review for summary review stage
  if (currentBatch && currentBatch.status === 'pending_summary_review') {
    return <SampleReviewInterface />;
  }
  
  return (
    <div className="p-6">
      <BackButton onClick={() => navigate('/')} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Batch Review</h1>
        <p className="text-gray-600 mt-2">
          Review extracted data to evaluate quality before indexing.
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
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
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

const BatchRow = ({ batch, onSelect }) => {
  const getButtonText = () => {
    if (batch.status === 'pending_basic_review') {
      return "Start Basic Review";
    } else if (batch.status === 'pending_summary_review') {
      return "Start Summary Review";
    } else if (batch.samplesReviewed && batch.samplesReviewed > 0) {
      return "Continue Review";
    }
    return "Start Review";
  };
  
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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-teal-700 hover:text-teal-800"
          onClick={onSelect}
        >
          {getButtonText()}
        </Button>
      </td>
    </tr>
  );
};

export default BatchReviewSection;
