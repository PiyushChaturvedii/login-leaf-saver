
import { useState } from 'react';
import { LogIn, UserPlus, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface UserData {
  email: string;
  password: string;
}

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData: UserData = { email, password };
    
    try {
      // Save to local storage as JSON
      const existingData = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (!isLogin) {
        // Registration
        if (existingData.some((user: UserData) => user.email === email)) {
          toast.error("User already exists!");
          return;
        }
        existingData.push(userData);
        localStorage.setItem('users', JSON.stringify(existingData));
        toast.success("Registration successful!");
      } else {
        // Login
        if (existingData.some((user: UserData) => 
          user.email === email && user.password === password
        )) {
          toast.success("Login successful!");
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
            <Lock className="w-6 h-6 text-gray-700" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 text-sm">
            {isLogin ? 'Sign in to access your account' : 'Register for a new account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
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
