
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { UserService } from "@/services/UserService";
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

interface LoginFormProps {
  onToggleForm: () => void;
  onShowResetForm: () => void;
}

export const LoginForm = ({ onToggleForm, onShowResetForm }: LoginFormProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Authenticate using our MongoDB service
      const user = await UserService.authenticateUser(email, password);
      
      if (user) {
        // Store the user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        toast.success(t('loginSuccess', language));
        
        console.log("User authenticated successfully:", user);
        console.log("Redirecting based on role:", user.role);
        
        // Redirect based on role and profile completion
        setTimeout(() => {
          if (!user.profileCompleted) {
            navigate('/profile-setup');
          } else if (user.role === 'sales') {
            navigate('/sales');
          } else {
            navigate('/user-dashboard');
          }
        }, 100);
      } else {
        toast.error(t('invalidCredentials', language));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t('loginError', language));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('email', language)}</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('enterYourEmail', language)} 
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t('password', language)}</Label>
          <Button 
            variant="link" 
            className="p-0 h-auto text-xs" 
            type="button"
            onClick={onShowResetForm}
          >
            {t('forgotPassword', language)}
          </Button>
        </div>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('enterYourPassword', language)} 
          required
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t('loggingIn', language) : t('login', language)}
      </Button>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {t('dontHaveAccount', language)}{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto" 
            type="button"
            onClick={onToggleForm}
          >
            {t('register', language)}
          </Button>
        </p>
      </div>
    </form>
  );
};
