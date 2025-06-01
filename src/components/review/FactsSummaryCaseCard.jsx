
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import MockPdfViewer from "@/components/MockPdfViewer";
import CaseCardHeader from "./CaseCardHeader";
import CaseInformationSection from "./CaseInformationSection";
import FactsSummarySection from "./FactsSummarySection";

const FactsSummaryCaseCard = ({ 
  document, 
  onSave, 
  onCancel, 
  onApproveAndNext,
  showApproveButton = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMockPdfViewer, setShowMockPdfViewer] = useState(false);
  const [originalData, setOriginalData] = useState({
    caseNo: document.summaryMetadata?.caseNo || document.basicMetadata?.caseNo || '',
    caseName: document.summaryMetadata?.caseName || document.basicMetadata?.caseName || '',
    facts: document.summaryMetadata?.facts || '',
    summary: document.summaryMetadata?.summary || ''
  });
  const [editedData, setEditedData] = useState({...originalData});

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const wasModified = JSON.stringify(originalData) !== JSON.stringify(editedData);
    onSave(document.id, editedData, wasModified);
    setOriginalData({...editedData});
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({...originalData});
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApprove = () => {
    if (onApproveAndNext) {
      onApproveAndNext();
    }
  };

  const handleViewPdf = () => {
    setShowMockPdfViewer(true);
  };

  // Generate a sample PDF URL for demonstration
  const pdfUrl = document.pdfUrl || `https://www.example.com/pdfs/${document.filename || document.id}.pdf`;

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto">
        <CaseCardHeader
          document={document}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onViewPdf={handleViewPdf}
          onApprove={handleApprove}
          showApproveButton={showApproveButton}
        />
        
        <CardContent className="space-y-6">
          <CaseInformationSection
            editedData={editedData}
            isEditing={isEditing}
            onFieldChange={handleFieldChange}
          />

          <FactsSummarySection
            editedData={editedData}
            isEditing={isEditing}
            onFieldChange={handleFieldChange}
          />
        </CardContent>
      </Card>

      {/* PDF Viewer */}
      {showMockPdfViewer && (
        <MockPdfViewer
          caseName={document.filename}
          pdfUrl={pdfUrl}
          onClose={() => setShowMockPdfViewer(false)}
        />
      )}
    </>
  );
};

export default FactsSummaryCaseCard;
