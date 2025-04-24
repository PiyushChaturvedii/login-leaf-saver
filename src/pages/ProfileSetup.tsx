
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TeacherProfileForm } from '@/components/profile/TeacherProfileForm';
import { AccountantProfileForm } from '@/components/profile/AccountantProfileForm';
import { StudentProfileForm } from '@/components/profile/StudentProfileForm';
import { toast } from "sonner";

interface UserData {
  email: string;
  name: string;
  role: string;
  profileCompleted?: boolean;
  [key: string]: any;
}

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(currentUser);
    setUserData(parsedUser);
    setIsLoading(false);
  }, [navigate]);

  const handleProfileSubmit = (formData: any) => {
    if (!userData) return;
    
    try {
      // Update in-memory state
      const updatedUser = {
        ...userData,
        ...formData,
        profileCompleted: true
      };
      
      // Update localStorage for current user
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Also update in the users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: any) => {
        if (user.email === userData.email) {
          return {
            ...user,
            ...formData,
            profileCompleted: true
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast.success("प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("प्रोफ़ाइल अपडेट में त्रुटि हुई");
    }
  };

  if (isLoading || !userData) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse-soft">
        <p className="text-xl text-gray-500">लोड हो रहा है...</p>
      </div>
    </div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            स्वागत है, {userData.name}!
          </h1>
          <p className="text-lg text-gray-600">
            आगे बढ़ने के लिए कृपया अपनी प्रोफ़ाइल पूरी करें
          </p>
        </div>

        {userData.role === 'instructor' && (
          <TeacherProfileForm 
            initialData={{ name: userData.name }} 
            onSubmit={handleProfileSubmit} 
          />
        )}

        {userData.role === 'accounting' && (
          <AccountantProfileForm 
            initialData={{ name: userData.name }} 
            onSubmit={handleProfileSubmit}
          />
        )}

        {userData.role === 'student' && (
          <StudentProfileForm 
            initialData={{ name: userData.name }} 
            onSubmit={handleProfileSubmit}
          />
        )}

        {userData.role === 'admin' && (
          // For admin, we'll auto-submit since they don't need special profile form
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-6">एडमिन उपयोगकर्ताओं के लिए अतिरिक्त प्रोफ़ाइल सेटअप की आवश्यकता नहीं है</p>
            <button 
              onClick={() => handleProfileSubmit({ profileCompleted: true })}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              डैशबोर्ड पर जाएं
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfileSetup;
