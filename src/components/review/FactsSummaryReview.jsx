import React, { useState, useMemo } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getFactsSummaryReviewBatches, getFactsSummaryBatchById, getMockSamplesByBatchId } from "@/lib/mock-data";
import FactsSummaryCaseCard from "./FactsSummaryCaseCard";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table";
import { toast } from "@/hooks/use-toast";

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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total PDFs
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Progress
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {reviewReadyBatches.length > 0
              ? reviewReadyBatches.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-gray-50">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.uploadDate}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.totalDocuments}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.status === 'summary_review_in_progress'
                        ? `${batch.samplesReviewed || 0}/10 samples reviewed (${batch.samplesGood || 0} good)`
                        : '0/10 samples reviewed'
                      }
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={batch.status} />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-teal-700 hover:text-teal-800 border-teal-600 hover:bg-teal-50"
                        onClick={() => setCurrentBatch(batch)}
                      >
                        {batch.status === 'summary_review_in_progress' ? 'Continue Review' : 'Start Sample Review'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : <TableRow>
                  <TableCell colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No batches ready for facts & summary review
                  </TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const FactsSummaryReviewInterface = ({ currentBatch, setCurrentBatch }) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(null);
  const [batchState, setBatchState] = useState(currentBatch);
  const navigate = useNavigate();

  if (!currentBatch) return null;

  const sampleDocuments = useMemo(() => {
    return getMockSamplesByBatchId(currentBatch.id);
  }, [currentBatch.id]);

  const selectedSample = (selectedSampleIndex !== null && sampleDocuments[selectedSampleIndex]) ? sampleDocuments[selectedSampleIndex] : null;
  const reviewedSamples = batchState.samplesReviewed || 0;
  const goodSamples = batchState.samplesGood || 0;
  const allSamplesReviewed = reviewedSamples >= 10;

  const handleCompleteReview = () => {
    const newStatus = goodSamples > 5 ? 'indexed' : 'error_summary_review';

    setBatchState(prev => ({ ...prev, status: newStatus }));
    setCurrentBatch(null);

    if (newStatus === 'indexed') {
      navigate('/indexed');
      toast({
        title: "Batch approved for indexing",
        description: `${goodSamples} of 10 samples were marked as good. Batch sent to indexing.`,
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } else {
      navigate('/intervention');
      toast({
        title: "Batch flagged for manual intervention",
        description: `Only ${goodSamples} of 10 samples were marked as good. Manual review required.`,
        className: "bg-red-50 border-red-200 text-red-800"
      });
    }
  };

  const handleMarkSample = (isGood) => {
    if (!selectedSample) return;

    const updatedSamplesReviewed = reviewedSamples + 1;
    const updatedSamplesGood = isGood ? goodSamples + 1 : goodSamples;

    setBatchState(prev => ({
      ...prev,
      status: 'summary_review_in_progress',
      samplesReviewed: updatedSamplesReviewed,
      samplesGood: updatedSamplesGood,
    }));

    toast({
      title: isGood ? "Sample marked as Good" : "Sample marked for Correction",
      description: `Sample ${selectedSample.filename || selectedSample.id} has been reviewed.`,
      className: isGood ? "bg-green-50 border-green-200 text-green-800" : "bg-orange-50 border-orange-200 text-orange-800"
    });

    if (selectedSampleIndex < sampleDocuments.length - 1) {
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
              Overall Batch Progress: {reviewedSamples}/10 samples reviewed ({goodSamples} good)
            </div>
            {allSamplesReviewed && goodSamples > 5 && (
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
          onMarkGood={() => handleMarkSample(true)}
          onMarkBad={() => handleMarkSample(false)}
          showMarkingButtons={!allSamplesReviewed || reviewedSamples < 10 }
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
            disabled={
                selectedSampleIndex === sampleDocuments.length - 1 ||
                (selectedSample && (!selectedSample.reviewStatus || selectedSample.reviewStatus === 'pending_sample_review')) && reviewedSamples < 10
            }
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

        {allSamplesReviewed && goodSamples > 5 && (
          <Button
            onClick={handleSendToIndexing}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3"
          >
            Send to Indexing
          </Button>
        )}
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Sample Review Progress:</span>
          <span className="text-sm text-gray-700">{reviewedSamples}/10 samples reviewed ({goodSamples} good)</span>
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
              goodSamples > 5 ? (
                <span className="text-green-600 font-medium">
                  ✓ Batch quality is good ({goodSamples}/10). Ready to send to indexing.
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ⚠ Batch quality is poor ({goodSamples}/10). Requires manual intervention.
                </span>
              )
            ) : (
              <span className="text-gray-600">Review {10 - reviewedSamples} more sample(s) to determine batch quality.</span>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Document ID/Filename
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case No
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facts Available
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review Status
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {sampleDocuments.length > 0
              ? sampleDocuments.map((sample, index) => (
                  <TableRow key={sample.id} className={selectedSampleIndex === index ? "bg-teal-50" : "hover:bg-gray-50"}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sample.filename || sample.id}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {sample.basicMetadata?.caseName || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {sample.basicMetadata?.caseNo || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {sample.summaryMetadata?.facts ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={sample.reviewStatus || 'pending_sample_review'} />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSampleIndex(index)}
                        className="text-teal-700 hover:text-teal-800 border-teal-600 hover:bg-teal-50"
                        disabled={allSamplesReviewed && sample.reviewStatus !== 'pending_sample_review'}
                      >
                        Review Sample
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : <TableRow>
                  <TableCell colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No samples found for this batch.
                  </TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FactsSummaryReview;
