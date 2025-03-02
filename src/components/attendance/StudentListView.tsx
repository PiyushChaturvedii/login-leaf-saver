
import { CheckCircle, XCircle } from 'lucide-react';
import { AttendanceRecord } from './types';

interface StudentListViewProps {
  records: AttendanceRecord[];
}

export const StudentListView = ({ records }: StudentListViewProps) => {
  return (
    <div className="border border-indigo-100 rounded-lg overflow-hidden">
      <div className="text-xs font-medium bg-gray-100 p-2 grid grid-cols-4">
        <div className="col-span-1">Date</div>
        <div className="col-span-2">Session</div>
        <div className="text-center">Status</div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {records.map((record, idx) => (
          <div 
            key={idx} 
            className={`text-sm grid grid-cols-4 p-2 border-b border-gray-100 ${
              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <div className="col-span-1">{new Date(record.date).toLocaleDateString()}</div>
            <div className="col-span-2">{record.sessionName || 'Regular Session'}</div>
            <div className="text-center">
              {record.present ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">Present</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-red-600">Absent</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {records.length === 0 && (
          <div className="text-sm text-gray-500 italic p-4 text-center">
            No attendance records found
          </div>
        )}
      </div>
    </div>
  );
};
