
import React, { useState, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getSummaryReviewBatches, getMockDocumentsByBatchId } from "@/lib/mock-data";
import EditableCaseCard from "./EditableCaseCard";
import { toast } from "@/hooks/use-toast";

const FactsSummaryReview = () => {
  const { currentBatch, setCurrentBatch } = useApp();
  const navigate = useNavigate();
  
  const reviewReadyBatches = getSummaryReviewBatches();

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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total PDFs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Progress
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
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.uploadDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.totalDocuments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.status === 'summary_review_in_progress' 
                      ? `${batch.samplesReviewed || 0}/10 samples reviewed (${batch.samplesGood || 0} good)`
                      : '0/10 samples reviewed'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-teal-700 hover:text-teal-800"
                      onClick={() => setCurrentBatch(batch)}
                    >
                      {batch.status === 'summary_review_in_progress' ? 'Continue Review' : 'Start Sample Review'}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No batches ready for facts & summary review
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FactsSummaryReviewInterface = () => {
  const { currentBatch, setCurrentBatch, batches, setBatches } = useApp();
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(null);
  
  if (!currentBatch) return null;
  
  // Generate 10 random samples from the batch documents
  const sampleDocuments = useMemo(() => {
    const allDocuments = getMockDocumentsByBatchId(currentBatch.id);
    if (allDocuments.length <= 10) return allDocuments;
    
    // Fisher-Yates shuffle to get random 10 samples
    const shuffled = [...allDocuments];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 10);
  }, [currentBatch.id]);
  
  const selectedSample = selectedSampleIndex !== null ? sampleDocuments[selectedSampleIndex] : null;
  const reviewedSamples = currentBatch.samplesReviewed || 0;
  const goodSamples = currentBatch.samplesGood || 0;
  const canCompleteReview = reviewedSamples >= 10;
  
  const handleCompleteReview = () => {
    const newStatus = goodSamples > 5 ? 'indexed' : 'error';
    
    setBatches(prev => 
      prev.map(batch => 
        batch.id === currentBatch.id 
          ? { ...batch, status: newStatus }
          : batch
      )
    );
    setCurrentBatch(null);
    
    toast({
      title: newStatus === 'indexed' ? "Batch approved for indexing" : "Batch flagged for manual intervention",
      description: `${goodSamples} of 10 samples were marked as good.`,
    });
  };

  const handleMarkSample = (isGood) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== currentBatch.id) return batch;
        
        const samplesReviewed = (batch.samplesReviewed || 0) + 1;
        const samplesGood = isGood ? (batch.samplesGood || 0) + 1 : (batch.samplesGood || 0);
        
        return {
          ...batch,
          status: 'summary_review_in_progress',
          samplesReviewed,
          samplesGood
        };
      })
    );
    
    toast({
      title: isGood ? "Sample marked as Good" : "Sample marked for Correction",
      description: `Sample has been reviewed.`,
    });
    
    // Move to next sample
    if (selectedSampleIndex < sampleDocuments.length - 1) {
      setSelectedSampleIndex(selectedSampleIndex + 1);
    } else {
      setSelectedSampleIndex(null);
    }
  };

  const handleSaveSample = (sampleId, updatedData, wasModified) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== currentBatch.id) return batch;
        
        return {
          ...batch,
          documents: batch.documents?.map(doc => {
            if (doc.id !== sampleId) return doc;
            
            return {
              ...doc,
              basicMetadata: {
                ...doc.basicMetadata,
                caseName: updatedData.caseName,
                court: updatedData.court,
                date: updatedData.date,
                petitioner: updatedData.petitioner,
                appellant: updatedData.appellant,
                judges: updatedData.judges
              },
              summaryMetadata: {
                ...doc.summaryMetadata,
                facts: updatedData.facts,
                summary: updatedData.summary,
                citations: updatedData.citations
              },
              reviewStatus: wasModified ? 'reviewed_with_modifications' : 'reviewed_no_changes'
            };
          }) || []
        };
      })
    );
    
    toast({
      title: wasModified ? "Sample updated" : "Sample approved",
      description: `Sample has been ${wasModified ? 'updated and' : ''} saved.`,
    });
  };

  const handlePrevious = () => {
    if (selectedSampleIndex > 0) {
      setSelectedSampleIndex(selectedSampleIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedSampleIndex < sampleDocuments.length - 1) {
      setSelectedSampleIndex(selectedSampleIndex + 1);
    }
  };
  
  if (selectedSample) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton onClick={() => setSelectedSampleIndex(null)} />
        
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Sample Case</h1>
            <p className="text-gray-600 mt-2">
              Reviewing sample {selectedSampleIndex + 1} of {sampleDocuments.length} from batch: {currentBatch.name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Progress: {reviewedSamples}/10 samples reviewed ({goodSamples} good)
            </div>
            {canCompleteReview && (
              <Button
                onClick={handleCompleteReview}
                className={goodSamples > 5 ? "bg-teal-700 hover:bg-teal-800" : "bg-red-600 hover:bg-red-700"}
              >
                {goodSamples > 5 ? 'Complete Review & Move to Indexing' : 'Send to Manual Intervention'}
              </Button>
            )}
          </div>
        </div>
        
        <EditableCaseCard
          document={selectedSample}
          onSave={(id, data, modified) => handleSaveSample(id, data, modified)}
          onCancel={() => setSelectedSampleIndex(null)}
          onMarkGood={() => handleMarkSample(true)}
          onMarkBad={() => handleMarkSample(false)}
          showMarkingButtons={true}
        />
        
        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={selectedSampleIndex === 0}
          >
            Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={selectedSampleIndex === sampleDocuments.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton onClick={() => setCurrentBatch(null)} />
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facts & Summary Review</h1>
          <p className="text-gray-600 mt-2">
            Review and verify facts and summary data for 10 random samples from batch: {currentBatch.name}
          </p>
        </div>
        
        {canCompleteReview && (
          <Button
            onClick={handleCompleteReview}
            className={goodSamples > 5 ? "bg-teal-700 hover:bg-teal-800 text-lg px-6 py-3" : "bg-red-600 hover:bg-red-700 text-lg px-6 py-3"}
          >
            {goodSamples > 5 ? 'Complete Review & Move to Indexing' : 'Send to Manual Intervention'}
          </Button>
        )}
      </div>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Sample Review Progress:</span>
          <span className="text-sm">{reviewedSamples}/10 samples reviewed ({goodSamples} good)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-teal-600 h-2 rounded-full" 
            style={{ width: `${(reviewedSamples / 10) * 100}%` }}
          ></div>
        </div>
        
        {reviewedSamples > 0 && (
          <div className="mt-2 text-sm">
            {goodSamples > 5 ? (
              <span className="text-green-600 font-medium">
                ✓ Batch quality is good ({goodSamples}/{reviewedSamples}). {canCompleteReview ? 'Ready for indexing.' : `Need ${10-reviewedSamples} more reviews.`}
              </span>
            ) : canCompleteReview ? (
              <span className="text-red-600 font-medium">
                ⚠ Batch quality is poor ({goodSamples}/10). Requires manual intervention.
              </span>
            ) : (
              <span>Review more samples to determine batch quality.</span>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Court
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
            {sampleDocuments.map((sample, index) => (
              <tr key={sample.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{sample.filename}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sample.basicMetadata?.caseName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sample.basicMetadata?.court || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sample.summaryMetadata?.facts ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={sample.reviewStatus || 'pending'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSampleIndex(index)}
                    className="text-teal-700 hover:text-teal-800"
                  >
                    Review Sample
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FactsSummaryReview;
