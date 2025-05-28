
import { cn } from "@/lib/utils";

const statusStyles = {
  uploading: "bg-blue-100 text-blue-800",
  uploaded_to_s3: "bg-blue-100 text-blue-800",
  pending_basic_extraction: "bg-yellow-100 text-yellow-800",
  basic_extraction_in_progress: "bg-yellow-100 text-yellow-800",
  pending_basic_review: "bg-purple-100 text-purple-800",
  basic_review_in_progress: "bg-purple-100 text-purple-800",
  pending_summary_extraction: "bg-orange-100 text-orange-800",
  summary_extraction_in_progress: "bg-orange-100 text-orange-800",
  pending_summary_review: "bg-purple-100 text-purple-800",
  summary_review_in_progress: "bg-purple-100 text-purple-800",
  ready_for_indexing: "bg-green-100 text-green-800",
  indexing_in_progress: "bg-green-100 text-green-800",
  indexed: "bg-teal-100 text-teal-800",
  error: "bg-red-100 text-red-800",
  manual_intervention: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-800",
  reviewed_no_changes: "bg-green-100 text-green-800",
  reviewed_with_modifications: "bg-orange-100 text-orange-800",
};

const statusLabels = {
  uploading: "Uploading",
  uploaded_to_s3: "Uploaded to S3",
  pending_basic_extraction: "Pending Basic Extraction",
  basic_extraction_in_progress: "Extracting Basic Data",
  pending_basic_review: "Pending Basic Review",
  basic_review_in_progress: "Basic Review in Progress",
  pending_summary_extraction: "Pending Summary Extraction",
  summary_extraction_in_progress: "Extracting Summary",
  pending_summary_review: "Pending Summary Review",
  summary_review_in_progress: "Summary Review in Progress",
  ready_for_indexing: "Ready for Indexing",
  indexing_in_progress: "Indexing",
  indexed: "Indexed",
  error: "Error",
  manual_intervention: "Error",
  pending: "Pending Review",
  reviewed_no_changes: "Reviewed (AI Output)",
  reviewed_with_modifications: "Reviewed (Edited Manually)",
};

export const StatusBadge = ({ status, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusStyles[status] || "bg-gray-100 text-gray-800",
        className
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
};
