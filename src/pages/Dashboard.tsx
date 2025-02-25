
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { AdminFees } from "@/components/AdminFees";
import { StudentProfile } from "@/components/StudentProfile";
import { AttendanceSystem } from "@/components/AttendanceSystem";
import { ProjectManagement } from "@/components/ProjectManagement";

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
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'attendance' | 'students' | 'fees'>('projects');

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUserData(JSON.parse(currentUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success("Logged out successfully");
    navigate('/');
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="w-6 h-6 text-gray-700" />
              <span className="ml-2 text-lg font-semibold text-gray-900">
                {userData.role === 'admin' ? 'Admin Dashboard' : 
                 userData.role === 'instructor' ? 'Instructor Dashboard' : 
                 'Student Dashboard'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setActiveTab('projects')}>
                Projects
              </Button>
              {userData.role === 'admin' && (
                <>
                  <Button variant="ghost" onClick={() => setActiveTab('students')}>
                    Students
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveTab('fees')}>
                    Fees
                  </Button>
                </>
              )}
              {userData.role === 'student' && (
                <>
                  <Button variant="ghost" onClick={() => setActiveTab('profile')}>
                    Profile
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveTab('attendance')}>
                    Attendance
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeMessage
          name={userData.name}
          role={userData.role}
          message={userData.role === 'student' ? 
            `Your next project is due soon. Don't forget to submit it before the deadline!` :
            undefined}
        />

        {activeTab === 'projects' && (
          <ProjectManagement userRole={userData.role} userEmail={userData.email} />
        )}

        {activeTab === 'fees' && userData.role === 'admin' && (
          <AdminFees />
        )}

        {activeTab === 'profile' && userData.role === 'student' && (
          <StudentProfile userData={userData} />
        )}

        {activeTab === 'attendance' && (
          <AttendanceSystem 
            isInstructor={userData.role === 'instructor'} 
            userEmail={userData.email}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
