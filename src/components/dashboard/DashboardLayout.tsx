
import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {children}
      
      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-tr-full opacity-30 -z-10"></div>
      <div className="fixed top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full opacity-20 -z-10 blur-2xl"></div>
      <div className="fixed bottom-20 right-20 w-20 h-20 bg-blue-300 rounded-full opacity-20 -z-10"></div>
    </div>
  );
};
