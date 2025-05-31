
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

// Create some sample extraction batches with more detailed data
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
          basicMetadata: {
            caseNo: 'EMP/2023/001',
            caseName: 'Employment Contract - Software Developer',
            court: 'Delhi High Court',
            caseType: 'Employment Dispute',
            date: '2023-11-15',
            judges: ['Justice A.K. Sharma'],
            citations: ['2023 DHC 1234'],
            petitioner: 'TechCorp India Ltd.',
            respondent: 'Rahul Kumar',
            advocates: ['Adv. Priya Singh', 'Adv. Amit Verma'],
            actsSections: ['Industrial Disputes Act, 1947 - Section 10'],
            casesReferred: ['State of Punjab v. Modern Cultivators (1965) 1 SCR 854'],
            verdict: 'Contract terms upheld'
          }
        },
        {
          id: 'doc-ext-2',
          filename: 'service_agreement_draft.pdf',
          status: 'basic_extraction_in_progress',
          uploadedAt: yesterday.toISOString(),
          uploadedBy: 'john.doe@company.com',
          batchId: 'extraction-batch-1',
          basicMetadata: {
            caseNo: 'SVC/2023/002',
            caseName: 'Service Agreement Dispute - IT Services',
            court: 'Bombay High Court',
            caseType: 'Commercial Dispute',
            date: '2023-10-20',
            judges: ['Justice M.R. Patel'],
            citations: ['2023 BHC 567'],
            petitioner: 'Global Tech Solutions',
            respondent: 'Indian Software Corp',
            advocates: ['Adv. Neha Joshi', 'Adv. Vikram Shah'],
            actsSections: ['Contract Act, 1872 - Section 73'],
            casesReferred: ['Hadley v. Baxendale (1854) 9 Ex 341'],
            verdict: 'Pending'
          }
        },
        {
          id: 'doc-ext-3',
          filename: 'vendor_contract_v2.pdf',
          status: 'pending_basic_extraction',
          uploadedAt: yesterday.toISOString(),
          uploadedBy: 'john.doe@company.com',
          batchId: 'extraction-batch-1',
          basicMetadata: {
            caseNo: 'VND/2023/003',
            caseName: 'Vendor Supply Agreement Breach',
            court: 'Karnataka High Court',
            caseType: 'Commercial Dispute',
            date: '2023-12-01',
            judges: ['Justice S.K. Reddy'],
            citations: ['2023 KHC 890'],
            petitioner: 'Manufacturing Ltd.',
            respondent: 'Raw Material Suppliers',
            advocates: ['Adv. Ravi Kumar', 'Adv. Lakshmi Devi'],
            actsSections: ['Sale of Goods Act, 1930 - Section 39'],
            casesReferred: ['Murlidhar v. Harishchandra AIR 1962 SC 366'],
            verdict: 'Under consideration'
          }
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
          basicMetadata: {
            caseNo: 'CIV/2023/004',
            caseName: 'Smith v. Jones Property Dispute',
            court: 'Supreme Court of India',
            caseType: 'Civil Appeal',
            date: '2023-09-15',
            judges: ['Justice D.Y. Chandrachud', 'Justice J.B. Pardiwala'],
            citations: ['2023 SCC 445'],
            petitioner: 'John Smith',
            respondent: 'Robert Jones',
            advocates: ['Sr. Adv. Harish Salve', 'Adv. Mukul Rohatgi'],
            actsSections: ['Transfer of Property Act, 1882 - Section 54'],
            casesReferred: ['Tulsi v. Chandrika AIR 1987 SC 1075'],
            verdict: 'Appeal allowed'
          }
        },
        {
          id: 'doc-ext-5',
          filename: 'motion_to_dismiss.pdf',
          status: 'basic_extracted',
          uploadedAt: twoDaysAgo.toISOString(),
          uploadedBy: 'sarah.wilson@lawfirm.com',
          batchId: 'extraction-batch-2',
          basicMetadata: {
            caseNo: 'MTD/2023/005',
            caseName: 'Motion to Dismiss - Fraud Case',
            court: 'Delhi District Court',
            caseType: 'Criminal Case',
            date: '2023-11-30',
            judges: ['Judge R.K. Agarwal'],
            citations: ['2023 DDC 123'],
            petitioner: 'State of Delhi',
            respondent: 'Accused Party',
            advocates: ['APP Delhi', 'Adv. K.K. Menon'],
            actsSections: ['Indian Penal Code, 1860 - Section 420'],
            casesReferred: ['State v. Navjot Sandhu AIR 2005 SC 3820'],
            verdict: 'Motion denied'
          }
        },
        {
          id: 'doc-ext-6',
          filename: 'evidence_summary.pdf',
          status: 'basic_extraction_in_progress',
          uploadedAt: twoDaysAgo.toISOString(),
          uploadedBy: 'sarah.wilson@lawfirm.com',
          batchId: 'extraction-batch-2',
          basicMetadata: {
            caseNo: 'EVD/2023/006',
            caseName: 'Evidence Summary - Corruption Case',
            court: 'CBI Special Court',
            caseType: 'Criminal Trial',
            date: '2023-10-10',
            judges: ['Special Judge P.K. Bhasin'],
            citations: ['2023 CBI 789'],
            petitioner: 'Central Bureau of Investigation',
            respondent: 'Government Official',
            advocates: ['SPP CBI', 'Adv. Senior Counsel'],
            actsSections: ['Prevention of Corruption Act, 1988 - Section 13'],
            casesReferred: ['CBI v. V.C. Shukla AIR 1998 SC 1406'],
            verdict: 'Under trial'
          }
        },
        {
          id: 'doc-ext-7',
          filename: 'witness_testimony.pdf',
          status: 'pending_basic_extraction',
          uploadedAt: twoDaysAgo.toISOString(),
          uploadedBy: 'sarah.wilson@lawfirm.com',
          batchId: 'extraction-batch-2',
          basicMetadata: {
            caseNo: 'WIT/2023/007',
            caseName: 'Witness Testimony - Murder Trial',
            court: 'Sessions Court Mumbai',
            caseType: 'Criminal Trial',
            date: '2023-08-25',
            judges: ['Sessions Judge A.B. Kulkarni'],
            citations: ['2023 SCM 456'],
            petitioner: 'State of Maharashtra',
            respondent: 'Murder Accused',
            advocates: ['APP Mumbai', 'Adv. Defense Counsel'],
            actsSections: ['Indian Penal Code, 1860 - Section 302'],
            casesReferred: ['Sharad v. State of Maharashtra AIR 1984 SC 1622'],
            verdict: 'Testimony recorded'
          }
        },
        {
          id: 'doc-ext-8',
          filename: 'expert_report.pdf',
          status: 'basic_extracted',
          uploadedAt: twoDaysAgo.toISOString(),
          uploadedBy: 'sarah.wilson@lawfirm.com',
          batchId: 'extraction-batch-2',
          basicMetadata: {
            caseNo: 'EXP/2023/008',
            caseName: 'Expert Report - Patent Infringement',
            court: 'Intellectual Property Appellate Board',
            caseType: 'Patent Dispute',
            date: '2023-07-12',
            judges: ['Technical Member Dr. A.K. Jain'],
            citations: ['2023 IPAB 234'],
            petitioner: 'Pharma Innovation Ltd.',
            respondent: 'Generic Medicines Corp',
            advocates: ['Patent Attorney', 'IP Counsel'],
            actsSections: ['Patents Act, 1970 - Section 48'],
            casesReferred: ['Novartis AG v. Union of India AIR 2013 SC 1311'],
            verdict: 'Expert opinion accepted'
          }
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
          basicMetadata: {
            caseNo: 'PAT/2023/009',
            caseName: 'Software Patent Application - AI Algorithm',
            court: 'Patent Office India',
            caseType: 'Patent Application',
            date: '2023-12-15',
            judges: ['Patent Examiner Dr. S. Krishnan'],
            citations: ['2023 POI 567'],
            petitioner: 'AI Innovations Pvt. Ltd.',
            respondent: 'Patent Controller',
            advocates: ['Patent Agent', 'Technical Expert'],
            actsSections: ['Patents Act, 1970 - Section 3(k)'],
            casesReferred: ['Microsoft Corp v. Controller of Patents AIR 2013 Mad 274'],
            verdict: 'Application under examination'
          }
        },
        {
          id: 'doc-ext-10',
          filename: 'hardware_design_patent.pdf',
          status: 'pending_basic_extraction',
          uploadedAt: now.toISOString(),
          uploadedBy: 'mike.tech@patents.com',
          batchId: 'extraction-batch-3',
          basicMetadata: {
            caseNo: 'DES/2023/010',
            caseName: 'Hardware Design Patent - IoT Device',
            court: 'Design Wing Patent Office',
            caseType: 'Design Patent',
            date: '2023-12-20',
            judges: ['Design Examiner Mrs. R. Patel'],
            citations: ['2023 DPO 890'],
            petitioner: 'Electronics Design House',
            respondent: 'Design Controller',
            advocates: ['Design Attorney', 'Industrial Designer'],
            actsSections: ['Designs Act, 2000 - Section 4'],
            casesReferred: ['Godrej Sara Lee v. Reckitt Benckiser AIR 2006 Cal 235'],
            verdict: 'Design registration pending'
          }
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
