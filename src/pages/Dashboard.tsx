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
  CheckSquare,
  Activity,
  User,
  Wallet,
  Award,
  ChevronDown,
  MenuIcon,
  X
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
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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

interface DashboardStat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'attendance' | 'students' | 'fees' | 'users' | 'report'>('projects');
  const [isAnimating, setIsAnimating] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStat[]>([]);
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
    
    // Load statistics
    if (userData?.role === 'admin') {
      loadAdminStats();
    } else if (userData?.role === 'instructor') {
      loadInstructorStats();
    } else {
      loadStudentStats();
    }
    
    return () => clearTimeout(timer);
  }, [navigate, activeTab, userData?.role]);

  const loadAdminStats = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const attendances = JSON.parse(localStorage.getItem('attendance') || '[]');

    const stats: DashboardStat[] = [
      {
        title: 'Total Students',
        value: users.filter((u: any) => u.role === 'student').length,
        icon: <User className="w-5 h-5" />,
        trend: 'up',
        trendValue: '+5%',
        color: 'bg-gradient-to-br from-blue-500 to-blue-600'
      },
      {
        title: 'Active Projects',
        value: projects.filter((p: any) => !p.grade).length,
        icon: <Code className="w-5 h-5" />,
        trend: 'up',
        trendValue: '+2',
        color: 'bg-gradient-to-br from-purple-500 to-purple-600'
      },
      {
        title: 'Fee Collection',
        value: '₹95,000',
        icon: <Wallet className="w-5 h-5" />,
        trend: 'up',
        trendValue: '+12%',
        color: 'bg-gradient-to-br from-green-500 to-green-600'
      },
      {
        title: 'Attendance Rate',
        value: '89%',
        icon: <CheckSquare className="w-5 h-5" />,
        trend: 'down',
        trendValue: '-2%',
        color: 'bg-gradient-to-br from-amber-500 to-amber-600'
      },
    ];

    setDashboardStats(stats);
  };

  const loadInstructorStats = () => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const attendances = JSON.parse(localStorage.getItem('attendance') || '[]');

    const stats: DashboardStat[] = [
      {
        title: 'Active Projects',
        value: projects.filter((p: any) => !p.grade).length,
        icon: <Code className="w-5 h-5" />,
        trend: 'up',
        trendValue: '+2',
        color: 'bg-gradient-to-br from-purple-500 to-purple-600'
      },
      {
        title: 'Graded Projects',
        value: projects.filter((p: any) => p.grade).length,
        icon: <Award className="w-5 h-5" />,
        trend: 'neutral',
        trendValue: '0',
        color: 'bg-gradient-to-br from-blue-500 to-blue-600'
      },
      {
        title: 'Attendance Sessions',
        value: attendances.length,
        icon: <Calendar className="w-5 h-5" />,
        trend: 'up',
        trendValue: '+1',
        color: 'bg-gradient-to-br from-green-500 to-green-600'
      },
    ];

    setDashboardStats(stats);
  };

  const loadStudentStats = () => {
    if (!userData) return;
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const attendances = JSON.parse(localStorage.getItem('attendance') || '[]');
    
    const completedProjects = projects.filter((p: any) => 
      p.studentEmail === userData.email && p.deployLink
    ).length;
    
    const pendingProjects = projects.filter((p: any) => 
      !p.studentEmail || p.studentEmail === userData.email && !p.deployLink
    ).length;
    
    // Calculate attendance percentage
    const userAttendances = attendances.flatMap((a: any) => 
      a.students.filter((s: any) => s.email === userData.email)
    );
    
    const attendancePercentage = attendances.length > 0 
      ? Math.round((userAttendances.length / attendances.length) * 100) 
      : 0;
    
    const stats: DashboardStat[] = [
      {
        title: 'Completed Projects',
        value: completedProjects,
        icon: <CheckSquare className="w-5 h-5" />,
        trend: 'up',
        trendValue: '+1',
        color: 'bg-gradient-to-br from-green-500 to-green-600'
      },
      {
        title: 'Pending Projects',
        value: pendingProjects,
        icon: <Code className="w-5 h-5" />,
        trend: pendingProjects > 0 ? 'down' : 'neutral',
        trendValue: pendingProjects > 0 ? `${pendingProjects} left` : 'All done!',
        color: 'bg-gradient-to-br from-amber-500 to-amber-600'
      },
      {
        title: 'Attendance Rate',
        value: `${attendancePercentage}%`,
        icon: <Calendar className="w-5 h-5" />,
        trend: attendancePercentage > 80 ? 'up' : 'down',
        trendValue: attendancePercentage > 80 ? 'Good!' : 'Improve',
        color: 'bg-gradient-to-br from-blue-500 to-blue-600'
      },
    ];

    setDashboardStats(stats);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success("Logged out successfully");
    navigate('/');
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md border-b border-indigo-100 sticky top-0 z-10">
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
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      className="flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Log out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-lg animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Button 
                variant={activeTab === 'projects' ? "default" : "ghost"} 
                onClick={() => {setActiveTab('projects'); setMobileMenuOpen(false);}}
                className="w-full justify-start"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Projects
              </Button>
              
              {userData.role === 'admin' && (
                <>
                  <Button 
                    variant={activeTab === 'users' ? "default" : "ghost"}
                    onClick={() => {setActiveTab('users'); setMobileMenuOpen(false);}}
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </Button>
                  <Button 
                    variant={activeTab === 'fees' ? "default" : "ghost"}
                    onClick={() => {setActiveTab('fees'); setMobileMenuOpen(false);}}
                    className="w-full justify-start"
                  >
                    <BarChart4 className="w-4 h-4 mr-2" />
                    Fees
                  </Button>
                  <Button 
                    variant={activeTab === 'report' ? "default" : "ghost"}
                    onClick={() => {setActiveTab('report'); setMobileMenuOpen(false);}}
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </>
              )}
              
              {userData.role === 'instructor' && (
                <>
                  <Button 
                    variant={activeTab === 'attendance' ? "default" : "ghost"}
                    onClick={() => {setActiveTab('attendance'); setMobileMenuOpen(false);}}
                    className="w-full justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Attendance
                  </Button>
                  <Button 
                    variant={activeTab === 'report' ? "default" : "ghost"}
                    onClick={() => {setActiveTab('report'); setMobileMenuOpen(false);}}
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </>
              )}
              
              {userData.role === 'student' && (
                <>
                  <Button 
                    variant={activeTab === 'profile' ? "default" : "ghost"}
                    onClick={() => {setActiveTab('profile'); setMobileMenuOpen(false);}}
                    className="w-full justify-start"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === 'attendance' ? "default" : "ghost"}
                    onClick={() => {setActiveTab('attendance'); setMobileMenuOpen(false);}}
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
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`animate-fade-in ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
          <WelcomeMessage
            userName={userData.name}
            userRole={userData.role}
            message={userData.role === 'student' ? 
              `Your next project is due soon. Don't forget to submit it before the deadline!` :
              undefined}
          />

          {/* Dashboard Statistics */}
          {dashboardStats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 animate-fade-in">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <CardContent className={`p-0 h-full`}>
                    <div className={`flex items-center p-5 ${stat.color} text-white h-full`}>
                      <div className="mr-4 bg-white/20 p-3 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        {stat.trend && (
                          <div className="flex items-center text-xs mt-1">
                            <span className={`
                              ${stat.trend === 'up' ? 'text-green-200' : ''}
                              ${stat.trend === 'down' ? 'text-red-200' : ''}
                              ${stat.trend === 'neutral' ? 'text-blue-200' : ''}
                            `}>
                              {stat.trend === 'up' && '↑ '}
                              {stat.trend === 'down' && '↓ '}
                              {stat.trendValue}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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
