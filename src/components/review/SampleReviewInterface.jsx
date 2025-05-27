
import React, { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BackButton from "@/components/ui/back-button";
import { ArrowLeft, ArrowRight, File, Check, X } from "lucide-react";
import { getMockSamplesByBatchId } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SampleReviewInterface = () => {
  const { 
    currentBatch,
    setCurrentBatch,
    currentSample,
    setCurrentSample,
    currentSampleIndex,
    setCurrentSampleIndex,
    markSample,
    completeBatchReview
  } = useApp();
  
  const [samples, setSamples] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  
  useEffect(() => {
    if (currentBatch) {
      const batchSamples = getMockSamplesByBatchId(currentBatch.id);
      setSamples(batchSamples);
      
      if (batchSamples.length > 0) {
        const sample = batchSamples[currentSampleIndex];
        setCurrentSample(sample);
        if (sample.basicMetadata && sample.summaryMetadata) {
          setMetadata({
            caseName: sample.basicMetadata.caseName,
            court: sample.basicMetadata.court,
            date: sample.basicMetadata.date,
            judges: sample.basicMetadata.judges,
            petitioner: sample.basicMetadata.petitioner,
            respondent: sample.basicMetadata.appellant,
            facts: sample.summaryMetadata.facts,
            summary: sample.summaryMetadata.summary,
            citations: sample.summaryMetadata.citations
          });
        }
      }
    }
  }, [currentBatch, currentSampleIndex, setCurrentSample]);
  
  useEffect(() => {
    if (currentSample && currentSample.basicMetadata && currentSample.summaryMetadata) {
      setMetadata({
        caseName: currentSample.basicMetadata.caseName,
        court: currentSample.basicMetadata.court,
        date: currentSample.basicMetadata.date,
        judges: currentSample.basicMetadata.judges,
        petitioner: currentSample.basicMetadata.petitioner,
        respondent: currentSample.basicMetadata.appellant,
        facts: currentSample.summaryMetadata.facts,
        summary: currentSample.summaryMetadata.summary,
        citations: currentSample.summaryMetadata.citations
      });
    }
  }, [currentSample]);
  
  const handlePrevious = () => {
    if (currentSampleIndex > 0) {
      setCurrentSampleIndex(currentSampleIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentSampleIndex < samples.length - 1) {
      setCurrentSampleIndex(currentSampleIndex + 1);
    }
  };
  
  const handleMetadataChange = (key, value) => {
    if (metadata) {
      setMetadata({
        ...metadata,
        [key]: value
      });
    }
  };
  
  const handleJudgeChange = (index, value) => {
    if (metadata) {
      const newJudges = [...metadata.judges];
      newJudges[index] = value;
      handleMetadataChange('judges', newJudges);
    }
  };
  
  const handleCitationChange = (index, value) => {
    if (metadata) {
      const newCitations = [...metadata.citations];
      newCitations[index] = value;
      handleMetadataChange('citations', newCitations);
    }
  };
  
  const handleMarkSample = (isGood) => {
    if (currentBatch && currentSample) {
      markSample(currentBatch.id, currentSample.id, isGood);
      
      if (currentSampleIndex < samples.length - 1) {
        setCurrentSampleIndex(currentSampleIndex + 1);
      } else if ((currentBatch.samplesReviewed || 0) + 1 >= 10) {
        completeBatchReview(currentBatch.id);
      }
    }
  };
  
  const handleBackToBatchList = () => {
    setCurrentSample(null);
    setCurrentSampleIndex(0);
  };
  
  if (!currentBatch || !currentSample || !metadata) {
    return <div className="p-6">Loading sample data...</div>;
  }
  
  const allSamplesReviewed = ((currentBatch.samplesReviewed || 0) >= 10);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton onClick={handleBackToBatchList} />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Summary & Facts Review</h1>
          <p className="text-gray-600">
            Reviewing 10 samples from batch: {currentBatch.name}
          </p>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">
            {currentBatch.samplesReviewed || 0} / 10 reviewed, 
            {currentBatch.samplesGood || 0} good
          </span>
          {allSamplesReviewed && (
            <Button
              variant="default"
              className="bg-teal-700 hover:bg-teal-800"
              onClick={() => completeBatchReview(currentBatch.id)}
            >
              {(currentBatch.samplesGood || 0) > 5 ? "Move to Indexing" : "Send to Manual Intervention"}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Sample Documents</h3>
          </div>
          <div className="p-2">
            <ul>
              {samples.map((sample, index) => (
                <li 
                  key={sample.id}
                  className={`p-2 rounded cursor-pointer text-sm ${
                    currentSampleIndex === index 
                      ? "bg-teal-100 text-teal-700" 
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentSampleIndex(index)}
                >
                  <div className="flex items-center">
                    <File size={16} className="mr-2" />
                    <span className="truncate">{sample.filename}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentSampleIndex === 0}
              >
                <ArrowLeft size={16} className="mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm" 
                onClick={handleNext}
                disabled={currentSampleIndex === samples.length - 1}
              >
                Next <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Reviewing Sample: {currentSample.filename}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPdfModalOpen(true)}
                >
                  View Full PDF
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="caseName">Case Name</Label>
                  <Input
                    id="caseName"
                    value={metadata.caseName}
                    onChange={(e) => handleMetadataChange('caseName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="court">Court</Label>
                  <Input
                    id="court"
                    value={metadata.court}
                    onChange={(e) => handleMetadataChange('court', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={metadata.date}
                    onChange={(e) => handleMetadataChange('date', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Judges</Label>
                  <div className="space-y-2 mt-1">
                    {metadata.judges.map((judge, index) => (
                      <Input
                        key={index}
                        value={judge}
                        onChange={(e) => handleJudgeChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="petitioner">Petitioner</Label>
                  <Input
                    id="petitioner"
                    value={metadata.petitioner}
                    onChange={(e) => handleMetadataChange('petitioner', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="respondent">Respondent</Label>
                  <Input
                    id="respondent"
                    value={metadata.respondent}
                    onChange={(e) => handleMetadataChange('respondent', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label>Citations</Label>
                  <div className="space-y-2 mt-1">
                    {metadata.citations.map((citation, index) => (
                      <Input
                        key={index}
                        value={citation}
                        onChange={(e) => handleCitationChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="facts">Facts</Label>
                  <Textarea
                    id="facts"
                    value={metadata.facts}
                    onChange={(e) => handleMetadataChange('facts', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={metadata.summary}
                    onChange={(e) => handleMetadataChange('summary', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="mt-8 border-t pt-4 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleMarkSample(false)}
                >
                  <X size={18} className="mr-2" />
                  Mark as Needs Correction
                </Button>
                <Button
                  onClick={() => handleMarkSample(true)}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  <Check size={18} className="mr-2" />
                  Mark as Good
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={pdfModalOpen} onOpenChange={setPdfModalOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Document Preview: {currentSample.filename}</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-100 p-4 rounded-md h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <File size={64} className="mx-auto mb-4 text-gray-400" />
              <p>PDF preview would be displayed here</p>
              <p className="text-sm text-gray-500 mt-2">Sample file: {currentSample.filename}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleReviewInterface;
