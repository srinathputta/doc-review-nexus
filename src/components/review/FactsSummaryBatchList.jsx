
import React from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table";

const FactsSummaryBatchList = ({ batches, onSelectBatch }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table className="min-w-full">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Batch Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Upload Date
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total PDFs
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sample Progress
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {batches.length > 0
            ? batches.map((batch) => (
                <TableRow key={batch.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.uploadDate}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.totalDocuments}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.status === 'summary_review_in_progress'
                      ? `${batch.samplesReviewed || 0}/10 samples reviewed`
                      : '0/10 samples reviewed'
                    }
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={batch.status} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-teal-700 hover:text-teal-800 border-teal-600 hover:bg-teal-50"
                      onClick={() => onSelectBatch(batch)}
                    >
                      {batch.status === 'summary_review_in_progress' ? 'Continue Review' : 'Start Sample Review'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : <TableRow>
                <TableCell colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No batches ready for facts & summary review
                </TableCell>
              </TableRow>
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default FactsSummaryBatchList;
