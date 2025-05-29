
import React from 'react';
import { Button } from '@/components/ui/button';

const SampleReviewInterface = ({ onBack }) => {
  return (
    <div className="p-6">
      <Button onClick={onBack} variant="outline" className="mb-4">
        Back to Batch Review
      </Button>
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Sample Review Interface</h2>
        <p className="text-gray-600">This interface is for reviewing samples.</p>
      </div>
    </div>
  );
};

export default SampleReviewInterface;
