
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LoginFormProps {
  onToggleForm: () => void;
  onShowResetForm: () => void;
}

export const LoginForm = ({ onToggleForm, onShowResetForm }: LoginFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        u.email === email && u.password === password
      );

      if (user) {
        if (!user.approved) {
          toast.error("Your account is pending admin approval!");
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
        }));
        toast.success("Login successful!");
        navigate('/dashboard');
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      toast.error("An error occurred!");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>

      <div className="mt-6 text-center space-y-2">
        <button
          onClick={onShowResetForm}
          className="text-sm text-blue-600 hover:underline block w-full"
          type="button"
        >
          Forgot Password?
        </button>
        <button
          onClick={onToggleForm}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          type="button"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};
