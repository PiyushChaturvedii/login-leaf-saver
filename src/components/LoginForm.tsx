
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface LoginFormProps {
  onLogin: (user: any) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("Attempting login with:", email, password);
      
      // Check if this is the admin
      if (email === 'admin@academy.com' && password === 'admin123') {
        console.log("Admin login detected");
        
        // Set admin user details
        const adminUser = {
          email: 'admin@academy.com',
          name: 'Admin',
          role: 'admin',
        };
        
        toast.success("Admin login successful!");
        onLogin(adminUser);
        return;
      }
      
      // For non-admin users, check the stored users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log("Retrieved users:", users);
      
      const user = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (user) {
        console.log("Found user:", user);
        
        // Admin users can bypass the approval check
        if (!user.approved && user.role !== 'admin') {
          toast.error("Your account is pending admin approval!");
          return;
        }

        const userData = {
          email: user.email,
          name: user.name,
          role: user.role,
          github: user.github,
          linkedin: user.linkedin,
          whatsapp: user.whatsapp,
          college: user.college,
          course: user.course,
          photo: user.photo,
        };

        toast.success("Login successful!");
        onLogin(userData);
      } else {
        console.log("No matching user found");
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-gray-600 mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
