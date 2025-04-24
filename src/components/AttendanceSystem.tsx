
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { AttendanceProps } from './attendance/types';
import { StudentDisplay } from './attendance/StudentDisplay';
import { InstructorDisplay } from './attendance/InstructorDisplay';
import { AttendanceProvider } from './attendance/context/AttendanceProvider';

export const AttendanceSystem = ({ isInstructor, userEmail }: AttendanceProps) => {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <AttendanceProvider isInstructor={isInstructor} userEmail={userEmail}>
        <Card className="p-4 md:p-6 bg-white shadow-lg rounded-xl border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
          {/* Add dashboard navigation button */}
          <div className="flex items-center mb-4 md:mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="mr-2 rounded-full hover:bg-indigo-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-indigo-600" />
                <span className="sr-only">Back to Dashboard</span>
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Attendance System</h1>
          </div>

          <div className="animate-fade-in">
            {isInstructor ? (
              <InstructorDisplay />
            ) : (
              userEmail && <StudentDisplay />
            )}
          </div>
        </Card>
      </AttendanceProvider>
    </div>
  );
};
