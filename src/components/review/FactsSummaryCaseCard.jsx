
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Eye, Check } from "lucide-react";
import MockPdfViewer from "@/components/MockPdfViewer";

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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{document.filename}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{document.status}</Badge>
              {document.reviewStatus && (
                <Badge variant={document.reviewStatus === 'reviewed_with_modifications' ? 'default' : 'secondary'}>
                  {document.reviewStatus === 'reviewed_with_modifications' ? 'Modified' : 'No Changes'}
                </Badge>
              )}
              <span className="text-sm text-gray-500">ID: {document.id}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleViewPdf}>
                  <Eye className="w-4 h-4 mr-1" />
                  View PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {showApproveButton && (
                  <Button size="sm" onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4 mr-1" />
                    Approve & Continue
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-teal-700 hover:bg-teal-800">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Case Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="caseNo">Case No.</Label>
                {isEditing ? (
                  <Input
                    id="caseNo"
                    value={editedData.caseNo}
                    onChange={(e) => handleFieldChange('caseNo', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.caseNo || 'N/A'}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="caseName">Case Name</Label>
                {isEditing ? (
                  <Input
                    id="caseName"
                    value={editedData.caseName}
                    onChange={(e) => handleFieldChange('caseName', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.caseName || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

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
