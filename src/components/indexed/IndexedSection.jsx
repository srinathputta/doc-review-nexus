
import React, { useState } from "react";
import { getIndexedDocuments } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const IndexedSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const indexedDocuments = getIndexedDocuments();
  
  const filteredDocuments = indexedDocuments.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.basicMetadata?.caseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.basicMetadata?.caseNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Indexed Documents</h1>
        <p className="text-gray-600 mt-2">
          Successfully processed and indexed legal documents ready for search and retrieval.
        </p>
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
                Status
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
                    <div className="text-sm text-gray-500">Batch: {document.batchId}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status="indexed" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(document)}
                      className="text-teal-700 hover:text-teal-800"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? 'No documents match your search criteria' : 'No indexed documents found'}
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
  );
};

export default IndexedSection;
