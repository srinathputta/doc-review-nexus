
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import BackButton from "@/components/ui/back-button";
import { flaskApi } from "@/services/flaskApi";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Document } from "@/types";
import BasicExtractionReview from "@/components/review/BasicExtractionReview";
import SummaryExtractionReview from "@/components/review/SummaryExtractionReview";

const PendingExtractionSection: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [reviewStage, setReviewStage] = useState<'basic' | 'summary' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const batches = await flaskApi.getBatches();
      const allDocs = batches.flatMap(batch => batch.documents);
      const pendingDocs = allDocs.filter(doc => 
        ['basic_extracted', 'summary_extracted'].includes(doc.status)
      );
      setDocuments(pendingDocs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    }
  };

  const handleStartBasicReview = (document: Document) => {
    setSelectedDocument(document);
    setReviewStage('basic');
  };

  const handleStartSummaryReview = (document: Document) => {
    setSelectedDocument(document);
    setReviewStage('summary');
  };

  const handleBasicReviewComplete = async (documentId: string) => {
    try {
      await flaskApi.startSummaryExtraction(documentId);
      toast({
        title: "Success",
        description: "Summary extraction started"
      });
      setSelectedDocument(null);
      setReviewStage(null);
      loadDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start summary extraction",
        variant: "destructive"
      });
    }
  };

  const handleSummaryReviewComplete = () => {
    setSelectedDocument(null);
    setReviewStage(null);
    loadDocuments();
  };

  const handleBack = () => {
    setSelectedDocument(null);
    setReviewStage(null);
  };

  if (selectedDocument && reviewStage === 'basic') {
    return (
      <BasicExtractionReview
        document={selectedDocument}
        onContinue={handleBasicReviewComplete}
        onBack={handleBack}
      />
    );
  }

  if (selectedDocument && reviewStage === 'summary') {
    return (
      <SummaryExtractionReview
        document={selectedDocument}
        onIndex={handleSummaryReviewComplete}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate('/')} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pending Extraction Review</h1>
        <p className="text-gray-600 mt-2">
          Review and modify extracted metadata before proceeding to indexing.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.length > 0 ? (
              documents.map((document) => (
                <tr key={document.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{document.filename}</div>
                    <div className="text-sm text-gray-500">{document.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={document.status as any} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.basicMetadata?.caseName || 'Not extracted'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {document.status === 'basic_extracted' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-teal-700 hover:text-teal-800"
                        onClick={() => handleStartBasicReview(document)}
                      >
                        Review Basic Metadata
                      </Button>
                    )}
                    {document.status === 'summary_extracted' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-teal-700 hover:text-teal-800"
                        onClick={() => handleStartSummaryReview(document)}
                      >
                        Review Summary & Facts
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No documents pending review
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingExtractionSection;
