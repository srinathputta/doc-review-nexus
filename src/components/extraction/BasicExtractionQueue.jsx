import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import MockPdfViewer from "@/components/MockPdfViewer";
import { useNavigate } from "react-router-dom";

const BasicExtractionQueue = () => {
  const { documentsForExtraction } = useApp();
  const navigate = useNavigate();

  const [showMockPdfViewer, setShowMockPdfViewer] = useState(false);
  const [mockPdfCaseName, setMockPdfCaseName] = useState("");

  const handleViewMockPdf = (document) => {
    setMockPdfCaseName(document.filename); // Using filename as mock case name
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
            {documentsForExtraction.length > 0 ? (
              documentsForExtraction.map((document) => (
                <tr key={document.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{document.filename}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.uploadedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={document.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button size="sm" onClick={() => handleViewMockPdf(document)}>
                      View PDF
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No documents in the queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showMockPdfViewer && (
        <MockPdfViewer
          caseName={mockPdfCaseName}
          onClose={() => setShowMockPdfViewer(false)}
        />
      )}
    </div>
  );
};

export default BasicExtractionQueue;
