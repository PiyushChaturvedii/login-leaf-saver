
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Users, Calendar, CreditCard, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WelcomeMessage } from './WelcomeMessage';

interface DashboardProps {
  onLogout: () => void;
  user: {
    name: string;
    role: string;
    email: string;
  };
}

export const Dashboard = ({ onLogout, user }: DashboardProps) => {
  const isAdmin = user.role === 'admin';
  const isInstructor = user.role === 'instructor';
  const isStudent = user.role === 'student';

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Academy Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <WelcomeMessage userName={user.name} userRole={user.role} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {isStudent && (
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>View and update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <User className="w-12 h-12 text-indigo-600 mx-auto" />
            </CardContent>
            <CardFooter>
              <Link to="/student-profile" className="w-full">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">View Profile</Button>
              </Link>
            </CardFooter>
          </Card>
        )}

        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardTitle>Attendance</CardTitle>
            <CardDescription>Manage course attendance</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto" />
          </CardContent>
          <CardFooter>
            <Link to="/attendance" className="w-full">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                {isInstructor || isAdmin ? "Take Attendance" : "View Attendance"}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {(isAdmin || isStudent) && (
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle>Fees & Payments</CardTitle>
              <CardDescription>Manage payment information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CreditCard className="w-12 h-12 text-green-600 mx-auto" />
            </CardContent>
            <CardFooter>
              <Link to="/fees" className="w-full">
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">{isAdmin ? "Manage Fees" : "View Payments"}</Button>
              </Link>
            </CardFooter>
          </Card>
        )}

        {isAdmin && (
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage students and instructors</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-purple-600 mx-auto" />
            </CardContent>
            <CardFooter>
              <Link to="/user-management" className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Manage Users</Button>
              </Link>
            </CardFooter>
          </Card>
        )}

        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardTitle>Course Materials</CardTitle>
            <CardDescription>Access study materials and resources</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <BookOpen className="w-12 h-12 text-amber-600 mx-auto" />
          </CardContent>
          <CardFooter>
            <Link to="/course-materials" className="w-full">
              <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">Access Materials</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
