
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { 
  Upload, 
  Clock, 
  Edit, 
  CheckCircle, 
  AlertCircle,
  FileText,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const NavItem = ({ 
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

const Sidebar = () => {
  const { setCurrentStage } = useApp();
  const location = useLocation();
  const path = location.pathname === "/" ? "/upload" : location.pathname;
  
  const pathToStage = (path) => {
    return path.replace('/', '') || 'upload';
  };
  
  React.useEffect(() => {
    const stage = pathToStage(path);
    setCurrentStage(stage);
  }, [path, setCurrentStage]);
  
  return (
    <div className="flex flex-col w-64 min-h-screen border-r bg-white">
      <div className="px-4 py-6 border-b">
        <h1 className="text-xl font-semibold text-teal-700">DocuPilot</h1>
      </div>
      
      <div className="flex flex-col gap-1 p-2 flex-1">
        <NavItem
          href="/upload"
          icon={Upload}
          label="Upload"
          active={path === "/upload"}
        />
        <NavItem
          href="/basic-extraction"
          icon={Clock}
          label="Basic Extraction"
          active={path === "/basic-extraction"}
        />
        <NavItem
          href="/basic-details-review"
          icon={Edit}
          label="Basic Details Review"
          active={path === "/basic-details-review"}
        />
        <NavItem
          href="/fs-extraction"
          icon={FileText}
          label="F/S Extraction"
          active={path === "/fs-extraction"}
        />
        <NavItem
          href="/facts-summary-review"
          icon={BookOpen}
          label="Facts & Summary Review"
          active={path === "/facts-summary-review"}
        />
        <NavItem
          href="/indexed"
          icon={CheckCircle}
          label="Indexed"
          active={path === "/indexed"}
        />
        <NavItem
          href="/intervention"
          icon={AlertCircle}
          label="Manual Intervention"
          active={path === "/intervention"}
        />
      </div>
      
      <div className="px-4 py-3 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center">
            J
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
