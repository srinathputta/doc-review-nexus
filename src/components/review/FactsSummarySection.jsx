
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const FactsSummarySection = ({ editedData, isEditing, onFieldChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Facts & Summary</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="facts">Facts</Label>
          {isEditing ? (
            <Textarea
              id="facts"
              value={editedData.facts}
              onChange={(e) => onFieldChange('facts', e.target.value)}
              className="mt-1"
              rows={6}
            />
          ) : (
            <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[150px] whitespace-pre-wrap">
              {editedData.facts || 'N/A'}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="summary">Summary</Label>
          {isEditing ? (
            <Textarea
              id="summary"
              value={editedData.summary}
              onChange={(e) => onFieldChange('summary', e.target.value)}
              className="mt-1"
              rows={6}
            />
          ) : (
            <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[150px] whitespace-pre-wrap">
              {editedData.summary || 'N/A'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FactsSummarySection;
