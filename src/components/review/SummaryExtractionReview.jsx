import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/ui/back-button";
import { flaskApi } from "@/services/flaskApi";
import { toast } from "@/hooks/use-toast";


const SummaryExtractionReview = ({
  document,
  onIndex,
  onBack
}) => {
  const [metadata, setMetadata] = useState({
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

  const handleInputChange = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCitationChange = (index, value) => {
    setMetadata(prev => {
      const newCitations = [...prev.citations];
      newCitations[index] = value;
      return { ...prev, citations: newCitations };
    });
  };

  const addCitation = () => {
    setMetadata(prev => ({
      ...prev,
      citations: [...prev.citations, '']
    }));
  };

  const removeCitation = (index) => {
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
    <div className="p-6 space-y-6">
      <BackButton onClick={onBack} />
      <Card>
        <CardHeader>
          <CardTitle>Review Summary and Facts for {document.filename}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facts">Facts</Label>
            <Textarea
              id="facts"
              value={metadata.facts}
              onChange={(e) => handleInputChange('facts', e.target.value)}
              rows={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={metadata.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={6}
            />
          </div>
          <div className="space-y-2">
            <Label>Citations</Label>
            {metadata.citations.map((citation, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={citation}
                  onChange={(e) => handleCitationChange(index, e.target.value)}
                  placeholder={`Citation ${index + 1}`}
                />
                {metadata.citations.length > 1 && (
                  <Button variant="destructive" size="sm" onClick={() => removeCitation(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addCitation} variant="outline" size="sm">
              Add Citation
            </Button>
          </div>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Index Document'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryExtractionReview;