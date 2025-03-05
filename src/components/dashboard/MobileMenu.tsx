
import React from 'react';
import { LogOut, BookOpen, Users, BarChart4, FileText, Calendar, GraduationCap, CheckSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  userData: {
    role: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  closeMobileMenu: () => void;
  handleLogout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  userData,
  activeTab,
  setActiveTab,
  closeMobileMenu,
  handleLogout
}) => {
  const isAdmin = userData.role === 'admin';
  const isInstructor = userData.role === 'instructor';
  const isStudent = userData.role === 'student';

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    closeMobileMenu();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white shadow-lg rounded-b-lg animate-fade-in">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Button 
          variant={activeTab === 'projects' ? "default" : "ghost"} 
          onClick={() => handleTabChange('projects')}
          className="w-full justify-start"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Projects
        </Button>
        
        {isAdmin && (
          <>
            <Button 
              variant={activeTab === 'users' ? "default" : "ghost"}
              onClick={() => handleTabChange('users')}
              className="w-full justify-start"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
            <Button 
              variant={activeTab === 'fees' ? "default" : "ghost"}
              onClick={() => handleTabChange('fees')}
              className="w-full justify-start"
            >
              <BarChart4 className="w-4 h-4 mr-2" />
              Fees
            </Button>
            <Button 
              variant={activeTab === 'report' ? "default" : "ghost"}
              onClick={() => handleTabChange('report')}
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Report
            </Button>
          </>
        )}
        
        {isInstructor && (
          <>
            <Button 
              variant={activeTab === 'attendance' ? "default" : "ghost"}
              onClick={() => handleTabChange('attendance')}
              className="w-full justify-start"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Attendance
            </Button>
            <Button 
              variant={activeTab === 'report' ? "default" : "ghost"}
              onClick={() => handleTabChange('report')}
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Report
            </Button>
          </>
        )}
        
        {isStudent && (
          <>
            <Button 
              variant={activeTab === 'profile' ? "default" : "ghost"}
              onClick={() => handleTabChange('profile')}
              className="w-full justify-start"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button 
              variant={activeTab === 'attendance' ? "default" : "ghost"}
              onClick={() => handleTabChange('attendance')}
              className="w-full justify-start"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Attendance
            </Button>
          </>
        )}
        
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
