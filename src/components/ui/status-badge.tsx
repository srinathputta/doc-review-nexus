
import { cn } from "@/lib/utils";
import { BatchStatus } from "@/types";

interface StatusBadgeProps {
  status: BatchStatus;
  className?: string;
}

const statusStyles = {
  uploading: "bg-blue-100 text-blue-800",
  unpacking: "bg-blue-100 text-blue-800",
  queued: "bg-yellow-100 text-yellow-800",
  extracting: "bg-yellow-100 text-yellow-800",
  extracted: "bg-green-100 text-green-800",
  review_ready: "bg-purple-100 text-purple-800",
  review_in_progress: "bg-purple-100 text-purple-800",
  indexed: "bg-teal-100 text-teal-800",
  manual_intervention: "bg-red-100 text-red-800",
  error: "bg-red-100 text-red-800",
};

const statusLabels: Record<BatchStatus, string> = {
  uploading: "Uploading",
  unpacking: "Unpacking",
  queued: "Queued",
  extracting: "Extracting",
  extracted: "Extracted",
  review_ready: "Ready for Review",
  review_in_progress: "Review in Progress",
  indexed: "Indexed",
  manual_intervention: "Manual Intervention",
  error: "Error",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
