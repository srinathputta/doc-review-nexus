
import React from "react";

const ReviewProgressBar = ({ reviewedSamples, total = 10 }) => {
  const allSamplesReviewed = reviewedSamples >= total;

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Sample Review Progress:</span>
        <span className="text-sm text-gray-700">{reviewedSamples}/{total} samples reviewed</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-teal-600 h-2.5 rounded-full"
          style={{ width: `${(reviewedSamples / total) * 100}%` }}
        ></div>
      </div>

      {reviewedSamples > 0 && (
        <div className="mt-2 text-sm">
          {allSamplesReviewed ? (
            <span className="text-green-600 font-medium">
              ✓ All samples reviewed. Ready to send to indexing.
            </span>
          ) : (
            <span className="text-gray-600">Review {total - reviewedSamples} more sample(s) to complete batch review.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewProgressBar;
