
import React from "react";
import BackButton from "@/components/ui/back-button";

const IndexedSection = () => {
  return (
    <div className="p-6">
      <BackButton />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Indexed Documents</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-500">Indexed documents will appear here</p>
      </div>
    </div>
  );
};

export default IndexedSection;
