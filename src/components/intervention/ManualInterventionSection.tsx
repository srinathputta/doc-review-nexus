
import React from "react";
import BackButton from "@/components/ui/back-button";

const ManualInterventionSection = () => {
  return (
    <div className="p-6">
      <BackButton />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manual Intervention</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-500">Documents requiring manual intervention will appear here</p>
      </div>
    </div>
  );
};

export default ManualInterventionSection;
