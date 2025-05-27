
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/ui/back-button";
import { flaskApi } from "@/services/flaskApi";
import { toast } from "@/hooks/use-toast";
import { Document, SummaryMetadata } from "@/types";

interface SummaryExtractionReviewProps {
  document: Document;
  onIndex: (documentId: string, metadata: SummaryMetadata) => void;
  onBack: () => void;
}

const SummaryExtractionReview: React.FC<SummaryExtractionReviewProps> = ({
  document,
  onIndex,
  onBack
}) => {
  const [metadata, setMetadata] = useState<SummaryMetadata>({
    facts: '',
    summary: '',
    citations: ['']
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSummaryExtraction();
  }, [document.id]);

  const loadSummaryExtraction = async () => {
    try {
      const response = await flaskApi.getSummaryExtraction(document.id);
      setMetadata(response.summaryMetadata);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load summary extraction data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SummaryMetadata, value: string) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCitationChange = (index: number, value: string) => {
    setMetadata(prev => ({
      ...prev,
      citations: prev.citations.map((citation, i) => i === index ? value : citation)
    }));
  };

  const addCitation = () => {
    setMetadata(prev => ({
      ...prev,
      citations: [...prev.citations, '']
    }));
  };

  const removeCitation = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      citations: prev.citations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await flaskApi.submitSummaryReview(document.id, metadata);
      await flaskApi.indexDocument(document.id);
      toast({
        title: "Success",
        description: "Document indexed successfully"
      });
      onIndex(document.id, metadata);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to index document",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading summary extraction data...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <BackButton onClick={onBack} />
      
      <Card>
        <CardHeader>
          <CardTitle>Summary & Facts Review: {document.filename}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facts">Facts</Label>
            <Textarea
              id="facts"
              value={metadata.facts}
              onChange={(e) => handleInputChange('facts', e.target.value)}
              rows={6}
              placeholder="Enter the facts of the case..."
            />
          </div>
          
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={metadata.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={6}
              placeholder="Enter the case summary..."
            />
          </div>
          
          <div>
            <Label>Citations</Label>
            <div className="space-y-2">
              {metadata.citations.map((citation, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={citation}
                    onChange={(e) => handleCitationChange(index, e.target.value)}
                    placeholder={`Citation ${index + 1}`}
                  />
                  {metadata.citations.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCitation(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addCitation}>
                Add Citation
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-teal-700 hover:bg-teal-800"
            >
              {submitting ? "Indexing..." : "Index Document"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryExtractionReview;
