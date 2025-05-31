import React, { createContext, useContext, useState } from "react";
import * as mockData from "../lib/mock-data";
import { getMockExtractionDocuments } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Create some sample extraction batches
const createSampleExtractionBatches = () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'extraction-batch-1',
      name: 'Contract Documents Set A',
      uploadedAt: yesterday.toISOString(),
      uploadedBy: 'john.doe@company.com',
      totalDocuments: 3,
      status: 'pending_basic_extraction',
      documents: [
        {
          id: 'doc-ext-1',
          filename: 'employment_contract_2023.pdf',
          status: 'pending_basic_extraction',
          uploadedAt: yesterday.toISOString(),
          uploadedBy: 'john.doe@company.com',
          batchId: 'extraction-batch-1',
        },
        {
          id: 'doc-ext-2',
          filename: 'service_agreement_draft.pdf',
          status: 'basic_extraction_in_progress',
          uploadedAt: yesterday.toISOString(),
          uploadedBy: 'john.doe@company.com',
          batchId: 'extraction-batch-1',
        },
        {
          id: 'doc-ext-3',
          filename: 'vendor_contract_v2.pdf',
          status: 'pending_basic_extraction',
          uploadedAt: yesterday.toISOString(),
          uploadedBy: 'john.doe@company.com',
          batchId: 'extraction-batch-1',
        }
      ]
    },
    {
      id: 'extraction-batch-2',
      name: 'Legal Briefs Collection',
      uploadedAt: twoDaysAgo.toISOString(),
      uploadedBy: 'sarah.wilson@lawfirm.com',
      totalDocuments: 5,
      status: 'basic_extraction_in_progress',
      documents: [
        {
          id: 'doc-ext-4',
          filename: 'case_brief_smith_v_jones.pdf',
          status: 'basic_extraction_in_progress',
          uploadedAt: twoDaysAgo.toISOString(),
          uploadedBy: 'sarah.wilson@lawfirm.com',
          batchId: 'extraction-batch-2',
        },
        {
          id: 'doc-ext-5',
          filename: 'motion_to_dismiss.pdf',
          status: 'basic_extracted',
          uploadedAt: twoDaysAgo.toISOString(),
          uploadedBy: 'sarah.wilson@lawfirm.com',
          batchId: 'extraction-batch-2',
        },
        {
          id: 'doc-ext-6',
          filename: 'evidence_summary.pdf',
          status: 'basic_extraction_in_progress',
          uploadedAt: twoDaysAgo.toISOString(),
          uploadedBy: 'sarah.wilson@lawfirm.com',
          batchId: 'extraction-batch-2',
        },
        {
          id: 'doc-ext-7',
          filename: 'witness_testimony.pdf',
          status: 'pending_basic_extraction',
          uploadedAt: twoDaysAgo.toISOString(),
          uploadedBy: 'sarah.wilson@lawfirm.com',
          batchId: 'extraction-batch-2',
        },
        {
          id: 'doc-ext-8',
          filename: 'expert_report.pdf',
          status: 'basic_extracted',
          uploadedAt: twoDaysAgo.toISOString(),
          uploadedBy: 'sarah.wilson@lawfirm.com',
          batchId: 'extraction-batch-2',
        }
      ]
    },
    {
      id: 'extraction-batch-3',
      name: 'Patent Applications Batch',
      uploadedAt: now.toISOString(),
      uploadedBy: 'mike.tech@patents.com',
      totalDocuments: 2,
      status: 'pending_basic_extraction',
      documents: [
        {
          id: 'doc-ext-9',
          filename: 'software_patent_app.pdf',
          status: 'pending_basic_extraction',
          uploadedAt: now.toISOString(),
          uploadedBy: 'mike.tech@patents.com',
          batchId: 'extraction-batch-3',
        },
        {
          id: 'doc-ext-10',
          filename: 'hardware_design_patent.pdf',
          status: 'pending_basic_extraction',
          uploadedAt: now.toISOString(),
          uploadedBy: 'mike.tech@patents.com',
          batchId: 'extraction-batch-3',
        }
      ]
    }
  ];
};

export const AppProvider = ({ children }) => {
  const [currentStage, setCurrentStage] = useState("upload");
  const [currentBatch, setCurrentBatch] = useState(null);
  const [currentSample, setCurrentSample] = useState(null);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [batches, setBatches] = useState(mockData.getMockBatches());
  const [documentsForExtraction, setDocumentsForExtraction] = useState(getMockExtractionDocuments());
  const [extractionBatches, setExtractionBatches] = useState(createSampleExtractionBatches());

  const apiService = {
    getDocuments: async (batchId) => {
      return mockData.getMockDocumentsByBatchId(batchId);
    },
  };

  const uploadBatch = (files) => {
    const batchId = `batch-${Date.now()}`;
    const newDocuments = [];
    let batchName = '';

    files.forEach((file) => {
      if (file.type === "application/zip") {
        batchName = file.name.replace(/\.zip$/, "");
        const numDocuments = Math.floor(Math.random() * 5) + 2;
        for (let i = 0; i < numDocuments; i++) {
          newDocuments.push({
            id: `doc-${Date.now()}-${i}`,
            filename: `${file.name.replace(/\.zip$/, "")}_extracted_doc_${i + 1}.pdf`,
            status: "pending_basic_extraction",
            uploadedAt: new Date().toISOString(),
            uploadedBy: "user@example.com",
            batchId: batchId,
          });
        }

        toast({
          title: "ZIP file uploaded",
          description: `Simulating extraction of ${numDocuments} documents from ${file.name}.`,
        });
      } else if (file.type === "application/pdf") {
        batchName = file.name.replace(/\.pdf$/, "");
        newDocuments.push({
          id: `doc-${Date.now()}`,
          filename: file.name,
          status: "pending_basic_extraction",
          uploadedAt: new Date().toISOString(),
          uploadedBy: "user@example.com",
          batchId: batchId,
        });

        toast({
          title: "PDF file uploaded",
          description: `${file.name} added to extraction queue.`,
        });
      }
    });

    const newBatch = {
      id: batchId,
      name: batchName,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "user@example.com",
      totalDocuments: newDocuments.length,
      status: "pending_basic_extraction",
      documents: newDocuments,
    };

    setTimeout(() => {
      setDocumentsForExtraction((prev) => [
        ...prev,
        ...newDocuments
      ]);
      
      setExtractionBatches((prev) => [
        ...prev,
        newBatch
      ]);
    }, 3000);
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
        extractionBatches,
        setExtractionBatches,
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
