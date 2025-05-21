
import React from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { setCurrentStage } = useApp();
  
  // Update current stage based on location path
  React.useEffect(() => {
    const path = location.pathname === "/" ? "upload" : location.pathname.slice(1);
    setCurrentStage(path);
  }, [location.pathname, setCurrentStage]);
  
  return (
    <MainLayout>
      <MainContent />
    </MainLayout>
  );
};

export default Index;
