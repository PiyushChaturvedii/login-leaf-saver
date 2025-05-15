
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserService } from "@/services/UserService";
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

interface PasswordResetProps {
  onBack: () => void;
}

export const PasswordResetForm = ({ onBack }: PasswordResetProps) => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if user exists
      const user = await UserService.getUserByEmail(email);
      
      if (user) {
        // In a real application, you would send a reset email here
        // For now, we'll just simulate success
        toast.success(t('resetSuccess', language));
        setIsSubmitted(true);
      } else {
        toast.error(t('noAccountFound', language));
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(t('resetError', language));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium">{t('passwordResetSent', language)}</h3>
        <p className="text-sm text-gray-600">
          {t('checkInbox', language)} {email}.
          <br />
          {t('followInstructions', language)}
        </p>
        
        <Button onClick={onBack} className="mt-4 w-full">
          {t('backToLogin', language)}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">{t('emailAddress', language)}</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('enterRegisteredEmail', language)}
          required
          disabled={isLoading}
        />
      </div>
      
      <p className="text-sm text-gray-600">
        {t('resetInstructions', language)}
      </p>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          {t('back', language)}
        </Button>
        
        <Button
          type="submit"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? t('sending', language) : t('sendReset', language)}
        </Button>
      </div>
    </form>
  );
};
