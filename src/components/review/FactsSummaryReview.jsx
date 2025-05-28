import React, { useState, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getSummaryReviewBatches, getMockSamplesByBatchId } from "@/lib/mock-data";
import FactsSummaryCaseCard from "./FactsSummaryCaseCard";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table";
import { toast } from "@/hooks/use-toast";

const FactsSummaryReview = () => {
  const { currentBatch, setCurrentBatch } = useApp();
  const navigate = useNavigate();

  const reviewReadyBatches = useMemo(() => getSummaryReviewBatches(), []);

  if (currentBatch) {
    return <FactsSummaryReviewInterface />;
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

const FactsSummaryReviewInterface = () => {
  const { currentBatch, setCurrentBatch, batches, setBatches, setCurrentStage } = useApp();
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(null);
  const navigate = useNavigate();

  if (!currentBatch) return null;

  const sampleDocuments = useMemo(() => {
    return getMockSamplesByBatchId(currentBatch.id);
  }, [currentBatch.id]);

  const selectedSample = (selectedSampleIndex !== null && sampleDocuments[selectedSampleIndex]) ? sampleDocuments[selectedSampleIndex] : null;
  const reviewedSamples = currentBatch.samplesReviewed || 0;
  const goodSamples = currentBatch.samplesGood || 0;
  const allSamplesReviewed = reviewedSamples >= 10;

  const handleCompleteReview = () => {
    const newStatus = goodSamples > 5 ? 'indexed' : 'error_summary_review';

    setBatches(prevBatches =>
      prevBatches.map(batch =>
        batch.id === currentBatch.id
          ? { ...batch, status: newStatus, samplesReviewed, samplesGood }
          : batch
      )
    );
    setCurrentBatch(null);

    if (newStatus === 'indexed') {
      setCurrentStage('indexed');
      navigate('/indexed');
    } else {
      setCurrentStage('intervention');
      navigate('/intervention');
    }

    toast({
      title: newStatus === 'indexed' ? "Batch approved for indexing" : "Batch flagged for manual intervention",
      description: `${goodSamples} of 10 samples were marked as good.`,
    });
  };

  const handleMarkSample = (isGood) => {
    if (!selectedSample) return;

    const updatedSamplesReviewed = reviewedSamples + 1;
    const updatedSamplesGood = isGood ? goodSamples + 1 : goodSamples;

    setBatches(prevBatches =>
      prevBatches.map(batch => {
        if (batch.id !== currentBatch.id) return batch;
        return {
          ...batch,
          status: 'summary_review_in_progress',
          samplesReviewed: updatedSamplesReviewed,
          samplesGood: updatedSamplesGood,
          documents: (batch.documents || sampleDocuments).map(doc =>
            doc.id === selectedSample.id
              ? { ...doc, reviewStatus: isGood ? 'sample_good' : 'sample_needs_correction' }
              : doc
          )
        };
      })
    );

    setCurrentBatch(prevCurrentBatch => ({
        ...prevCurrentBatch,
        status: 'summary_review_in_progress',
        samplesReviewed: updatedSamplesReviewed,
        samplesGood: updatedSamplesGood,
    }));


    toast({
      title: isGood ? "Sample marked as Good" : "Sample marked for Correction",
      description: `Sample ${selectedSample.filename || selectedSample.id} has been reviewed.`,
    });

    if (selectedSampleIndex < sampleDocuments.length - 1) {
      setSelectedSampleIndex(selectedSampleIndex + 1);
    } else if (updatedSamplesReviewed >= 10) {
        setSelectedSampleIndex(null);
    }
  };

  const handleSaveSampleData = (sampleId, updatedData, wasModified) => {
    setBatches(prevBatches =>
      prevBatches.map(batch => {
        if (batch.id !== currentBatch.id) return batch;
        const updatedDocs = (batch.documents || sampleDocuments).map(doc => {
          if (doc.id !== sampleId) return doc;
          return {
            ...doc,
            summaryMetadata: {
              ...(doc.summaryMetadata || {}),
              ...updatedData
            },
            reviewStatus: wasModified ? 'reviewed_with_modifications' : 'reviewed_no_changes',
            isModifiedInThisReview: wasModified,
          };
        });
        return { ...batch, documents: updatedDocs };
      })
    );

    toast({
      title: wasModified ? "Sample updated" : "Sample data saved",
      description: `Sample ${sampleId} has been ${wasModified ? 'updated and' : ''} saved.`,
    });
  };

  const handlePreviousSample = () => {
    if (selectedSampleIndex > 0) {
      setSelectedSampleIndex(selectedSampleIndex - 1);
    }
  };

  const handleNextSample = () => {
    if (selectedSampleIndex < sampleDocuments.length - 1) {
      setSelectedSampleIndex(selectedSampleIndex + 1);
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
              Overall Batch Progress: {reviewedSamples}/10 samples reviewed ({goodSamples} good)
            </div>
            {allSamplesReviewed && (
              <Button
                onClick={handleCompleteReview}
                className={goodSamples > 5 ? "bg-teal-700 hover:bg-teal-800 text-white text-lg px-6 py-3" : "bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3"}
              >
                {goodSamples > 5 ? 'Complete & Move to Indexing' : 'Send to Error Queue'}
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

        {allSamplesReviewed && (
          <Button
            onClick={handleCompleteReview}
            className={goodSamples > 5 ? "bg-teal-700 hover:bg-teal-800 text-white text-lg px-6 py-3" : "bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3"}
          >
            {goodSamples > 5 ? 'Complete Review & Move to Indexing' : 'Send to Error Queue'}
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
                    ✓ Batch quality is good ({goodSamples}/10). Ready for final decision.
                </span>
                ) : (
                <span className="text-red-600 font-medium">
                    ⚠ Batch quality is poor ({goodSamples}/10). Requires manual intervention if finalized.
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