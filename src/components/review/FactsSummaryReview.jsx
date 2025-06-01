
import React, { useState, useMemo } from "react";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getFactsSummaryReviewBatches } from "@/lib/mock-data";
import FactsSummaryBatchList from "./FactsSummaryBatchList";
import FactsSummaryReviewInterface from "./FactsSummaryReviewInterface";

const FactsSummaryReview = () => {
  const [currentBatch, setCurrentBatch] = useState(null);
  const navigate = useNavigate();

  const reviewReadyBatches = useMemo(() => getFactsSummaryReviewBatches(), []);

  if (currentBatch) {
    return <FactsSummaryReviewInterface currentBatch={currentBatch} setCurrentBatch={setCurrentBatch} />;
  }

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate('/fs-extraction')} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Facts & Summary Review Queue</h1>
        <p className="text-gray-600 mt-2">
          Review and verify facts and summary data for 10 random sample documents from each batch.
        </p>
      </div>

      <FactsSummaryBatchList 
        batches={reviewReadyBatches} 
        onSelectBatch={setCurrentBatch} 
      />
    </div>
  );
};

export default FactsSummaryReview;
