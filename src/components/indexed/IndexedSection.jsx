
import React, { useState } from "react";
import { getMockBatches, getMockDocumentsByBatchId } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/ui/back-button";
import MockPdfViewer from "@/components/MockPdfViewer";
import { Eye, Search, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const IndexedSection = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showMockPdfViewer, setShowMockPdfViewer] = useState(false);
  
  const indexedBatches = getMockBatches().filter(batch => batch.status === 'indexed');

  if (selectedBatch) {
    return <IndexedBatchDocuments batch={selectedBatch} onBack={() => setSelectedBatch(null)} />;
  }

  const filteredBatches = indexedBatches.filter(batch =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Indexed Batches</h1>
        <p className="text-gray-600 mt-2">
          Successfully processed and indexed legal document batches ready for search and retrieval.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
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
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.uploadDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.totalDocuments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status="indexed" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBatch(batch)}
                      className="text-teal-700 hover:text-teal-800"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Documents
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? 'No batches match your search criteria' : 'No indexed batches found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const IndexedBatchDocuments = ({ batch, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showMockPdfViewer, setShowMockPdfViewer] = useState(false);
  
  const documents = getMockDocumentsByBatchId(batch.id);
  
  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.basicMetadata?.caseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.basicMetadata?.caseNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setModalOpen(true);
    toast({
      title: "Document Details",
      description: `Viewing details for ${document.filename}`,
      className: "bg-teal-50 border-teal-200 text-teal-800"
    });
  };

  const handleViewPdf = (document) => {
    setSelectedDocument(document);
    setShowMockPdfViewer(true);
    toast({
      title: "Opening PDF viewer",
      description: `Viewing ${document.filename}`,
      className: "bg-blue-50 border-blue-200 text-blue-800"
    });
  };

  return (
    <>
      <div className="p-6">
        <BackButton onClick={onBack} />
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Indexed Documents - {batch.name}</h1>
          <div className="mt-2 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Batch ID:</span> {batch.id}
              </div>
              <div>
                <span className="font-medium">Upload Date:</span> {batch.uploadDate}
              </div>
              <div>
                <span className="font-medium">Total Documents:</span> {batch.totalDocuments}
              </div>
              <div>
                <span className="font-medium">Status:</span> <StatusBadge status="indexed" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Court
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((document) => (
                  <tr key={document.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{document.filename}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.basicMetadata?.caseNo || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.basicMetadata?.caseName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.basicMetadata?.court || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.basicMetadata?.date || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(document)}
                        className="text-teal-700 hover:text-teal-800"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPdf(document)}
                        className="text-blue-600 hover:text-blue-800 border-blue-300 hover:bg-blue-50"
                      >
                        Show PDF
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'No documents match your search criteria' : 'No documents found in this batch'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>Document Details: {selectedDocument?.filename}</DialogTitle>
            </DialogHeader>
            {selectedDocument && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Case No:</span> {selectedDocument.basicMetadata?.caseNo || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Case Type:</span> {selectedDocument.basicMetadata?.caseType || 'N/A'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Case Name:</span> {selectedDocument.basicMetadata?.caseName || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Court:</span> {selectedDocument.basicMetadata?.court || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {selectedDocument.basicMetadata?.date || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Petitioner:</span> {selectedDocument.basicMetadata?.petitioner || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Respondent:</span> {selectedDocument.basicMetadata?.respondent || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Verdict:</span> {selectedDocument.basicMetadata?.verdict || 'N/A'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Judges:</span> {selectedDocument.basicMetadata?.judges?.join(', ') || 'N/A'}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Facts & Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">Facts:</span>
                      <p className="mt-1 text-sm text-gray-700">{selectedDocument.summaryMetadata?.facts || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Summary:</span>
                      <p className="mt-1 text-sm text-gray-700">{selectedDocument.summaryMetadata?.summary || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Additional Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="font-medium">Citations:</span> {selectedDocument.basicMetadata?.citations?.join('; ') || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Advocates:</span> {selectedDocument.basicMetadata?.advocates?.join(', ') || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Acts/Sections:</span> {selectedDocument.basicMetadata?.actsSections?.join('; ') || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Cases Referred:</span> {selectedDocument.basicMetadata?.casesReferred?.join('; ') || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
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

export default IndexedSection;
