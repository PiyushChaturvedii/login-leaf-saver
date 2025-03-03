
/**
 * AdminFees component - Main page for fees management
 * Shows a list of all students with their fee details
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { StudentFeeCard } from './fees/StudentFeeCard';
import { UserData } from './fees/FeesTypes';

export const AdminFees = () => {
  const students = JSON.parse(localStorage.getItem('users') || '[]')
    .filter((user: UserData) => user.role === 'student');

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full">
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Fees Management</h1>
      </div>
      
      <Card className="bg-white shadow-md border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-gray-800">Student Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {students.map((student: UserData) => (
              <StudentFeeCard 
                key={student.email} 
                student={student} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
