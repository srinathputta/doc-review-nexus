
import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { 
  Upload, 
  Clock, 
  Edit, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  icon: Icon, 
  label, 
  active, 
  onClick 
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md",
        active
          ? "bg-teal-100 text-teal-700"
          : "text-gray-600 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { currentStage, setCurrentStage } = useApp();
  
  return (
    <div className="flex flex-col w-64 min-h-screen border-r bg-white">
      <div className="px-4 py-6 border-b">
        <h1 className="text-xl font-semibold text-teal-700">Document Ingestion</h1>
      </div>
      
      <div className="flex flex-col gap-1 p-2 flex-1">
        <NavItem
          href="/upload"
          icon={Upload}
          label="Upload"
          active={currentStage === "upload"}
          onClick={() => setCurrentStage("upload")}
        />
        <NavItem
          href="/extraction"
          icon={Clock}
          label="Extraction Queue"
          active={currentStage === "extraction"}
          onClick={() => setCurrentStage("extraction")}
        />
        <NavItem
          href="/review"
          icon={Edit}
          label="Batch Review"
          active={currentStage === "review"}
          onClick={() => setCurrentStage("review")}
        />
        <NavItem
          href="/indexed"
          icon={CheckCircle}
          label="Indexed"
          active={currentStage === "indexed"}
          onClick={() => setCurrentStage("indexed")}
        />
        <NavItem
          href="/intervention"
          icon={AlertCircle}
          label="Manual Intervention"
          active={currentStage === "intervention"}
          onClick={() => setCurrentStage("intervention")}
        />
      </div>
      
      <div className="px-4 py-3 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center">
            U
          </div>
          <div>
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
