
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { UserService } from "@/services/UserService";

interface LoginFormProps {
  onToggleForm: () => void;
  onShowResetForm: () => void;
}

export const LoginForm = ({ onToggleForm, onShowResetForm }: LoginFormProps) => {
  const navigate = useNavigate();
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
        
        toast.success("सफलतापूर्वक लॉगिन किया गया!");
        
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
        toast.error("अमान्य प्रमाण पत्र। कृपया पुन: प्रयास करें।");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("लॉगिन में त्रुटि हुई। कृपया पुन: प्रयास करें।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">ईमेल</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="आपका ईमेल पता दर्ज करें" 
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">पासवर्ड</Label>
          <Button 
            variant="link" 
            className="p-0 h-auto text-xs" 
            type="button"
            onClick={onShowResetForm}
          >
            पासवर्ड भूल गए?
          </Button>
        </div>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="आपका पासवर्ड दर्ज करें" 
          required
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'लॉग इन कर रहा है...' : 'लॉग इन करें'}
      </Button>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          खाता नहीं है?{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto" 
            type="button"
            onClick={onToggleForm}
          >
            पंजीकरण करें
          </Button>
        </p>
      </div>
    </form>
  );
};
