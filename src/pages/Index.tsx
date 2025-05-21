
import React from "react";
import { AppProvider } from "@/contexts/AppContext";
import MainLayout from "@/components/layouts/MainLayout";
import UploadSection from "@/components/upload/UploadSection";
import ExtractionQueueSection from "@/components/extraction/ExtractionQueueSection";
import BatchReviewSection from "@/components/review/BatchReviewSection";
import IndexedSection from "@/components/indexed/IndexedSection";
import ManualInterventionSection from "@/components/intervention/ManualInterventionSection";
import { useApp } from "@/contexts/AppContext";

// Main content router component
const MainContent: React.FC = () => {
  const { currentStage } = useApp();
  
  switch (currentStage) {
    case "upload":
      return <UploadSection />;
    case "extraction":
      return <ExtractionQueueSection />;
    case "review":
      return <BatchReviewSection />;
    case "indexed":
      return <IndexedSection />;
    case "intervention":
      return <ManualInterventionSection />;
    default:
      return <UploadSection />;
  }
};

// Main app component
const Index: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout>
        <MainContent />
      </MainLayout>
    </AppProvider>
  );
};

export default Index;
