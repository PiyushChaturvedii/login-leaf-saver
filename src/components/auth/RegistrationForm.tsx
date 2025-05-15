
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { UserService } from "@/services/UserService";
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

interface RegistrationFormProps {
  onToggleForm: () => void;
}

export const RegistrationForm = ({ onToggleForm }: RegistrationFormProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'admin' | 'instructor' | 'student' | 'sales' | 'accounting',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as 'admin' | 'instructor' | 'student' | 'sales' | 'accounting' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordsDontMatch', language));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user using our MongoDB service
      const newUser = await UserService.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profileCompleted: false
      });
      
      if (newUser) {
        // Store the user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        toast.success(t('registrationSuccess', language));
        navigate('/profile-setup');
      } else {
        toast.error(t('registrationFailed', language));
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t('registrationError', language));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('name', language)}</Label>
        <Input 
          id="name" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('enterYourFullName', language)} 
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t('email', language)}</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          value={formData.email}
          onChange={handleChange}
          placeholder={t('enterYourEmail', language)} 
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">{t('role', language)}</Label>
        <Select 
          value={formData.role} 
          onValueChange={handleRoleChange}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('chooseYourRole', language)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">{t('student', language)}</SelectItem>
            <SelectItem value="instructor">{t('instructor', language)}</SelectItem>
            <SelectItem value="accounting">{t('accounting', language)}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">{t('password', language)}</Label>
        <Input 
          id="password" 
          name="password"
          type="password" 
          value={formData.password}
          onChange={handleChange}
          placeholder={t('createStrongPassword', language)} 
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('confirmPassword', language)}</Label>
        <Input 
          id="confirmPassword" 
          name="confirmPassword"
          type="password" 
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder={t('reenterPassword', language)} 
          required
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t('registering', language) : t('register', language)}
      </Button>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {t('alreadyHaveAccount', language)}{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto" 
            type="button"
            onClick={onToggleForm}
          >
            {t('login', language)}
          </Button>
        </p>
      </div>
    </form>
  );
};
