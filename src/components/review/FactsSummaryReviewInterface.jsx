
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getMockSamplesByBatchId } from "@/lib/mock-data";
import FactsSummaryCaseCard from "./FactsSummaryCaseCard";
import SampleDocumentsList from "./SampleDocumentsList";
import ReviewProgressBar from "./ReviewProgressBar";
import { toast } from "@/hooks/use-toast";

const FactsSummaryReviewInterface = ({ currentBatch, setCurrentBatch }) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(null);
  const [batchState, setBatchState] = useState(currentBatch);
  const navigate = useNavigate();

  const sampleDocuments = useMemo(() => {
    return getMockSamplesByBatchId(currentBatch.id);
  }, [currentBatch.id]);

  const selectedSample = (selectedSampleIndex !== null && sampleDocuments[selectedSampleIndex]) ? sampleDocuments[selectedSampleIndex] : null;
  const reviewedSamples = batchState.samplesReviewed || 0;
  const allSamplesReviewed = reviewedSamples >= 10;

  const handleCompleteReview = () => {
    setBatchState(prev => ({ ...prev, status: 'indexed' }));
    setCurrentBatch(null);
    navigate('/indexed');
    
    toast({
      title: "Batch approved for indexing",
      description: `All samples reviewed. Batch sent to indexing.`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  };

  const handleApproveAndNext = () => {
    if (!selectedSample) return;

    const updatedSamplesReviewed = reviewedSamples + 1;

    setBatchState(prev => ({
      ...prev,
      status: 'summary_review_in_progress',
      samplesReviewed: updatedSamplesReviewed,
    }));

    // Update the sample status
    sampleDocuments[selectedSampleIndex] = {
      ...selectedSample,
      reviewStatus: 'reviewed_ai_output_approved'
    };

    toast({
      title: "Sample approved",
      description: `Sample ${selectedSample.filename || selectedSample.id} has been approved.`,
      className: "bg-green-50 border-green-200 text-green-800"
    });

    // Move to next sample or complete review
    if (selectedSampleIndex < sampleDocuments.length - 1 && updatedSamplesReviewed < 10) {
      setSelectedSampleIndex(selectedSampleIndex + 1);
    } else if (updatedSamplesReviewed >= 10) {
      setSelectedSampleIndex(null);
    }
  };

  const handleSaveSampleData = (sampleId, updatedData, wasModified) => {
    toast({
      title: wasModified ? "Sample updated" : "Sample data saved",
      description: `Sample ${sampleId} has been ${wasModified ? 'updated and' : ''} saved.`,
      className: "bg-blue-50 border-blue-200 text-blue-800"
    });
  };

  const handleSendToIndexing = () => {
    setCurrentBatch(null);
    navigate('/indexed');
    toast({
      title: "Batch sent to indexing",
      description: `${currentBatch.name} has been approved and sent for indexing.`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  };

  const handleNextSample = () => {
    const currentSample = sampleDocuments[selectedSampleIndex];
    if (currentSample && currentSample.reviewStatus && 
        currentSample.reviewStatus !== 'pending_sample_review' && 
        currentSample.reviewStatus !== 'pending') {
      if (selectedSampleIndex < sampleDocuments.length - 1) {
        setSelectedSampleIndex(selectedSampleIndex + 1);
      }
    } else {
      toast({
        title: "Review Current Sample",
        description: "Please approve or save edits for the current sample before proceeding.",
        variant: "destructive"
      });
    }
  };

  const handlePreviousSample = () => {
    if (selectedSampleIndex > 0) {
      setSelectedSampleIndex(selectedSampleIndex - 1);
    }
  };

  if (selectedSample) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton onClick={() => setSelectedSampleIndex(null)} />

        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Sample Case</h1>
            <p className="text-gray-600 mt-2">
              Reviewing sample {selectedSampleIndex + 1} of {sampleDocuments.length} from batch: {currentBatch.name}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Overall Batch Progress: {reviewedSamples}/10 samples reviewed
            </div>
            {allSamplesReviewed && (
              <Button
                onClick={handleSendToIndexing}
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3"
              >
                Send to Indexing
              </Button>
            )}
          </div>
        </div>

        <FactsSummaryCaseCard
          document={selectedSample}
          onSave={handleSaveSampleData}
          onApproveAndNext={handleApproveAndNext}
          showApproveButton={reviewedSamples < 10}
        />

        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousSample}
            disabled={selectedSampleIndex === 0}
          >
            Previous Sample
          </Button>

          <Button
            variant="outline"
            onClick={handleNextSample}
            disabled={selectedSampleIndex === sampleDocuments.length - 1}
          >
            Next Sample
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton onClick={() => setCurrentBatch(null)} />

      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facts & Summary Sample Review</h1>
          <p className="text-gray-600 mt-2">
            Review 10 random samples from batch: <strong>{currentBatch.name}</strong>
          </p>
        </div>

        {allSamplesReviewed && (
          <Button
            onClick={handleSendToIndexing}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3"
          >
            Send to Indexing
          </Button>
        )}
      </div>

      <ReviewProgressBar reviewedSamples={reviewedSamples} />

      <SampleDocumentsList
        sampleDocuments={sampleDocuments}
        selectedSampleIndex={selectedSampleIndex}
        onSelectSample={setSelectedSampleIndex}
        allSamplesReviewed={allSamplesReviewed}
      />
    </div>
  );
};

export default FactsSummaryReviewInterface;
