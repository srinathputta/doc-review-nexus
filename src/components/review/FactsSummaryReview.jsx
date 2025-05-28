
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { getSummaryReviewBatches, getMockSamplesByBatchId } from "@/lib/mock-data";
import EditableCaseCard from "./EditableCaseCard";

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
          Review and verify facts and summary data for sample documents from each batch.
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
                      ? `${batch.samplesReviewed || 0}/10 samples reviewed`
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
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  
  if (!currentBatch) return null;
  
  const samples = getMockSamplesByBatchId(currentBatch.id);
  const selectedSample = samples.find(sample => sample.id === selectedSampleId);
  
  const handleCompleteReview = () => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === currentBatch.id 
          ? { ...batch, status: 'indexed' }
          : batch
      )
    );
    setCurrentBatch(null);
  };

  const handleSaveSample = (sampleId, updatedData) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== currentBatch.id) return batch;
        
        return {
          ...batch,
          samples: batch.samples?.map(sample => {
            if (sample.id !== sampleId) return sample;
            
            return {
              ...sample,
              basicMetadata: {
                ...sample.basicMetadata,
                caseName: updatedData.caseName,
                court: updatedData.court,
                date: updatedData.date,
                petitioner: updatedData.petitioner,
                appellant: updatedData.appellant,
                judges: updatedData.judges
              },
              summaryMetadata: {
                ...sample.summaryMetadata,
                facts: updatedData.facts,
                summary: updatedData.summary,
                citations: updatedData.citations
              }
            };
          })
        };
      })
    );
    
    console.log('Sample saved:', sampleId, updatedData);
  };
  
  if (selectedSample) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton onClick={() => setSelectedSampleId(null)} />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Review Sample Case</h1>
          <p className="text-gray-600 mt-2">
            Reviewing sample from batch: {currentBatch.name}
          </p>
        </div>
        
        <EditableCaseCard
          document={selectedSample}
          onSave={handleSaveSample}
          onCancel={() => setSelectedSampleId(null)}
        />
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton onClick={() => setCurrentBatch(null)} />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Facts & Summary Review</h1>
        <p className="text-gray-600 mt-2">
          Review and verify facts and summary data for sample documents in batch: {currentBatch.name}
        </p>
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {samples.map((sample) => (
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
                  <StatusBadge status={sample.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSampleId(sample.id)}
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
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleCompleteReview}
          className="bg-teal-700 hover:bg-teal-800"
        >
          Complete F/S Review & Move to Indexing
        </Button>
      </div>
    </div>
  );
};

export default FactsSummaryReview;
