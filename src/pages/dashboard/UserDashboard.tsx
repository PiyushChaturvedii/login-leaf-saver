
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { PaymentReminder } from '@/components/dashboard/PaymentReminder';
import { QuickLinks } from '@/components/dashboard/QuickLinks';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart4, Users, BookOpen, Calendar } from 'lucide-react';

interface UserData {
  email: string;
  name: string;
  role: string;
  profileCompleted?: boolean;
  [key: string]: any;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { isLoading: isCheckingProfile } = useProfileCompletion();
  const [stats, setStats] = useState({
    projects: 0,
    attendance: 0,
    students: 0,
    payments: 0
  });

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(currentUser);
    setUserData(parsedUser);
    
    // Load stats based on user role
    if (parsedUser.role === 'student') {
      setStats({
        projects: Math.floor(Math.random() * 10) + 1,
        attendance: Math.floor(Math.random() * 100),
        students: 0,
        payments: Math.floor(Math.random() * 5)
      });
    } else if (parsedUser.role === 'instructor') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const studentCount = users.filter((user: any) => user.role === 'student').length;
      
      setStats({
        projects: Math.floor(Math.random() * 15) + 5,
        attendance: Math.floor(Math.random() * 30) + 70,
        students: studentCount,
        payments: 0
      });
    } else if (parsedUser.role === 'admin' || parsedUser.role === 'accounting') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const studentCount = users.filter((user: any) => user.role === 'student').length;
      const fees = JSON.parse(localStorage.getItem('fees') || '[]');
      
      setStats({
        projects: Math.floor(Math.random() * 20) + 10,
        attendance: Math.floor(Math.random() * 20) + 80,
        students: studentCount,
        payments: fees.length
      });
    }
  }, [navigate]);

  if (isCheckingProfile || !userData) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse-soft">
        <p className="text-xl text-gray-500">लोड हो रहा है...</p>
      </div>
    </div>;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'सुप्रभात';
    if (hour < 17) return 'नमस्कार';
    return 'शुभ संध्या';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {getGreeting()}, {userData.name}
          </h1>
          <p className="text-gray-600 mt-2">
            अपना पर्सनलाइज्ड डैशबोर्ड देखें और अपने दैनिक कार्यों का प्रबंधन करें
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile Card & Quick Stats */}
          <div className="space-y-6">
            <ProfileCard userData={userData} />
            
            {/* Quick Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
                <CardContent className="p-4 flex flex-col items-center">
                  <BookOpen className="h-6 w-6 text-amber-500 mb-2" />
                  <p className="text-xs text-gray-500">प्रोजेक्ट्स</p>
                  <p className="text-2xl font-semibold">{stats.projects}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4 flex flex-col items-center">
                  <Calendar className="h-6 w-6 text-blue-500 mb-2" />
                  <p className="text-xs text-gray-500">उपस्थिति</p>
                  <p className="text-2xl font-semibold">{stats.attendance}%</p>
                </CardContent>
              </Card>
              
              {(userData.role === 'admin' || userData.role === 'instructor') && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Users className="h-6 w-6 text-purple-500 mb-2" />
                    <p className="text-xs text-gray-500">छात्र</p>
                    <p className="text-2xl font-semibold">{stats.students}</p>
                  </CardContent>
                </Card>
              )}
              
              {(userData.role === 'admin' || userData.role === 'accounting' || userData.role === 'student') && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="p-4 flex flex-col items-center">
                    <BarChart4 className="h-6 w-6 text-green-500 mb-2" />
                    <p className="text-xs text-gray-500">
                      {userData.role === 'student' ? 'भुगतान' : 'कुल भुगतान'}
                    </p>
                    <p className="text-2xl font-semibold">{stats.payments}</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Payment Reminder (only for students) */}
            {userData.role === 'student' && (
              <PaymentReminder userEmail={userData.email} />
            )}
          </div>
          
          {/* Right column - Quick Links & Additional Info */}
          <div className="lg:col-span-2 space-y-6">
            <QuickLinks userRole={userData.role} />
            
            <Card>
              <CardHeader>
                <CardTitle>स्वागत है!</CardTitle>
                <CardDescription>हमारे शिक्षा प्रबंधन प्लेटफॉर्म में आपका स्वागत है</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose text-gray-500">
                  <p>
                    यह डैशबोर्ड आपको आपकी भूमिका के अनुसार सभी महत्वपूर्ण जानकारी और कार्यों तक पहुंच प्रदान करता है। 
                    बाईं ओर दिए गए नेविगेशन मेनू का उपयोग करके अन्य पृष्ठों तक पहुंचें या ऊपर दिए गए क्विक लिंक्स का उपयोग करें।
                  </p>
                  <p className="mt-4">
                    अपना प्रोफ़ाइल अपडेट करने के लिए डैशबोर्ड पृष्ठ पर अपनी प्रोफ़ाइल पर क्लिक करें।
                    {userData.role === 'student' && ' आगामी भुगतान अनुस्मारक के लिए बाईं ओर देखें।'}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 text-sm text-gray-500">
                आखरी अपडेट: {new Date().toLocaleDateString('hi-IN')}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
