
import React from 'react';
import { CalendarIcon } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { StudentStats } from "./types";

interface StudentAttendanceHeaderProps {
  stats: StudentStats;
}

export const StudentAttendanceHeader: React.FC<StudentAttendanceHeaderProps> = ({ stats }) => {
  return (
    <CardTitle className="flex items-center justify-between">
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-5 w-5" />
        <span>Attendance Details</span>
      </div>
      <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
        {stats.percentage}% Attendance
      </div>
    </CardTitle>
  );
};
