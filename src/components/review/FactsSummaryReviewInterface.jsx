
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getMockSamplesByBatchId } from "@/lib/mock-data";
import FactsSummaryCaseCard from "./FactsSummaryCaseCard";
import { StatusBadge } from "@/components/ui/status-badge";
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

    // Find the index of the sample that was just saved
    const sampleIndexToUpdate = sampleDocuments.findIndex(sample => sample.id === sampleId);

    if (sampleIndexToUpdate !== -1) {
      sampleDocuments[sampleIndexToUpdate] = {
        ...sampleDocuments[sampleIndexToUpdate],
        reviewStatus: wasModified ? 'reviewed_manual_edit_approved' : 'reviewed_ai_output_approved',
      };
    }
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

      {/* Integrated Review Progress Bar */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Sample Review Progress:</span>
          <span className="text-sm text-gray-700">{reviewedSamples}/10 samples reviewed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-teal-600 h-2.5 rounded-full"
            style={{ width: `${(reviewedSamples / 10) * 100}%` }}
          ></div>
        </div>

        {reviewedSamples > 0 && (
          <div className="mt-2 text-sm">
            {allSamplesReviewed ? (
              <span className="text-green-600 font-medium">
                ✓ All samples reviewed. Ready to send to indexing.
              </span>
            ) : (
              <span className="text-gray-600">Review {10 - reviewedSamples} more sample(s) to complete batch review.</span>
            )}
          </div>
        )}
      </div>

      {/* Integrated Sample Documents List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Document ID/Filename
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facts Available
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sampleDocuments.length > 0
              ? sampleDocuments.map((sample, index) => (
                  <tr key={sample.id} className={selectedSampleIndex === index ? "bg-teal-50" : "hover:bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sample.filename || sample.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sample.basicMetadata?.caseName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sample.basicMetadata?.caseNo || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sample.summaryMetadata?.facts ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={sample.reviewStatus || 'pending_sample_review'} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => setSelectedSampleIndex(index)} className="text-teal-700 hover:text-teal-800 border-teal-600 hover:bg-teal-50" disabled={allSamplesReviewed && sample.reviewStatus !== 'pending_sample_review'}>
                        {sample.reviewStatus && sample.reviewStatus !== 'pending_sample_review' ? 'View/Edit' : 'Review'}
                      </Button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No samples found for this batch.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FactsSummaryReviewInterface;
