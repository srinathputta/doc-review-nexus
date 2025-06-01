
import React from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table";

const SampleDocumentsList = ({ 
  sampleDocuments, 
  selectedSampleIndex, 
  onSelectSample, 
  allSamplesReviewed 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table className="min-w-full">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sample Document ID/Filename
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Case Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Case No
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Facts Available
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Review Status
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {sampleDocuments.length > 0
            ? sampleDocuments.map((sample, index) => (
                <TableRow key={sample.id} className={selectedSampleIndex === index ? "bg-teal-50" : "hover:bg-gray-50"}>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sample.filename || sample.id}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {sample.basicMetadata?.caseName || 'N/A'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {sample.basicMetadata?.caseNo || 'N/A'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {sample.summaryMetadata?.facts ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={sample.reviewStatus || 'pending_sample_review'} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectSample(index)}
                      className="text-teal-700 hover:text-teal-800 border-teal-600 hover:bg-teal-50"
                      disabled={allSamplesReviewed && sample.reviewStatus !== 'pending_sample_review'}
                    >
                      {sample.reviewStatus && sample.reviewStatus !== 'pending_sample_review' ? 'View/Edit' : 'Review'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : <TableRow>
                <TableCell colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No samples found for this batch.
                </TableCell>
              </TableRow>
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default SampleDocumentsList;
