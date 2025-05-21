
import React from "react";
import Sidebar from "./Sidebar";
import { useApp } from "@/contexts/AppContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default MainLayout;
