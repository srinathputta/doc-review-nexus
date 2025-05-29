import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import SampleReviewInterface from './SampleReviewInterface';

const BatchReviewSection = () => {
  const { currentBatch, setCurrentBatch, batches, setBatches } = useApp();
  const [showSampleReview, setShowSampleReview] = useState(false);

  const handleStartReview = () => {
    // Logic to start the review process
    console.log("Starting review for batch:", currentBatch);
    // Placeholder for starting review
  };

  const handleSendToNext = () => {
    // Logic to send the batch to the next stage
    console.log("Sending batch to next stage:", currentBatch);
    // Placeholder for sending to next stage
  };

  const handleCancel = () => {
    setCurrentBatch(null);
  };

  if (showSampleReview) {
    return <SampleReviewInterface onBack={() => setShowSampleReview(false)} />;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Batch Review: {currentBatch?.name}</h2>
      <div className="mb-4">
        <StatusBadge status={currentBatch?.status || 'pending'} />
      </div>
      <div className="mb-4">
        <p>Batch ID: {currentBatch?.id}</p>
        <p>Total Documents: {currentBatch?.totalDocuments}</p>
        <p>Documents Reviewed: {currentBatch?.documentsReviewed || 0}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBatch?.documents?.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.filename}</TableCell>
              <TableCell><StatusBadge status={doc.status || 'pending'} /></TableCell>
              <TableCell>
                <Button variant="outline" size="sm">Review</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={handleCancel} variant="ghost">
          Cancel
        </Button>
        <Button onClick={handleStartReview} variant="outline">
          Start Review
        </Button>
        <Button onClick={handleSendToNext}>
          Send to Next Stage
        </Button>
      </div>
    </div>
  );
};

export default BatchReviewSection;
