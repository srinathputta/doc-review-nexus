
import React from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import UploadSection from "@/components/upload/UploadSection";
import BasicExtractionQueue from "@/components/extraction/BasicExtractionQueue";
import BasicDetailsReview from "@/components/review/BasicDetailsReview";
import FactsSummaryExtractionQueue from "@/components/extraction/FactsSummaryExtractionQueue";
import FactsSummaryReview from "@/components/review/FactsSummaryReview";
import IndexedSection from "@/components/indexed/IndexedSection";
import ErrorSection from "@/components/error/ErrorSection";
import { useApp } from "@/contexts/AppContext";

const MainContent = () => {
  const { currentStage } = useApp();
  
  switch (currentStage) {
    case "upload":
      return <UploadSection />;
    case "basic-extraction":
      return <BasicExtractionQueue />;
    case "basic-details-review":
      return <BasicDetailsReview />;
    case "fs-extraction":
      return <FactsSummaryExtractionQueue />;
    case "facts-summary-review":
      return <FactsSummaryReview />;
    case "indexed":
      return <IndexedSection />;
    case "intervention":
      return <ErrorSection />;
    default:
      return <UploadSection />;
  }
};

const Index = () => {
  const location = useLocation();
  const { setCurrentStage } = useApp();
  
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
