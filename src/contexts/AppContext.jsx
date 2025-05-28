
import React, { createContext, useContext, useState } from "react";
import * as mockData from "../lib/mock-data";
import { toast } from "@/hooks/use-toast";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentStage, setCurrentStage] = useState("upload");
  const [currentBatch, setCurrentBatch] = useState(null);
  const [currentSample, setCurrentSample] = useState(null);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [batches, setBatches] = useState(mockData.getMockBatches());

  const uploadBatch = (file) => {
    const newBatch = {
      id: `batch-${Date.now()}`,
      name: file.name.replace(/\.zip$/, ''),
      uploadDate: new Date().toISOString().split('T')[0],
      totalDocuments: Math.floor(Math.random() * 30) + 5,
      status: 'uploading',
      samplesReviewed: 0,
      samplesGood: 0,
      documents: []
    };
    
    setBatches(prev => [newBatch, ...prev]);
    
    toast({
      title: "Batch upload started",
      description: `Processing ${newBatch.name}...`,
    });
    
    setTimeout(() => {
      setBatches(prev => 
        prev.map(b => 
          b.id === newBatch.id ? { ...b, status: 'uploaded_to_s3' } : b
        )
      );
      
      setTimeout(() => {
        setBatches(prev => 
          prev.map(b => 
            b.id === newBatch.id ? { ...b, status: 'pending_basic_extraction' } : b
          )
        );
        
        toast({
          title: "Batch queued for extraction",
          description: `${newBatch.name} is ready for processing`,
        });
      }, 3000);
    }, 2000);
  };

  const markSample = (batchId, docId, isGood) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== batchId) return batch;
        
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
      description: `Sample ${docId} has been reviewed.`,
    });
  };

  const completeBatchReview = (batchId, pass = true) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== batchId) return batch;
        
        const newStatus = pass ? 'indexed' : 'error';
        
        toast({
          title: newStatus === 'indexed' ? "Batch approved for indexing" : "Batch flagged for manual intervention",
          description: `${batch.samplesGood || 0} of ${batch.samplesReviewed || 0} samples were marked as good.`,
        });
        
        return {
          ...batch,
          status: newStatus
        };
      })
    );
    
    setCurrentBatch(null);
    setCurrentSample(null);
  };

  const sendToSummaryExtraction = (batchId) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== batchId) return batch;
        
        toast({
          title: "Batch sent for Facts & Summary extraction",
          description: `${batch.name} is now in the Facts & Summary extraction queue.`,
        });
        
        return {
          ...batch,
          status: 'pending_summary_extraction'
        };
      })
    );
    
    setCurrentBatch(null);
  };

  return (
    <AppContext.Provider value={{
      currentStage,
      setCurrentStage,
      currentBatch,
      setCurrentBatch,
      currentSample,
      setCurrentSample,
      currentSampleIndex,
      setCurrentSampleIndex,
      batches,
      setBatches,
      uploadBatch,
      markSample,
      completeBatchReview,
      sendToSummaryExtraction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
