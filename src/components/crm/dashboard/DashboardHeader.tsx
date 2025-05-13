
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Sales CRM Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">Sales Executive</p>
        </div>
        <Button variant="outline" onClick={onLogout} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
