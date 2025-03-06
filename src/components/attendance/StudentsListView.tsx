
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { StudentItem } from './StudentItem';
import { StudentDetailView } from './StudentDetailView';
import { format } from "date-fns";
import { StudentStats } from './types';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StudentsListViewProps {
  students: string[];
  getStudentStats: (email: string) => StudentStats;
  handleManualAttendance: (email: string, date: string, sessionName?: string, status?: "present" | "absent" | "leave") => void;
  handleEditAttendance: (id: string, email: string, status: "present" | "absent" | "leave") => void;
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
  const [showQuickButtons, setShowQuickButtons] = useState(true);
  
  const handleQuickMark = (email: string, status: "present" | "absent" | "leave") => {
    handleManualAttendance(
      email,
      sessionDate ? format(sessionDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
      sessionName || undefined,
      status
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center space-x-2">
          <Switch 
            id="quick-buttons" 
            checked={showQuickButtons} 
            onCheckedChange={setShowQuickButtons} 
          />
          <Label htmlFor="quick-buttons">Show Quick Attendance Buttons</Label>
        </div>
      </div>
      
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
                onQuickMark={handleQuickMark}
                showQuickButtons={showQuickButtons}
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
