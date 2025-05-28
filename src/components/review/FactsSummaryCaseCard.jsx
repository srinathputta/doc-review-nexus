
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Eye, Check, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const FactsSummaryCaseCard = ({ 
  document, 
  onSave, 
  onCancel, 
  onMarkGood, 
  onMarkBad,
  onApproveAndNext,
  showMarkingButtons = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
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

  const handleMarkGood = () => {
    if (onMarkGood) onMarkGood();
  };

  const handleMarkBad = () => {
    if (onMarkBad) onMarkBad();
  };

  const handleApprove = () => {
    if (onApproveAndNext) {
      onApproveAndNext();
    }
  };

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
                <Button variant="outline" size="sm" onClick={() => setPdfModalOpen(true)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {!showMarkingButtons && (
                  <Button size="sm" onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4 mr-1" />
                    Approve & Next
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

          {showMarkingButtons && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Sample Review</h3>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={handleMarkBad}
                >
                  <AlertTriangle size={18} className="mr-2" />
                  Mark as Needs Correction
                </Button>
                <Button
                  onClick={handleMarkGood}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check size={18} className="mr-2" />
                  Mark as Good
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={pdfModalOpen} onOpenChange={setPdfModalOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Document Preview: {document.filename}</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-100 p-8 rounded-md h-[70vh] flex flex-col items-center justify-center">
            <div className="text-center max-w-2xl">
              <Eye size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">PDF Preview</h3>
              <p className="text-gray-600 mb-4">This is a mock preview of the document. In production, this would show the actual PDF content.</p>
              <div className="bg-white p-6 rounded border shadow-sm">
                <h4 className="font-bold text-lg mb-2">{editedData.caseName}</h4>
                <p className="text-sm text-gray-600 mb-2">Case No: {editedData.caseNo}</p>
                <div className="text-left">
                  <p className="font-semibold mb-1">Facts:</p>
                  <p className="text-sm text-gray-700 mb-3">{editedData.facts?.substring(0, 200)}...</p>
                  <p className="font-semibold mb-1">Summary:</p>
                  <p className="text-sm text-gray-700">{editedData.summary?.substring(0, 200)}...</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">File: {document.filename}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FactsSummaryCaseCard;
