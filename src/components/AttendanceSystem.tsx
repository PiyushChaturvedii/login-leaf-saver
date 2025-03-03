
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { AttendanceProps } from './attendance/types';
import { StudentDisplay } from './attendance/StudentDisplay';
import { InstructorDisplay } from './attendance/InstructorDisplay';
import { AttendanceProvider } from './attendance/context/AttendanceContext';

export const AttendanceSystem = ({ isInstructor, userEmail }: AttendanceProps) => {
  return (
    <AttendanceProvider isInstructor={isInstructor} userEmail={userEmail}>
      <Card className="p-6 bg-white shadow-lg rounded-xl border-indigo-100">
        {/* Add dashboard navigation button */}
        <div className="flex items-center mb-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2 rounded-full">
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Attendance System</h1>
        </div>

        {isInstructor ? (
          <InstructorDisplay />
        ) : (
          userEmail && <StudentDisplay />
        )}
      </Card>
    </AttendanceProvider>
  );
};
