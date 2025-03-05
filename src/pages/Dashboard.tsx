
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Calendar, 
  BarChart4, 
  CheckSquare 
} from 'lucide-react';
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileMenu } from "@/components/dashboard/MobileMenu";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ContentContainer } from "@/components/dashboard/ContentContainer";
import { useStats } from "@/components/dashboard/hooks/useStats";
import { toast } from "sonner";

// Define tab type to ensure type safety
type DashboardTab = 'projects' | 'profile' | 'attendance' | 'students' | 'fees' | 'users' | 'report';

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
  const [activeTab, setActiveTab] = useState<DashboardTab>('projects');
  const [isAnimating, setIsAnimating] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Create a tab change handler that properly types the incoming value
  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
  };

  const stats = useStats(userData?.role || '', userData?.email || '');

  if (!userData) return null;

  return (
    <DashboardLayout>
      <DashboardHeader 
        userData={userData}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
      />

      <MobileMenu 
        isOpen={mobileMenuOpen}
        userData={userData}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        closeMobileMenu={() => setMobileMenuOpen(false)}
        handleLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeMessage
          userName={userData.name}
          userRole={userData.role}
          message={userData.role === 'student' ? 
            `Your next project is due soon. Don't forget to submit it before the deadline!` :
            undefined}
        />

        <DashboardStats stats={stats} />

        <ContentContainer 
          activeTab={activeTab}
          userData={userData}
          isAnimating={isAnimating}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
