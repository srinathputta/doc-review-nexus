import React, { createContext, useContext, useState } from "react";
import * as mockData from "../lib/mock-data";
import { getMockExtractionDocuments } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentStage, setCurrentStage] = useState("upload");
  const [currentBatch, setCurrentBatch] = useState(null);
  const [currentSample, setCurrentSample] = useState(null);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [batches, setBatches] = useState(mockData.getMockBatches());
  const [documentsForExtraction, setDocumentsForExtraction] = useState(getMockExtractionDocuments());

  const apiService = {
    getDocuments: async (batchId) => {
      return mockData.getMockDocumentsByBatchId(batchId);
    },
  };

  const uploadBatch = (files) => {
    const newDocuments = [];

    files.forEach((file) => {
      if (file.type === "application/zip") {
        const numDocuments = Math.floor(Math.random() * 5) + 2;
        for (let i = 0; i < numDocuments; i++) {
          newDocuments.push({
            id: `doc-${Date.now()}-${i}`,
            filename: `${file.name.replace(/\.zip$/, "")}_extracted_doc_${i + 1}.pdf`,
            status: "pending basic details extraction",
            uploadedAt: new Date().toISOString(),
            uploadedBy: "user@example.com",
          });
        }

        toast({
          title: "ZIP file uploaded",
          description: `Simulating extraction of ${numDocuments} documents from ${file.name}.`,
        });
      } else if (file.type === "application/pdf") {
        newDocuments.push({
          id: `doc-${Date.now()}`,
          filename: file.name,
          status: "pending basic details extraction",
          uploadedAt: new Date().toISOString(),
          uploadedBy: "user@example.com",
        });

        toast({
          title: "PDF file uploaded",
          description: `${file.name} added to extraction queue.`,
        });
      }
    });

    // Simulate processing delay
    setTimeout(() => {
      setDocumentsForExtraction((prev) => [
        ...prev,
        ...newDocuments
      ]);
    }, 3000); // 3 seconds delay
  };

  const markSample = (batchId, docId, isGood) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.id !== batchId) return batch;

        const samplesReviewed = (batch.samplesReviewed || 0) + 1;
        const samplesGood = isGood ? (batch.samplesGood || 0) + 1 : (batch.samplesGood || 0);

        return {
          ...batch,
          status: "summary_review_in_progress",
          samplesReviewed,
          samplesGood,
        };
      })
    );

    toast({
      title: isGood ? "Sample marked as Good" : "Sample marked for Correction",
      description: `Sample ${docId} has been reviewed.`,
    });
  };

  const completeBatchReview = (batchId, pass = true) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.id !== batchId) return batch;

        const newStatus = pass ? "indexed" : "error";

        toast({
          title: newStatus === "indexed" ? "Batch approved for indexing" : "Batch flagged for manual intervention",
          description: `${batch.samplesGood || 0} of ${batch.samplesReviewed || 0} samples were marked as good.`,
        });

        return {
          ...batch,
          status: newStatus,
        };
      })
    );

    setCurrentBatch(null);
    setCurrentSample(null);
  };

  const sendToSummaryExtraction = (batchId) => {
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.id !== batchId) return batch;

        toast({
          title: "Batch sent for Facts & Summary extraction",
          description: `${batch.name} is now in the Facts & Summary extraction queue.`,
        });

        return {
          ...batch,
          status: "pending_summary_extraction",
        };
      })
    );

    setCurrentBatch(null);
  };

  return (
    <AppContext.Provider
      value={{
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
        documentsForExtraction,
        setDocumentsForExtraction,
        markSample,
        completeBatchReview,
        sendToSummaryExtraction,
        apiService,
      }}
    >
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
