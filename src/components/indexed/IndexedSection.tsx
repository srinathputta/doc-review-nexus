
import React, { useState } from "react";
import { getIndexedDocuments } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, File, ExternalLink } from "lucide-react";
import { Document } from "@/types";

const IndexedSection: React.FC = () => {
  const indexedDocuments = getIndexedDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  
  // Filter documents based on search query
  const filteredDocuments = indexedDocuments.filter(doc => {
    const query = searchQuery.toLowerCase();
    return (
      doc.filename.toLowerCase().includes(query) ||
      doc.metadata.caseName.toLowerCase().includes(query) ||
      doc.metadata.court.toLowerCase().includes(query) ||
      doc.metadata.petitioner.toLowerCase().includes(query) ||
      doc.metadata.respondent.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Indexed Documents</h1>
        <p className="text-gray-600 mt-2">
          Browse and search all successfully indexed documents.
        </p>
      </div>
      
      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by case name, court, or parties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500">
        {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
      </div>
      
      {/* Documents table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document Title
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
                <DocumentRow
                  key={document.id}
                  document={document}
                  onView={() => setViewDocument(document)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No indexed documents match your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Document view modal */}
      <Dialog open={!!viewDocument} onOpenChange={(open) => !open && setViewDocument(null)}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          {viewDocument && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Filename</h3>
                  <p>{viewDocument.filename}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Case Name</h3>
                  <p>{viewDocument.metadata.caseName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Court</h3>
                  <p>{viewDocument.metadata.court}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p>{viewDocument.metadata.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Petitioner</h3>
                  <p>{viewDocument.metadata.petitioner}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Respondent</h3>
                  <p>{viewDocument.metadata.respondent}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Judges</h3>
                  <ul className="list-disc pl-5">
                    {viewDocument.metadata.judges.map((judge, i) => (
                      <li key={i}>{judge}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Citations</h3>
                  <ul className="list-disc pl-5">
                    {viewDocument.metadata.citations.map((citation, i) => (
                      <li key={i}>{citation}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Facts</h3>
                  <p className="text-sm">{viewDocument.metadata.facts}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Summary</h3>
                  <p className="text-sm">{viewDocument.metadata.summary}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <File size={16} className="mr-2" />
                  View Full Document
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Document row component
const DocumentRow: React.FC<{
  document: Document;
  onView: () => void;
}> = ({ document, onView }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <File size={16} className="mr-2 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{document.filename}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {document.metadata.caseName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {document.metadata.court}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {document.metadata.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          className="text-teal-700 hover:text-teal-900 mr-4"
          onClick={onView}
        >
          View Details
        </button>
        <a
          href="#view-document"
          className="text-teal-700 hover:text-teal-900 inline-flex items-center"
          onClick={(e) => e.preventDefault()}
        >
          Full Document <ExternalLink size={14} className="ml-1" />
        </a>
      </td>
    </tr>
  );
};

export default IndexedSection;
