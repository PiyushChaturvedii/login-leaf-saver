
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { StudentRecordItem } from './StudentRecordItem';
import { StudentStats } from './types';

interface StudentDetailViewProps {
  studentEmail: string;
  stats: StudentStats;
  handleManualAttendance: (email: string, date: string, sessionName?: string) => void;
  handleEditAttendance: (id: string, email: string, present: boolean) => void;
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
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
          onClick={() => handleManualAttendance(
            studentEmail, 
            sessionDate ? format(sessionDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0], 
            sessionName || undefined
          )}
        >
          Mark Present
        </Button>
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
