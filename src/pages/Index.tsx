
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, UserCog } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { LoginForm } from '@/components/auth/LoginForm';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      console.log("Index page - User found in localStorage:", user);
      
      // Redirect based on role and profile completion
      if (!user.profileCompleted) {
        console.log("User profile not completed, redirecting to profile setup");
        navigate('/profile-setup');
      } else if (user.role === 'sales') {
        console.log("Sales user, redirecting to sales dashboard");
        navigate('/sales');
      } else {
        console.log("Regular user, redirecting to user dashboard");
        navigate('/user-dashboard');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 relative">
      {/* Language Toggle in top-right corner */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <Card className="w-full max-w-md p-8 backdrop-blur-sm bg-white/90 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-gray-50 mb-4">
            {isLogin ? (
              <School className="w-8 h-8 text-gray-700" />
            ) : (
              <UserCog className="w-8 h-8 text-gray-700" />
            )}
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {showResetForm 
              ? t('passwordReset', language) 
              : (isLogin ? t('academyLogin', language) : t('registration', language))
            }
          </h1>
        </div>

        {showResetForm ? (
          <PasswordResetForm onBack={() => setShowResetForm(false)} />
        ) : isLogin ? (
          <LoginForm 
            onToggleForm={() => setIsLogin(false)} 
            onShowResetForm={() => setShowResetForm(true)}
          />
        ) : (
          <RegistrationForm onToggleForm={() => setIsLogin(true)} />
        )}
      </Card>
    </div>
  );
};

export default Index;
