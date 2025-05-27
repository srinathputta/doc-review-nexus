
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMockDocumentsByBatchId } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

const BasicReviewSection = () => {
  const { currentBatch, setCurrentBatch } = useApp();
  const navigate = useNavigate();
  
  if (!currentBatch) {
    navigate('/review');
    return null;
  }
  
  const documents = getMockDocumentsByBatchId(currentBatch.id);
  
  const handleDocumentReview = (document) => {
    // Navigate to individual document review
    console.log('Reviewing document:', document.id);
  };
  
  const handleContinueToSummary = () => {
    // Move batch to summary review stage
    setCurrentBatch({
      ...currentBatch,
      status: 'pending_summary_review'
    });
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton onClick={() => setCurrentBatch(null)} />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Basic Details Review</h1>
        <p className="text-gray-600 mt-2">
          Review and verify basic metadata for all documents in batch: {currentBatch.name}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Case Name</TableHead>
              <TableHead>Court</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>
                  <div className="text-sm font-medium">{document.filename}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{document.basicMetadata?.caseName || 'N/A'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{document.basicMetadata?.court || 'N/A'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{document.basicMetadata?.date || 'N/A'}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={document.status} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDocumentReview(document)}
                    className="text-teal-700 hover:text-teal-800"
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleContinueToSummary}
          className="bg-teal-700 hover:bg-teal-800"
        >
          Continue to Summary Review
        </Button>
      </div>
    </div>
  );
};

export default BasicReviewSection;
