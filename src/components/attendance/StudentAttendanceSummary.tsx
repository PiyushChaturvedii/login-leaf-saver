
import React from 'react';
import { StudentStats } from "./types";

interface StudentAttendanceSummaryProps {
  stats: StudentStats;
}

export const StudentAttendanceSummary: React.FC<StudentAttendanceSummaryProps> = ({ stats }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-700">{stats.attended}</div>
          <div className="text-xs text-green-600">Present</div>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-700">{stats.leaves || 0}</div>
          <div className="text-xs text-amber-600">Leaves</div>
        </div>
        
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-700">
            {stats.totalSessions - stats.attended - (stats.leaves || 0)}
          </div>
          <div className="text-xs text-red-600">Absent</div>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-50 p-3 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Attendance Summary</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span>Total Sessions:</span>
            <span className="font-medium">{stats.totalSessions}</span>
          </li>
          <li className="flex justify-between">
            <span>Present Count:</span>
            <span className="font-medium text-green-600">{stats.attended}</span>
          </li>
          <li className="flex justify-between">
            <span>Leave Count:</span>
            <span className="font-medium text-amber-600">{stats.leaves || 0}</span>
          </li>
          <li className="flex justify-between">
            <span>Absent Count:</span>
            <span className="font-medium text-red-600">
              {stats.totalSessions - stats.attended - (stats.leaves || 0)}
            </span>
          </li>
          <li className="flex justify-between pt-2 border-t">
            <span>Attendance Percentage:</span>
            <span className="font-medium text-blue-600">{stats.percentage}%</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
