
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { UserService } from "@/services/UserService";

interface RegistrationFormProps {
  onToggleForm: () => void;
}

export const RegistrationForm = ({ onToggleForm }: RegistrationFormProps) => {
  const navigate = useNavigate();
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
      toast.error("पासवर्ड मेल नहीं खाते");
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
        
        toast.success("पंजीकरण सफल!");
        navigate('/profile-setup');
      } else {
        toast.error("पंजीकरण विफल हो गया। कृपया पुन: प्रयास करें।");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("पंजीकरण में त्रुटि हुई। कृपया पुन: प्रयास करें।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">नाम</Label>
        <Input 
          id="name" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="अपना पूरा नाम दर्ज करें" 
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">ईमेल</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          value={formData.email}
          onChange={handleChange}
          placeholder="अपना ईमेल पता दर्ज करें" 
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">भूमिका</Label>
        <Select 
          value={formData.role} 
          onValueChange={handleRoleChange}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="अपनी भूमिका चुनें" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">छात्र</SelectItem>
            <SelectItem value="instructor">शिक्षक</SelectItem>
            <SelectItem value="accounting">अकाउंटिंग</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">पासवर्ड</Label>
        <Input 
          id="password" 
          name="password"
          type="password" 
          value={formData.password}
          onChange={handleChange}
          placeholder="एक मजबूत पासवर्ड बनाएं" 
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">पासवर्ड की पुष्टि करें</Label>
        <Input 
          id="confirmPassword" 
          name="confirmPassword"
          type="password" 
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="अपना पासवर्ड फिर से दर्ज करें" 
          required
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'पंजीकरण हो रहा है...' : 'पंजीकरण करें'}
      </Button>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          पहले से ही एक खाता है?{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto" 
            type="button"
            onClick={onToggleForm}
          >
            लॉग इन करें
          </Button>
        </p>
      </div>
    </form>
  );
};
