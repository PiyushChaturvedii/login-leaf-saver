
import React from 'react';
import { format } from "date-fns";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { StudentStats } from "./types";

interface StudentAttendanceListViewProps {
  stats: StudentStats;
}

export const StudentAttendanceListView: React.FC<StudentAttendanceListViewProps> = ({ stats }) => {
  const getStatusIcon = (present: boolean, leave?: boolean) => {
    if (leave) return <RefreshCw className="w-4 h-4 text-amber-500" />;
    if (present) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };
  
  const getStatusClass = (present: boolean, leave?: boolean) => {
    if (leave) return "bg-amber-100 text-amber-800";
    if (present) return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2">
        All attendance records listed chronologically
      </div>
      
      <div className="overflow-hidden border rounded-md">
        <div className="bg-gray-100 py-2 px-3 text-xs font-semibold grid grid-cols-12">
          <div className="col-span-3">Date</div>
          <div className="col-span-5">Session</div>
          <div className="col-span-4 text-center">Status</div>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          {stats.records.map((record, index) => (
            <div key={index} className="py-2 px-3 border-t text-sm grid grid-cols-12 items-center">
              <div className="col-span-3">
                {format(new Date(record.date), 'dd/MM/yyyy')}
              </div>
              <div className="col-span-5 truncate" title={record.sessionName || 'Regular Session'}>
                {record.sessionName || 'Regular Session'}
              </div>
              <div className="col-span-4 flex justify-center">
                <span className={`px-2 py-0.5 rounded-full flex items-center text-xs ${getStatusClass(record.present, record.leave)}`}>
                  {getStatusIcon(record.present, record.leave)}
                  <span className="ml-1">
                    {record.leave ? 'Leave' : (record.present ? 'Present' : 'Absent')}
                  </span>
                </span>
              </div>
            </div>
          ))}
          
          {stats.records.length === 0 && (
            <div className="py-4 text-center text-gray-500 italic">
              No attendance records found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
