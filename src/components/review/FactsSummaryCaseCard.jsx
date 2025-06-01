
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import MockPdfViewer from "@/components/MockPdfViewer";
import CaseCardHeader from "./CaseCardHeader";
import CaseInformationSection from "./CaseInformationSection";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

          {/* Merged FactsSummarySection JSX */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Facts & Summary</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="facts">Facts</Label>
                {isEditing ? (
                  <Textarea
                    id="facts"
                    value={editedData.facts}
                    onChange={(e) => handleFieldChange('facts', e.target.value)}
                    className="mt-1"
                    rows={6}
                  />
                ) : (
                  <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[150px] whitespace-pre-wrap">
                    {editedData.facts || 'N/A'}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                {isEditing ? (
                  <Textarea
                    id="summary"
                    value={editedData.summary}
                    onChange={(e) => handleFieldChange('summary', e.target.value)}
                    className="mt-1"
                    rows={6}
                  />
                ) : (
                  <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[150px] whitespace-pre-wrap">
                    {editedData.summary || 'N/A'}
                  </div>
                )}
              </div>
            </div>
          </div>
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
