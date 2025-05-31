
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { useApp } from "@/contexts/AppContext";
import { toast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/status-badge";

const UploadSection = () => {
  const { uploadBatch, batches, extractionBatches } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  
  const onDrop = useCallback(
    (acceptedFiles) => {
      setIsDragging(false);
      if (acceptedFiles.length > 1) {
        toast({
          title: "Too many files",
          description: "Please upload only one file at a time (either a single PDF or a single ZIP).",
          variant: "destructive"
        });
        return;
      }

      if (acceptedFiles.length === 0) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or ZIP file.",
          variant: "destructive"
        });
        return;
      }
      
      const file = acceptedFiles[0];
      
      // Process the file
      uploadBatch([file]);
    },
    [uploadBatch]
  );
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    maxFiles: 1,
  });

  // Combine all batches for display
  const allBatches = [...batches, ...extractionBatches];
  
  return (
    <div className="p-6">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
        <p className="text-gray-600 mt-2">
          Upload individual PDF documents or a ZIP file containing multiple PDFs.
        </p>
      </div>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:bg-gray-50"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
            <Upload className="text-teal-700" size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Drag & drop PDF or ZIP files</h3>
          <p className="text-sm text-gray-500 mb-4">
            Or click to select a file from your computer
          </p>
          <Button variant="outline">Select file</Button>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-lg font-medium mb-4">Recent Batches</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Name/ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  # PDFs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allBatches.slice(0, 5).map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                    <div className="text-sm text-gray-500">{batch.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.uploadDate || new Date(batch.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.totalDocuments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={batch.status} />
                  </td>
                </tr>
              ))}
              {allBatches.length === 0 && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={4}>
                    No recent batches
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
