
import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getMockSamplesByBatchId } from "@/lib/mock-data";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FactsSummaryReview = () => {
  const { batches, currentBatch, setCurrentBatch } = useApp();
  const navigate = useNavigate();
  
  const reviewReadyBatches = batches.filter(batch => 
    batch.status === 'pending_summary_review'
  );

  if (currentBatch) {
    return <FactsSummaryReviewInterface />;
  }

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate('/fs-extraction')} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Facts & Summary Review</h1>
        <p className="text-gray-600 mt-2">
          Review AI-generated facts and summaries for sample documents from each batch.
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
                Extraction Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total PDFs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewer
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
                    Unassigned
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary">Pending Summary Review</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-teal-700 hover:text-teal-800"
                      onClick={() => setCurrentBatch(batch)}
                    >
                      Start Summary Review
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No batches ready for summary review
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
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [samples, setSamples] = useState([]);
  const [reviewProgress, setReviewProgress] = useState({ reviewed: 0, good: 0 });
  const [currentSample, setCurrentSample] = useState(null);
  const [facts, setFacts] = useState('');
  const [summary, setSummary] = useState('');
  
  useEffect(() => {
    if (currentBatch) {
      const batchSamples = getMockSamplesByBatchId(currentBatch.id);
      setSamples(batchSamples.slice(0, 10)); // Only 10 samples
      if (batchSamples.length > 0) {
        setCurrentSample(batchSamples[0]);
        setFacts(batchSamples[0].summaryMetadata?.facts || '');
        setSummary(batchSamples[0].summaryMetadata?.summary || '');
      }
    }
  }, [currentBatch]);
  
  useEffect(() => {
    if (samples.length > 0 && currentSampleIndex < samples.length) {
      const sample = samples[currentSampleIndex];
      setCurrentSample(sample);
      setFacts(sample.summaryMetadata?.facts || '');
      setSummary(sample.summaryMetadata?.summary || '');
    }
  }, [currentSampleIndex, samples]);

  const handleMarkSample = (isGood) => {
    const newReviewed = reviewProgress.reviewed + 1;
    const newGood = isGood ? reviewProgress.good + 1 : reviewProgress.good;
    
    setReviewProgress({ reviewed: newReviewed, good: newGood });
    
    if (currentSampleIndex < samples.length - 1) {
      setCurrentSampleIndex(currentSampleIndex + 1);
    }
  };

  const handleCompleteReview = () => {
    const finalStatus = reviewProgress.good > 5 ? 'indexed' : 'manual_intervention';
    
    setBatches(prev => 
      prev.map(batch => 
        batch.id === currentBatch.id 
          ? { ...batch, status: finalStatus, samplesReviewed: reviewProgress.reviewed, samplesGood: reviewProgress.good }
          : batch
      )
    );
    setCurrentBatch(null);
  };

  if (!currentBatch || !currentSample) return null;

  const allSamplesReviewed = reviewProgress.reviewed >= 10;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton onClick={() => setCurrentBatch(null)} />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviewing Facts & Summary for Batch: {currentBatch.name}</h1>
        <p className="text-gray-600 mt-2">
          Review 10 sample documents for the facts & summary stage.
        </p>
      </div>

      {/* Progress Section */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Facts & Summary Review Progress:</h3>
          <div className="text-sm text-gray-600">
            {reviewProgress.reviewed} / 10 samples reviewed ({currentSampleIndex + 1} of 10 currently viewing)
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(reviewProgress.reviewed / 10) * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-600">
          {reviewProgress.good} Marked as Good
        </div>
        
        {allSamplesReviewed && (
          <div className="mt-4">
            <Button
              onClick={handleCompleteReview}
              className="bg-teal-700 hover:bg-teal-800"
            >
              {reviewProgress.good > 5 ? "Move to Indexing" : "Send to Manual Intervention"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Sample List */}
        <div className="col-span-4 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Samples (Facts & Summary)</h3>
            <p className="text-sm text-gray-600">1 of 10 shown</p>
          </div>
          <div className="p-2">
            {samples.map((sample, index) => (
              <div
                key={sample.id}
                className={`p-3 rounded cursor-pointer text-sm mb-2 ${
                  currentSampleIndex === index
                    ? "bg-teal-100 text-teal-700"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentSampleIndex(index)}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{sample.filename}</span>
                  <Badge variant="outline" className="ml-2">
                    AI Data (Pending)
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSampleIndex(Math.max(0, currentSampleIndex - 1))}
                disabled={currentSampleIndex === 0}
              >
                <ArrowLeft size={16} className="mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSampleIndex(Math.min(samples.length - 1, currentSampleIndex + 1))}
                disabled={currentSampleIndex === samples.length - 1}
              >
                Next <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="col-span-8 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Extracted Data: {currentSample.filename}</h3>
            <p className="text-sm text-gray-600">
              Review and edit the extracted fields for this stage. Saving changes marks the sample as good.
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">Facts & Summary Review (AI Generated)</h4>
              <p className="text-sm text-gray-600 mb-4">Review and edit the AI-generated facts and summary.</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Facts (AI Generated)</label>
                    <Badge variant="secondary">Relevant</Badge>
                  </div>
                  <Textarea
                    value={facts}
                    onChange={(e) => setFacts(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Summary (AI Generated)</label>
                    <Badge variant="secondary">Relevant</Badge>
                  </div>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {!allSamplesReviewed && (
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleMarkSample(false)}
                >
                  Mark as Needs Correction
                </Button>
                <Button
                  onClick={() => handleMarkSample(true)}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  Mark as Good
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactsSummaryReview;
