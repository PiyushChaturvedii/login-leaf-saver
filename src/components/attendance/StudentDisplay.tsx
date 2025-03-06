import { useState } from 'react';
import { StudentSubmissionForm } from './StudentSubmissionForm';
import { StudentCalendarView } from './StudentCalendarView';
import { useAttendance } from './context/useAttendance';
import { StudentAttendanceCard } from './StudentAttendanceCard';

export const StudentDisplay = () => {
  
  const { 
    attendanceCode, 
    submittedCode, 
    setSubmittedCode, 
    submitAttendance,
    getStudentStats
  } = useAttendance();
  
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // We assume userEmail is available in the context
  const userEmail = localStorage.getItem('currentUser') 
    ? JSON.parse(localStorage.getItem('currentUser')!).email
    : '';
  
  const studentStats = getStudentStats(userEmail);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <StudentSubmissionForm 
            submittedCode={submittedCode}
            setSubmittedCode={setSubmittedCode}
            onSubmit={submitAttendance}
          />
          <StudentCalendarView 
            stats={studentStats}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
        <div>
          <StudentAttendanceCard 
            studentEmail={userEmail}
            stats={studentStats}
          />
        </div>
      </div>
    </div>
  );
};
