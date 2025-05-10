
import React from 'react';
import { LogOut, BookOpen, Users, BarChart4, FileText, Calendar, GraduationCap, CheckSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

// Define the type for dashboard tabs
type DashboardTab = 'projects' | 'profile' | 'attendance' | 'students' | 'fees' | 'users' | 'report';

interface MobileMenuProps {
  isOpen: boolean;
  userData: {
    name: string;
    role: string;
  };
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
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
  if (!isOpen) return null;
  
  const isAdmin = userData.role === 'admin';
  const isInstructor = userData.role === 'instructor';
  const isStudent = userData.role === 'student';
  
  const handleTabClick = (tab: DashboardTab) => {
    setActiveTab(tab);
    closeMobileMenu();
  };
  
  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden">
      <div className="relative w-3/4 max-w-sm h-full bg-white shadow-xl overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <p className="font-medium text-lg">{userData.name}</p>
            <p className="text-sm text-gray-500 capitalize">{userData.role}</p>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant={activeTab === 'projects' ? "default" : "ghost"} 
              onClick={() => handleTabClick('projects')}
              className="w-full justify-start"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span>Projects</span>
            </Button>
            
            {isAdmin && (
              <>
                <Button 
                  variant={activeTab === 'users' ? "default" : "ghost"}
                  onClick={() => handleTabClick('users')}
                  className="w-full justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span>Users</span>
                </Button>
                <Button 
                  variant={activeTab === 'fees' ? "default" : "ghost"}
                  onClick={() => handleTabClick('fees')}
                  className="w-full justify-start"
                >
                  <BarChart4 className="w-4 h-4 mr-2" />
                  <span>Fees</span>
                </Button>
                <Button 
                  variant={activeTab === 'report' ? "default" : "ghost"}
                  onClick={() => handleTabClick('report')}
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Report</span>
                </Button>
              </>
            )}
            
            {isInstructor && (
              <>
                <Button 
                  variant={activeTab === 'attendance' ? "default" : "ghost"}
                  onClick={() => handleTabClick('attendance')}
                  className="w-full justify-start"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Attendance</span>
                </Button>
                <Button 
                  variant={activeTab === 'report' ? "default" : "ghost"}
                  onClick={() => handleTabClick('report')}
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Report</span>
                </Button>
              </>
            )}
            
            {isStudent && (
              <>
                <Button 
                  variant={activeTab === 'profile' ? "default" : "ghost"}
                  onClick={() => handleTabClick('profile')}
                  className="w-full justify-start"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span>Profile</span>
                </Button>
                <Button 
                  variant={activeTab === 'attendance' ? "default" : "ghost"}
                  onClick={() => handleTabClick('attendance')}
                  className="w-full justify-start"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  <span>Attendance</span>
                </Button>
              </>
            )}
            
            <div className="pt-4 border-t mt-4 space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Logout</span>
              </Button>
              
              {/* Language Toggle in mobile menu */}
              <div className="flex justify-center mt-2 pb-2">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="absolute inset-0 z-[-1]" 
        onClick={closeMobileMenu}
      />
    </div>
  );
};
