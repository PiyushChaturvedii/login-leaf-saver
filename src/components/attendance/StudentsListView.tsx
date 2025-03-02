
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { StudentItem } from './StudentItem';
import { StudentDetailView } from './StudentDetailView';
import { format } from "date-fns";
import { StudentStats } from './types';

interface StudentsListViewProps {
  students: string[];
  getStudentStats: (email: string) => StudentStats;
  handleManualAttendance: (email: string, date: string, sessionName?: string) => void;
  handleEditAttendance: (id: string, email: string, present: boolean) => void;
  sessionDate: Date | undefined;
  sessionName: string;
  getAttendanceId: (email: string, date: string, sessionName?: string) => string;
}

export const StudentsListView = ({
  students,
  getStudentStats,
  handleManualAttendance,
  handleEditAttendance,
  sessionDate,
  sessionName,
  getAttendanceId
}: StudentsListViewProps) => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  
  return (
    <div className="space-y-4">
      {students.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic">
          No students found. Students need to register first.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {students.map(email => (
              <StudentItem
                key={email}
                email={email}
                stats={getStudentStats(email)}
                isSelected={selectedStudent === email}
                onSelect={() => setSelectedStudent(email)}
              />
            ))}
          </div>
          
          {selectedStudent && (
            <StudentDetailView
              studentEmail={selectedStudent}
              stats={getStudentStats(selectedStudent)}
              handleManualAttendance={handleManualAttendance}
              handleEditAttendance={handleEditAttendance}
              sessionDate={sessionDate}
              sessionName={sessionName}
              getAttendanceId={getAttendanceId}
            />
          )}
        </>
      )}
    </div>
  );
};
