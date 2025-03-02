
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CheckCircle, XCircle } from 'lucide-react';
import { AttendanceRecord } from './types';

interface StudentCalendarViewProps {
  records: AttendanceRecord[];
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export const StudentCalendarView = ({ 
  records,
  selectedMonth,
  setSelectedMonth
}: StudentCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getPresentDates = () => {
    return records
      .filter(r => r.present)
      .map(r => new Date(r.date));
  };

  const getAbsentDates = () => {
    return records
      .filter(r => !r.present)
      .map(r => new Date(r.date));
  };

  const getRecordsForDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return records.filter(r => r.date === formattedDate);
  };

  return (
    <div className="border border-indigo-100 rounded-lg overflow-hidden bg-white">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md"
        onMonthChange={setSelectedMonth}
        defaultMonth={selectedMonth}
        modifiers={{
          present: getPresentDates(),
          absent: getAbsentDates()
        }}
        modifiersClassNames={{
          present: "bg-green-100 font-bold text-green-700",
          absent: "bg-red-100 font-bold text-red-700"
        }}
      />
      
      {selectedDate && (
        <div className="p-4 border-t border-indigo-100">
          <h5 className="font-medium text-gray-700">
            {format(selectedDate, "MMMM d, yyyy")}
          </h5>
          {(() => {
            const dateRecords = getRecordsForDate(selectedDate);
            
            if (dateRecords.length === 0) {
              return (
                <p className="text-sm text-gray-500 italic mt-1">No sessions on this day</p>
              );
            }
            
            return (
              <div className="mt-2 space-y-2">
                {dateRecords.map((record, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    {record.present ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      {record.sessionName || 'Regular Session'}: 
                      <span className={record.present ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                        {record.present ? 'Present' : 'Absent'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
