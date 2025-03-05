
import { useState, useEffect } from 'react';
import { 
  User, 
  Code, 
  Wallet, 
  CheckSquare, 
  Calendar, 
  Award 
} from 'lucide-react';

export interface DashboardStat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: string;
}

export const useStats = (role: string, email: string) => {
  const [stats, setStats] = useState<DashboardStat[]>([]);

  useEffect(() => {
    if (role === 'admin') {
      loadAdminStats();
    } else if (role === 'instructor') {
      loadInstructorStats();
    } else {
      loadStudentStats(email);
    }
  }, [role, email]);

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

    setStats(stats);
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

    setStats(stats);
  };

  const loadStudentStats = (email: string) => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const attendances = JSON.parse(localStorage.getItem('attendance') || '[]');
    
    const completedProjects = projects.filter((p: any) => 
      p.studentEmail === email && p.deployLink
    ).length;
    
    const pendingProjects = projects.filter((p: any) => 
      !p.studentEmail || p.studentEmail === email && !p.deployLink
    ).length;
    
    // Calculate attendance percentage
    const userAttendances = attendances.flatMap((a: any) => 
      a.students.filter((s: any) => s.email === email)
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

    setStats(stats);
  };

  return stats;
};
