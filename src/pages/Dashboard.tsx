
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Home, 
  FileText, 
  Code, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Calendar, 
  BarChart4, 
  CheckSquare 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { AdminFees } from "@/components/AdminFees";
import { StudentProfile } from "@/components/StudentProfile";
import { AttendanceSystem } from "@/components/AttendanceSystem";
import { ProjectManagement } from "@/components/ProjectManagement";
import { AdminProfile } from "@/components/AdminProfile";
import { SystemReport } from "@/components/SystemReport";

interface UserData {
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  college?: string;
  course?: string;
  photo?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'attendance' | 'students' | 'fees' | 'users' | 'report'>('projects');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUserData(JSON.parse(currentUser));
    
    // Reset animation state when tab changes
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    
    return () => clearTimeout(timer);
  }, [navigate, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success("Logged out successfully");
    navigate('/');
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-md border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Code className="w-8 h-8 text-indigo-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {userData.role === 'admin' ? 'Admin Dashboard' : 
                   userData.role === 'instructor' ? 'Instructor Dashboard' : 
                   'Student Dashboard'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant={activeTab === 'projects' ? "default" : "ghost"} 
                onClick={() => setActiveTab('projects')}
                className="flex items-center space-x-1"
              >
                <BookOpen className="w-4 h-4" />
                <span>Projects</span>
              </Button>
              
              {userData.role === 'admin' && (
                <>
                  <Button 
                    variant={activeTab === 'users' ? "default" : "ghost"}
                    onClick={() => setActiveTab('users')}
                    className="flex items-center space-x-1"
                  >
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                  </Button>
                  <Button 
                    variant={activeTab === 'fees' ? "default" : "ghost"}
                    onClick={() => setActiveTab('fees')}
                    className="flex items-center space-x-1"
                  >
                    <BarChart4 className="w-4 h-4" />
                    <span>Fees</span>
                  </Button>
                  <Button 
                    variant={activeTab === 'report' ? "default" : "ghost"}
                    onClick={() => setActiveTab('report')}
                    className="flex items-center space-x-1"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Report</span>
                  </Button>
                </>
              )}
              
              {userData.role === 'instructor' && (
                <>
                  <Button 
                    variant={activeTab === 'attendance' ? "default" : "ghost"}
                    onClick={() => setActiveTab('attendance')}
                    className="flex items-center space-x-1"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Attendance</span>
                  </Button>
                  <Button 
                    variant={activeTab === 'report' ? "default" : "ghost"}
                    onClick={() => setActiveTab('report')}
                    className="flex items-center space-x-1"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Report</span>
                  </Button>
                </>
              )}
              
              {userData.role === 'student' && (
                <>
                  <Button 
                    variant={activeTab === 'profile' ? "default" : "ghost"}
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center space-x-1"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                  <Button 
                    variant={activeTab === 'attendance' ? "default" : "ghost"}
                    onClick={() => setActiveTab('attendance')}
                    className="flex items-center space-x-1"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Attendance</span>
                  </Button>
                </>
              )}
              
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`animate-fade-in ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
          <WelcomeMessage
            name={userData.name}
            role={userData.role}
            message={userData.role === 'student' ? 
              `Your next project is due soon. Don't forget to submit it before the deadline!` :
              undefined}
          />

          {activeTab === 'projects' && (
            <div className="mt-6">
              <ProjectManagement userRole={userData.role} userEmail={userData.email} />
            </div>
          )}

          {activeTab === 'fees' && userData.role === 'admin' && (
            <div className="mt-6">
              <AdminFees />
            </div>
          )}

          {activeTab === 'users' && userData.role === 'admin' && (
            <div className="mt-6">
              <AdminProfile />
            </div>
          )}

          {activeTab === 'profile' && userData.role === 'student' && (
            <div className="mt-6">
              <StudentProfile userData={userData} />
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="mt-6">
              <AttendanceSystem 
                isInstructor={userData.role === 'instructor'} 
                userEmail={userData.email}
              />
            </div>
          )}

          {activeTab === 'report' && (userData.role === 'admin' || userData.role === 'instructor') && (
            <div className="mt-6">
              <SystemReport />
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-tr-full opacity-30 -z-10"></div>
      <div className="fixed top-20 right-10 w-64 h-64 bg-indigo-200 rounded-full opacity-20 -z-10 blur-2xl"></div>
      <div className="fixed bottom-20 right-20 w-20 h-20 bg-blue-300 rounded-full opacity-20 -z-10"></div>
    </div>
  );
};

export default Dashboard;
