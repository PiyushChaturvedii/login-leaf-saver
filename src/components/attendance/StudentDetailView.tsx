
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { StudentRecordItem } from './StudentRecordItem';
import { StudentStats } from './types';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface StudentDetailViewProps {
  studentEmail: string;
  stats: StudentStats;
  handleManualAttendance: (email: string, date: string, sessionName?: string, status?: "present" | "absent" | "leave") => void;
  handleEditAttendance: (id: string, email: string, status: "present" | "absent" | "leave") => void;
  sessionDate: Date | undefined;
  sessionName: string;
  getAttendanceId: (email: string, date: string, sessionName?: string) => string;
}

export const StudentDetailView = ({
  studentEmail,
  stats,
  handleManualAttendance,
  handleEditAttendance,
  sessionDate,
  sessionName,
  getAttendanceId
}: StudentDetailViewProps) => {
  return (
    <div className="mt-6 border border-indigo-100 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-medium">{studentEmail}</h4>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-600">
              Attendance: {stats.percentage}%
            </span>
            <Progress 
              value={stats.percentage} 
              className="h-2 w-28 ml-2" 
            />
          </div>
          <div className="flex mt-1 text-xs text-gray-500">
            <span className="mr-3">Present: {stats.attended}</span>
            <span className="mr-3">Leaves: {stats.leaves || 0}</span>
            <span>Total: {stats.totalSessions}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50"
            onClick={() => handleManualAttendance(
              studentEmail, 
              sessionDate ? format(sessionDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0], 
              sessionName || undefined,
              "present"
            )}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Present
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-amber-600 border-amber-200 hover:bg-amber-50"
            onClick={() => handleManualAttendance(
              studentEmail, 
              sessionDate ? format(sessionDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0], 
              sessionName || undefined,
              "leave"
            )}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Leave
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => handleManualAttendance(
              studentEmail, 
              sessionDate ? format(sessionDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0], 
              sessionName || undefined,
              "absent"
            )}
          >
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden border border-gray-100 rounded-lg">
        <div className="text-xs font-medium bg-gray-100 p-2 grid grid-cols-6">
          <div className="col-span-2">Date</div>
          <div className="col-span-3">Session</div>
          <div className="text-center">Status</div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {stats.records.map((record, idx) => (
            <StudentRecordItem
              key={idx}
              date={record.date}
              sessionName={record.sessionName}
              present={record.present}
              leave={record.leave}
              recordId={getAttendanceId(studentEmail, record.date, record.sessionName)}
              studentEmail={studentEmail}
              onEditAttendance={handleEditAttendance}
            />
          ))}
          
          {stats.records.length === 0 && (
            <div className="text-sm text-gray-500 italic p-3 text-center">No attendance records found</div>
          )}
        </div>
      </div>
    </div>
  );
};
