
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LoginFormProps {
  onToggleForm: () => void;
  onShowResetForm: () => void;
}

export const LoginForm = ({ onToggleForm, onShowResetForm }: LoginFormProps) => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", emailOrUsername, password);
      
      // Check if this is the admin
      if (emailOrUsername === 'admin@academy.com' && password === 'admin123') {
        console.log("Admin login detected");
        
        // Set admin user details in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          email: 'admin@academy.com',
          name: 'Admin',
          role: 'admin',
          profileCompleted: true
        }));
        
        toast.success("एडमिन लॉगिन सफल!");
        navigate('/user-dashboard');
        return;
      }
      
      // For non-admin users, check the stored users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log("Retrieved users:", users);
      
      // Check if user exists by email OR username
      const user = users.find((u: any) => 
        (u.email === emailOrUsername || u.name === emailOrUsername) && u.password === password
      );
      
      console.log("Found user:", user);

      if (user) {
        // Admin users can bypass the approval check
        if (!user.approved && user.role !== 'admin') {
          toast.error("आपका अकाउंट एडमिन अप्रूवल के लिए पेंडिंग है!");
          setIsLoading(false);
          return;
        }

        localStorage.setItem('currentUser', JSON.stringify({
          email: user.email,
          name: user.name,
          role: user.role,
          github: user.github,
          linkedin: user.linkedin,
          whatsapp: user.whatsapp,
          college: user.college,
          course: user.course,
          photo: user.photo,
          profileCompleted: Boolean(user.github && user.linkedin && user.whatsapp && user.college && user.course)
        }));
        toast.success("लॉगिन सफल!");
        navigate('/user-dashboard');
      } else {
        toast.error("अमान्य क्रेडेंशियल्स!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("एक त्रुटि हुई!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        type="text"
        placeholder="ईमेल या यूजरनेम"
        value={emailOrUsername}
        onChange={(e) => setEmailOrUsername(e.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        type="password"
        placeholder="पासवर्ड"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        <LogIn className="w-4 h-4 mr-2" />
        {isLoading ? 'लॉगिन हो रहा है...' : 'साइन इन'}
      </Button>

      <div className="mt-6 text-center space-y-2">
        <button
          onClick={onShowResetForm}
          className="text-sm text-blue-600 hover:underline block w-full"
          type="button"
          disabled={isLoading}
        >
          पासवर्ड भूल गए?
        </button>
        <button
          onClick={onToggleForm}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          type="button"
          disabled={isLoading}
        >
          अकाउंट नहीं है? साइन अप करें
        </button>
      </div>
    </form>
  );
};
