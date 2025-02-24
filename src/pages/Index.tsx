
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Lock, School, UserCog } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface UserData {
  email: string;
  password: string;
  role: 'admin' | 'student';
  name: string;
  // Additional student fields
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  college?: string;
  course?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [role, setRole] = useState<'admin' | 'student'>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData: UserData = { 
      email, 
      password, 
      role, 
      name,
      ...(role === 'student' && {
        github,
        linkedin,
        whatsapp,
        college,
        course
      })
    };
    
    try {
      // Save to local storage as JSON
      const existingData = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (!isLogin) {
        // Registration
        if (existingData.some((user: UserData) => user.email === email)) {
          toast.error("User already exists!");
          return;
        }
        
        // For admin registration, check if admin already exists
        if (role === 'admin' && existingData.some((user: UserData) => user.role === 'admin')) {
          toast.error("Admin account already exists!");
          return;
        }

        // Set default admin credentials if no admin exists
        if (role === 'admin' && !existingData.some((user: UserData) => user.role === 'admin')) {
          userData.email = 'admin@academy.com';
          userData.password = 'admin123';
          toast.success("Default admin credentials set!");
        }

        existingData.push(userData);
        localStorage.setItem('users', JSON.stringify(existingData));
        toast.success("Registration successful!");
      } else {
        // Login
        const user = existingData.find((user: UserData) => 
          user.email === email && user.password === password
        );
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify({ 
            email: user.email,
            name: user.name,
            role: user.role,
            github: user.github,
            linkedin: user.linkedin,
            whatsapp: user.whatsapp,
            college: user.college,
            course: user.course
          }));
          toast.success("Login successful!");
          navigate('/dashboard');
        } else {
          toast.error("Invalid credentials!");
        }
      }
    } catch (error) {
      toast.error("An error occurred!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md p-8 backdrop-blur-sm bg-white/90 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-gray-50 mb-4">
            {isLogin ? (
              <School className="w-8 h-8 text-gray-700" />
            ) : (
              role === 'admin' ? <UserCog className="w-8 h-8 text-gray-700" /> : <School className="w-8 h-8 text-gray-700" />
            )}
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {isLogin ? 'Academy Login' : `${role === 'admin' ? 'Admin' : 'Student'} Registration`}
          </h1>
          <p className="text-gray-600 text-sm">
            {isLogin ? 'Sign in to access your academy account' : 'Register for a new academy account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={role === 'student' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setRole('student')}
                >
                  <School className="w-4 h-4 mr-2" />
                  Student
                </Button>
                <Button
                  type="button"
                  variant={role === 'admin' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setRole('admin')}
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </div>

              {role === 'student' && (
                <>
                  <Input
                    type="text"
                    placeholder="GitHub Profile URL"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="LinkedIn Profile URL"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="WhatsApp Number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="College Name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Course/Branch"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                  />
                </>
              )}
            </>
          )}

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200"
          >
            {isLogin ? (
              <LogIn className="w-4 h-4 mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
