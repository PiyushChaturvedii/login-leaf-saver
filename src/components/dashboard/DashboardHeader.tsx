
import React from 'react';
import { LogOut, Code, X, MenuIcon, BookOpen, Users, BarChart4, FileText, Calendar, GraduationCap, CheckSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

// Define the type for dashboard tabs
type DashboardTab = 'projects' | 'profile' | 'attendance' | 'students' | 'fees' | 'users' | 'report';

interface DashboardHeaderProps {
  userData: {
    name: string;
    role: string;
  };
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userData,
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleLogout
}) => {
  const isAdmin = userData.role === 'admin';
  const isInstructor = userData.role === 'instructor';
  const isStudent = userData.role === 'student';

  return (
    <nav className="bg-white shadow-md border-b border-indigo-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Code className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {userData.role === 'admin' ? 'एडमिन डैशबोर्ड' : 
                 userData.role === 'instructor' ? 'शिक्षक डैशबोर्ड' : 
                 'छात्र डैशबोर्ड'}
              </span>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant={activeTab === 'projects' ? "default" : "ghost"} 
              onClick={() => setActiveTab('projects')}
              className="flex items-center space-x-1"
            >
              <BookOpen className="w-4 h-4" />
              <span>प्रोजेक्ट्स</span>
            </Button>
            
            {isAdmin && (
              <>
                <Button 
                  variant={activeTab === 'users' ? "default" : "ghost"}
                  onClick={() => setActiveTab('users')}
                  className="flex items-center space-x-1"
                >
                  <Users className="w-4 h-4" />
                  <span>यूजर्स</span>
                </Button>
                <Button 
                  variant={activeTab === 'fees' ? "default" : "ghost"}
                  onClick={() => setActiveTab('fees')}
                  className="flex items-center space-x-1"
                >
                  <BarChart4 className="w-4 h-4" />
                  <span>फीस</span>
                </Button>
                <Button 
                  variant={activeTab === 'report' ? "default" : "ghost"}
                  onClick={() => setActiveTab('report')}
                  className="flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>रिपोर्ट</span>
                </Button>
              </>
            )}
            
            {isInstructor && (
              <>
                <Button 
                  variant={activeTab === 'attendance' ? "default" : "ghost"}
                  onClick={() => setActiveTab('attendance')}
                  className="flex items-center space-x-1"
                >
                  <Calendar className="w-4 h-4" />
                  <span>अटेंडेंस</span>
                </Button>
                <Button 
                  variant={activeTab === 'report' ? "default" : "ghost"}
                  onClick={() => setActiveTab('report')}
                  className="flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>रिपोर्ट</span>
                </Button>
              </>
            )}
            
            {isStudent && (
              <>
                <Button 
                  variant={activeTab === 'profile' ? "default" : "ghost"}
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center space-x-1"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>प्रोफाइल</span>
                </Button>
                <Button 
                  variant={activeTab === 'attendance' ? "default" : "ghost"}
                  onClick={() => setActiveTab('attendance')}
                  className="flex items-center space-x-1"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>अटेंडेंस</span>
                </Button>
              </>
            )}
            
            <div className="flex items-center space-x-2 ml-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      className="flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">लॉगआउट</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>लॉगआउट</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Language Toggle button placed below logout */}
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
