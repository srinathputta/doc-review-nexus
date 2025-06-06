import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Eye, Check, ChevronRight } from "lucide-react";
import MockPdfViewer from "@/components/MockPdfViewer";

const BasicCaseCard = ({ document, onSave, onCancel, onApproveAndNext, showApproveButton = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMockPdfViewer, setShowMockPdfViewer] = useState(false);
  const [originalData, setOriginalData] = useState({
    caseNo: document.basicMetadata?.caseNo || '',
    caseName: document.basicMetadata?.caseName || '',
    court: document.basicMetadata?.court || '',
    caseType: document.basicMetadata?.caseType || '',
    date: document.basicMetadata?.date || '',
    judges: document.basicMetadata?.judges || [],
    citations: document.basicMetadata?.citations || [],
    petitioner: document.basicMetadata?.petitioner || '',
    respondent: document.basicMetadata?.respondent || '',
    advocates: document.basicMetadata?.advocates || [],
    actsSections: document.basicMetadata?.actsSections || [],
    casesReferred: document.basicMetadata?.casesReferred || [],
    verdict: document.basicMetadata?.verdict || ''
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

  const handleArrayFieldChange = (field, index, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleApproveAndContinue = () => {
    if (onApproveAndNext) {
      onApproveAndNext();
    }
  };

  const handleViewPdf = () => {
    setShowMockPdfViewer(true);
  };

  const getReviewStatusBadge = () => {
    if (document.reviewStatus === 'reviewed_with_modifications') {
      return <Badge variant="default" className="bg-orange-100 text-orange-800">Reviewed (Edited Manually)</Badge>;
    } else if (document.reviewStatus === 'reviewed_no_changes') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Reviewed (AI Output)</Badge>;
    } else {
      return <Badge variant="outline">Pending Review</Badge>;
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
              {getReviewStatusBadge()}
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
                  <Button size="sm" onClick={handleApproveAndContinue} className="bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4 mr-1" />
                    Approve & Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
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
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Label htmlFor="court">Court Name</Label>
                {isEditing ? (
                  <Input
                    id="court"
                    value={editedData.court}
                    onChange={(e) => handleFieldChange('court', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.court || 'N/A'}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="caseType">Case Type</Label>
                {isEditing ? (
                  <Input
                    id="caseType"
                    value={editedData.caseType}
                    onChange={(e) => handleFieldChange('caseType', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.caseType || 'N/A'}</p>
                )}
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
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
              
              <div>
                <Label htmlFor="date">Date</Label>
                {isEditing ? (
                  <Input
                    id="date"
                    type="date"
                    value={editedData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.date || 'N/A'}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="petitioner">Petitioner</Label>
                {isEditing ? (
                  <Input
                    id="petitioner"
                    value={editedData.petitioner}
                    onChange={(e) => handleFieldChange('petitioner', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.petitioner || 'N/A'}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="respondent">Respondent</Label>
                {isEditing ? (
                  <Input
                    id="respondent"
                    value={editedData.respondent}
                    onChange={(e) => handleFieldChange('respondent', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.respondent || 'N/A'}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="verdict">Verdict</Label>
                {isEditing ? (
                  <Input
                    id="verdict"
                    value={editedData.verdict}
                    onChange={(e) => handleFieldChange('verdict', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.verdict || 'N/A'}</p>
                )}
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
                <Label>Judges</Label>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    {editedData.judges.map((judge, index) => (
                      <Input
                        key={index}
                        value={judge}
                        onChange={(e) => handleArrayFieldChange('judges', index, e.target.value)}
                        placeholder={`Judge ${index + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {editedData.judges.length > 0 ? editedData.judges.join(', ') : 'N/A'}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
                <Label>Citations</Label>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    {editedData.citations.map((citation, index) => (
                      <Input
                        key={index}
                        value={citation}
                        onChange={(e) => handleArrayFieldChange('citations', index, e.target.value)}
                        placeholder={`Citation ${index + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {editedData.citations.length > 0 ? editedData.citations.join('; ') : 'N/A'}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
                <Label>Advocates</Label>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    {editedData.advocates.map((advocate, index) => (
                      <Input
                        key={index}
                        value={advocate}
                        onChange={(e) => handleArrayFieldChange('advocates', index, e.target.value)}
                        placeholder={`Advocate ${index + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {editedData.advocates.length > 0 ? editedData.advocates.join(', ') : 'N/A'}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
                <Label>Acts/Sections</Label>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    {editedData.actsSections.map((actSection, index) => (
                      <Input
                        key={index}
                        value={actSection}
                        onChange={(e) => handleArrayFieldChange('actsSections', index, e.target.value)}
                        placeholder={`Act/Section ${index + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {editedData.actsSections.length > 0 ? editedData.actsSections.join('; ') : 'N/A'}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
                <Label>Cases Referred</Label>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    {editedData.casesReferred.map((caseRef, index) => (
                      <Input
                        key={index}
                        value={caseRef}
                        onChange={(e) => handleArrayFieldChange('casesReferred', index, e.target.value)}
                        placeholder={`Case Reference ${index + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {editedData.casesReferred.length > 0 ? editedData.casesReferred.join('; ') : 'N/A'}
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
          onClose={() => setShowMockPdfViewer(false)}
        />
      )}
    </>
  );
};

export default BasicCaseCard;
