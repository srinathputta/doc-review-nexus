
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/ui/back-button";
import { flaskApi } from "@/services/flaskApi";
import { toast } from "@/hooks/use-toast";
import { Document, BasicMetadata } from "@/types";

interface BasicExtractionReviewProps {
  document: Document;
  onContinue: (documentId: string, metadata: BasicMetadata) => void;
  onBack: () => void;
}

const BasicExtractionReview: React.FC<BasicExtractionReviewProps> = ({
  document,
  onContinue,
  onBack
}) => {
  const [metadata, setMetadata] = useState<BasicMetadata>({
    caseNo: '',
    caseName: '',
    court: '',
    date: '',
    judges: [''],
    petitioner: '',
    appellant: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBasicExtraction();
  }, [document.id]);

  const loadBasicExtraction = async () => {
    try {
      const response = await flaskApi.getBasicExtraction(document.id);
      setMetadata(response.basicMetadata);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load basic extraction data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BasicMetadata, value: string) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJudgeChange = (index: number, value: string) => {
    setMetadata(prev => ({
      ...prev,
      judges: prev.judges.map((judge, i) => i === index ? value : judge)
    }));
  };

  const addJudge = () => {
    setMetadata(prev => ({
      ...prev,
      judges: [...prev.judges, '']
    }));
  };

  const removeJudge = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      judges: prev.judges.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await flaskApi.submitBasicReview(document.id, metadata);
      toast({
        title: "Success",
        description: "Basic metadata reviewed successfully"
      });
      onContinue(document.id, metadata);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading extraction data...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <BackButton onClick={onBack} />
      
      <Card>
        <CardHeader>
          <CardTitle>Basic Metadata Review: {document.filename}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="caseNo">Case Number</Label>
              <Input
                id="caseNo"
                value={metadata.caseNo}
                onChange={(e) => handleInputChange('caseNo', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="caseName">Case Name</Label>
              <Input
                id="caseName"
                value={metadata.caseName}
                onChange={(e) => handleInputChange('caseName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="court">Court</Label>
              <Input
                id="court"
                value={metadata.court}
                onChange={(e) => handleInputChange('court', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={metadata.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="petitioner">Petitioner</Label>
              <Input
                id="petitioner"
                value={metadata.petitioner}
                onChange={(e) => handleInputChange('petitioner', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="appellant">Appellant</Label>
              <Input
                id="appellant"
                value={metadata.appellant}
                onChange={(e) => handleInputChange('appellant', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label>Judges</Label>
            <div className="space-y-2">
              {metadata.judges.map((judge, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={judge}
                    onChange={(e) => handleJudgeChange(index, e.target.value)}
                    placeholder={`Judge ${index + 1}`}
                  />
                  {metadata.judges.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeJudge(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addJudge}>
                Add Judge
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-teal-700 hover:bg-teal-800"
            >
              {submitting ? "Submitting..." : "Continue to Summary Extraction"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicExtractionReview;
