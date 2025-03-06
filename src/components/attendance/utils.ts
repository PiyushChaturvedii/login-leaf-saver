
import { format } from "date-fns";
import { 
  Attendance, 
  AttendanceRecord,
  StudentStats
} from './types';

// Get all attendance records for a specific student
export const getAttendanceRecords = (email: string, attendances: Attendance[]): AttendanceRecord[] => {
  // Get all unique sessions from attendances
  const allSessions = Array.from(
    new Set(
      attendances.map(a => `${a.date}${a.sessionName ? '-' + a.sessionName : ''}`)
    )
  );
  
  // Create a record for each date
  return allSessions.map(sessionKey => {
    const [date, sessionName] = sessionKey.includes('-') 
      ? sessionKey.split('-')
      : [sessionKey, undefined];
    
    const studentAttendance = attendances.find(
      a => a.studentEmail === email && 
      a.date === date && 
      (sessionName === undefined || a.sessionName === sessionName)
    );
    
    const present = !!studentAttendance && (!studentAttendance.status || studentAttendance.status === "present");
    const leave = !!studentAttendance && studentAttendance.status === "leave";
    
    return {
      date,
      sessionName,
      present,
      leave
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Calculate attendance statistics for a student
export const getStudentAttendanceStats = (email: string, attendances: Attendance[]): StudentStats => {
  const records = getAttendanceRecords(email, attendances);
  const totalSessions = records.length;
  const attended = records.filter(r => r.present).length;
  const leaves = records.filter(r => r.leave).length;
  
  // Calculate percentage based on attended sessions (leaves don't count as present but also don't count against attendance)
  const percentage = totalSessions > 0 
    ? Math.round((attended / (totalSessions - leaves)) * 100) 
    : 0;
  
  return { 
    totalSessions, 
    attended,
    leaves,
    percentage,
    records
  };
};

// Calculate overall attendance stats for all students
export const getOverallStats = (allStudents: string[], attendances: Attendance[]) => {
  if (allStudents.length === 0) return { averageAttendance: 0, totalSessions: 0, studentsCount: 0 };
  
  const stats = allStudents.map(email => getStudentAttendanceStats(email, attendances));
  const totalPercentages = stats.reduce((sum, stat) => sum + stat.percentage, 0);
  const avgPercentage = Math.round(totalPercentages / allStudents.length);
  
  // Find total unique sessions
  const allSessions = Array.from(
    new Set(
      attendances.map(a => `${a.date}${a.sessionName ? '-' + a.sessionName : ''}`)
    )
  );
  
  return { 
    averageAttendance: avgPercentage,
    totalSessions: allSessions.length,
    studentsCount: allStudents.length
  };
};

// Get all sessions on a specific date
export const getSessionsForDate = (date: Date, attendances: Attendance[]) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return Array.from(
    new Set(
      attendances
        .filter(a => a.date === formattedDate)
        .map(a => a.sessionName || 'Regular Session')
    )
  );
};

// Get all dates that have sessions
export const getDaysWithSessions = (attendances: Attendance[]) => {
  const days = new Set();
  attendances.forEach(attendance => {
    days.add(attendance.date);
  });
  return Array.from(days).map(day => new Date(day as string));
};

// Check if a date is in a specific month
export const isDateInMonth = (date: Date, month: Date) => {
  return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
};
