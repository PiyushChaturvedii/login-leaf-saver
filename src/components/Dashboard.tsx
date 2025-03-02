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
        <h1 className="text-3xl font-bold">Academy Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <WelcomeMessage name={user.name} role={user.role} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {isStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>View and update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <User className="w-12 h-12 text-primary mx-auto" />
            </CardContent>
            <CardFooter>
              <Link to="/student-profile" className="w-full">
                <Button className="w-full">View Profile</Button>
              </Link>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>Manage course attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar className="w-12 h-12 text-primary mx-auto" />
          </CardContent>
          <CardFooter>
            <Link to="/attendance" className="w-full">
              <Button className="w-full">
                {isInstructor ? "Take Attendance" : "View Attendance"}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {(isAdmin || isStudent) && (
          <Card>
            <CardHeader>
              <CardTitle>Fees & Payments</CardTitle>
              <CardDescription>Manage payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <CreditCard className="w-12 h-12 text-primary mx-auto" />
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>Coming Soon</Button>
            </CardFooter>
          </Card>
        )}

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage students and instructors</CardDescription>
            </CardHeader>
            <CardContent>
              <Users className="w-12 h-12 text-primary mx-auto" />
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>Coming Soon</Button>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Course Materials</CardTitle>
            <CardDescription>Access study materials and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <BookOpen className="w-12 h-12 text-primary mx-auto" />
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>Coming Soon</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
