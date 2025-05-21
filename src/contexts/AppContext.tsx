
import React, { createContext, useContext, useState } from "react";
import { Batch, Document } from "../types";
import * as mockData from "../lib/mock-data";
import { toast } from "@/components/ui/use-toast";

interface AppContextType {
  currentStage: string;
  setCurrentStage: (stage: string) => void;
  currentBatch: Batch | null;
  setCurrentBatch: (batch: Batch | null) => void;
  currentSample: Document | null;
  setCurrentSample: (doc: Document | null) => void;
  currentSampleIndex: number;
  setCurrentSampleIndex: (index: number) => void;
  batches: Batch[];
  uploadBatch: (file: File) => void;
  markSample: (batchId: string, docId: string, isGood: boolean) => void;
  completeBatchReview: (batchId: string) => void;
  retrySampleReview: (batchId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStage, setCurrentStage] = useState<string>("upload");
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [currentSample, setCurrentSample] = useState<Document | null>(null);
  const [currentSampleIndex, setCurrentSampleIndex] = useState<number>(0);
  const [batches, setBatches] = useState<Batch[]>(mockData.getMockBatches());

  const uploadBatch = (file: File) => {
    // In a real app, this would handle file upload to a server
    // Here we simulate the upload and processing
    
    const newBatch: Batch = {
      id: `batch-${Date.now()}`,
      name: file.name.replace(/\.zip$/, ''),
      uploadDate: new Date().toISOString().split('T')[0],
      totalDocuments: Math.floor(Math.random() * 30) + 5, // Random number of docs
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
    
    // Simulate status changes over time
    setTimeout(() => {
      setBatches(prev => 
        prev.map(b => 
          b.id === newBatch.id ? { ...b, status: 'unpacking' } : b
        )
      );
      
      setTimeout(() => {
        setBatches(prev => 
          prev.map(b => 
            b.id === newBatch.id ? { ...b, status: 'queued' } : b
          )
        );
        
        toast({
          title: "Batch queued for extraction",
          description: `${newBatch.name} is ready for processing`,
        });
      }, 3000);
    }, 2000);
  };

  const markSample = (batchId: string, docId: string, isGood: boolean) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== batchId) return batch;
        
        // Update sample review stats
        const samplesReviewed = batch.samplesReviewed + 1;
        const samplesGood = isGood ? batch.samplesGood + 1 : batch.samplesGood;
        
        return {
          ...batch,
          status: 'review_in_progress',
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

  const completeBatchReview = (batchId: string) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== batchId) return batch;
        
        // Determine if batch passed the review
        const newStatus = batch.samplesGood > 5 ? 'indexed' : 'manual_intervention';
        
        toast({
          title: newStatus === 'indexed' ? "Batch approved for indexing" : "Batch flagged for manual intervention",
          description: `${batch.samplesGood} of ${batch.samplesReviewed} samples were marked as good.`,
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

  const retrySampleReview = (batchId: string) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id !== batchId) return batch;
        
        return {
          ...batch,
          status: 'review_ready',
          samplesReviewed: 0,
          samplesGood: 0
        };
      })
    );
    
    toast({
      title: "Sample review reset",
      description: "The batch is now ready for a new review.",
    });
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
      uploadBatch,
      markSample,
      completeBatchReview,
      retrySampleReview
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
