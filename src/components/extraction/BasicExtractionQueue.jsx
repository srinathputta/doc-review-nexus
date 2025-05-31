
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import MockPdfViewer from "@/components/MockPdfViewer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const BasicExtractionQueue = () => {
  const { extractionBatches } = useApp();
  const navigate = useNavigate();

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showMockPdfViewer, setShowMockPdfViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleViewProgress = (batch) => {
    setSelectedBatch(batch);
    setShowProgressDialog(true);
  };

  const handleViewPdf = (document) => {
    setSelectedDocument(document);
    setShowMockPdfViewer(true);
  };

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate("/upload")} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Basic Extraction Queue</h1>
        <p className="text-gray-600 mt-2">
          Batches waiting for or undergoing basic metadata extraction.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {extractionBatches.length > 0 ? (
              extractionBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                    <div className="text-sm text-gray-500">{batch.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(batch.uploadedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.totalDocuments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button size="sm" onClick={() => handleViewProgress(batch)}>
                      View Progress
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No batches in the queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Batch Progress: {selectedBatch?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      View PDF
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedBatch?.documents?.map((document) => (
                    <tr key={document.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{document.filename}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(document.uploadedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {document.uploadedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={document.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button size="sm" onClick={() => handleViewPdf(document)}>
                          View PDF
                        </Button>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No documents in this batch.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer */}
      {showMockPdfViewer && (
        <MockPdfViewer
          caseName={selectedDocument?.filename}
          onClose={() => setShowMockPdfViewer(false)}
        />
      )}
    </div>
  );
};

export default BasicExtractionQueue;
