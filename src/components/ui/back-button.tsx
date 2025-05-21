
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  variant = "ghost", 
  className = "" 
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Button 
      variant={variant} 
      size="sm"
      className={`mb-4 ${className}`} 
      onClick={handleBack}
    >
      <ArrowLeft size={16} className="mr-2" />
      Back
    </Button>
  );
};

export default BackButton;
