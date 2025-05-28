
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Eye } from "lucide-react";

const EditableCaseCard = ({ document, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    caseName: document.basicMetadata?.caseName || '',
    court: document.basicMetadata?.court || '',
    date: document.basicMetadata?.date || '',
    petitioner: document.basicMetadata?.petitioner || '',
    appellant: document.basicMetadata?.appellant || '',
    judges: document.basicMetadata?.judges || [],
    facts: document.summaryMetadata?.facts || '',
    summary: document.summaryMetadata?.summary || '',
    citations: document.summaryMetadata?.citations || []
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(document.id, editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({
      caseName: document.basicMetadata?.caseName || '',
      court: document.basicMetadata?.court || '',
      date: document.basicMetadata?.date || '',
      petitioner: document.basicMetadata?.petitioner || '',
      appellant: document.basicMetadata?.appellant || '',
      judges: document.basicMetadata?.judges || [],
      facts: document.summaryMetadata?.facts || '',
      summary: document.summaryMetadata?.summary || '',
      citations: document.summaryMetadata?.citations || []
    });
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{document.filename}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{document.status}</Badge>
            <span className="text-sm text-gray-500">ID: {document.id}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
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
        {/* Basic Metadata Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div>
              <Label htmlFor="court">Court</Label>
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
            
            <div className="md:col-span-2">
              <Label htmlFor="appellant">Appellant/Respondent</Label>
              {isEditing ? (
                <Input
                  id="appellant"
                  value={editedData.appellant}
                  onChange={(e) => handleFieldChange('appellant', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.appellant || 'N/A'}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
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
          </div>
        </div>

        {/* Summary Metadata Section */}
        {(document.summaryMetadata || isEditing) && (
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
                    rows={4}
                  />
                ) : (
                  <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[100px]">
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
                    rows={4}
                  />
                ) : (
                  <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[100px]">
                    {editedData.summary || 'N/A'}
                  </div>
                )}
              </div>
              
              <div>
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableCaseCard;
