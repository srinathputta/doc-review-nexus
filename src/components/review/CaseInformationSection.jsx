
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CaseInformationSection = ({ editedData, isEditing, onFieldChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Case Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="caseNo">Case No.</Label>
          {isEditing ? (
            <Input
              id="caseNo"
              value={editedData.caseNo}
              onChange={(e) => onFieldChange('caseNo', e.target.value)}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.caseNo || 'N/A'}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="caseName">Case Name</Label>
          {isEditing ? (
            <Input
              id="caseName"
              value={editedData.caseName}
              onChange={(e) => onFieldChange('caseName', e.target.value)}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 p-2 bg-gray-50 rounded border">{editedData.caseName || 'N/A'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseInformationSection;
