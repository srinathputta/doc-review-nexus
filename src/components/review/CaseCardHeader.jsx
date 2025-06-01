
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Eye, Check } from "lucide-react";

const CaseCardHeader = ({ 
  document, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onViewPdf, 
  onApprove, 
  showApproveButton 
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-xl">{document.filename}</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{document.status}</Badge>
          {document.reviewStatus && (
            <Badge variant={document.reviewStatus === 'reviewed_with_modifications' ? 'default' : 'secondary'}>
              {document.reviewStatus === 'reviewed_with_modifications' ? 'Modified' : 'No Changes'}
            </Badge>
          )}
          <span className="text-sm text-gray-500">ID: {document.id}</span>
        </div>
      </div>
      <div className="flex gap-2">
        {!isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={onViewPdf}>
              <Eye className="w-4 h-4 mr-1" />
              View PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            {showApproveButton && (
              <Button size="sm" onClick={onApprove} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-1" />
                Approve & Continue
              </Button>
            )}
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={onSave} className="bg-teal-700 hover:bg-teal-800">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </>
        )}
      </div>
    </CardHeader>
  );
};

export default CaseCardHeader;
