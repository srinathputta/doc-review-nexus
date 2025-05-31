
import React, { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import MockPdfViewer from "@/components/MockPdfViewer";
import { getBasicExtractionBatchById } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const BatchDetailView = ({ batchId, onBack }) => {
  const [showMockPdfViewer, setShowMockPdfViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  const batch = getBasicExtractionBatchById(batchId);

  if (!batch) {
    return (
      <div className="p-6">
        <BackButton onClick={onBack} />
        <div className="text-center text-gray-500">Batch not found</div>
      </div>
    );
  }

  const handleViewPdf = (document) => {
    setSelectedDocument(document);
    setShowMockPdfViewer(true);
    toast({
      title: "Opening PDF viewer",
      description: `Viewing ${document.filename}`,
      className: "bg-blue-50 border-blue-200 text-blue-800"
    });
  };

  const handleSendToBasicReview = () => {
    toast({
      title: "Batch sent to Basic Review",
      description: `${batch.name} has been sent for basic details review`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  };

  return (
    <>
      <div className="p-6">
        <BackButton onClick={onBack} />
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Batch Details: {batch.name}</h1>
          <p className="text-gray-600 mt-2">
            View extraction progress for individual documents in this batch.
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <span><strong>Uploaded:</strong> {new Date(batch.uploadedAt).toLocaleString()}</span>
            <span><strong>By:</strong> {batch.uploadedBy}</span>
            <span><strong>Total Documents:</strong> {batch.totalDocuments}</span>
            <StatusBadge status={batch.status} />
          </div>
          
          {batch.status === 'basic_extracted' && (
            <div className="mt-4">
              <Button 
                onClick={handleSendToBasicReview}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Send to Basic Details Review
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case No
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
              {batch.documents?.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{document.filename}</div>
                    <div className="text-sm text-gray-500">{document.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {document.basicMetadata?.caseName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {document.basicMetadata?.caseNo || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={document.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewPdf(document)}
                      className="text-blue-600 hover:text-blue-800 border-blue-300 hover:bg-blue-50"
                    >
                      Show PDF
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

      {showMockPdfViewer && (
        <MockPdfViewer
          caseName={selectedDocument?.filename}
          pdfUrl={selectedDocument?.pdfUrl}
          onClose={() => setShowMockPdfViewer(false)}
        />
      )}
    </>
  );
};

export default BatchDetailView;
