
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, School, UserCog } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface RegisterFormProps {
  onRegister: (user: any) => void;
}

interface UserData {
  email: string;
  password: string;
  role: 'admin' | 'instructor' | 'student';
  name: string;
  approved?: boolean;
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  college?: string;
  course?: string;
}

export const RegisterForm = ({ onRegister }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [role, setRole] = useState<'admin' | 'instructor' | 'student'>('student');

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const existingData = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (existingData.some((user: UserData) => user.email === email)) {
        toast.error("User already exists!");
        return;
      }

      // Check if we're creating the first admin
      const isFirstAdmin = role === 'admin' && !existingData.some((user: UserData) => user.role === 'admin');

      const userData: UserData = {
        email: isFirstAdmin ? 'admin@academy.com' : email,
        password: isFirstAdmin ? 'admin123' : password,
        role,
        name,
        approved: role === 'admin', // Admin users are auto-approved
        ...(role === 'student' && {
          github,
          linkedin,
          whatsapp,
          college,
          course,
        }),
      };

      if (isFirstAdmin) {
        toast.success("Default admin credentials set!");
      }

      existingData.push(userData);
      localStorage.setItem('users', JSON.stringify(existingData));
      
      if (role === 'admin') {
        toast.success("Admin registration successful! You can login now.");
        onRegister(userData);
      } else {
        toast.success("Registration successful! Waiting for admin approval.");
        // Redirect to login without auto-login for non-admin users
      }
    } catch (error) {
      toast.error("An error occurred!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegistration} className="space-y-4">
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
                variant={role === 'instructor' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setRole('instructor')}
              >
                <UserCog className="w-4 h-4 mr-2" />
                Instructor
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
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="GitHub Profile URL"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="LinkedIn Profile URL"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="WhatsApp Number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="College Name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Course/Branch"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  />
                </div>
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
            <Button type="submit" className="w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
