
import { format } from 'date-fns';
import { Attendance } from '../types';

// Get all student emails (from users who are students)
export const getAllStudentEmails = (): string[] => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users
    .filter((user: any) => user.role === 'student')
    .map((user: any) => user.email);
};

// Find an attendance ID for a specific record
export const getAttendanceId = (
  email: string, 
  date: string, 
  sessionName: string | undefined, 
  attendances: Attendance[]
): string => {
  const attendance = attendances.find(
    a => a.studentEmail === email && 
    a.date === date && 
    ((!sessionName && !a.sessionName) || a.sessionName === sessionName)
  );
  return attendance?.id || '';
};

// Save attendance records to localStorage
export const saveAttendances = (attendances: Attendance[]): void => {
  localStorage.setItem('attendances', JSON.stringify(attendances));
};

// Load attendance records from localStorage
export const loadAttendances = (): Attendance[] => {
  return JSON.parse(localStorage.getItem('attendances') || '[]');
};

// Save attendance code to localStorage
export const saveAttendanceCode = (code: any): void => {
  localStorage.setItem('attendanceCode', JSON.stringify(code));
};

// Remove attendance code from localStorage
export const removeAttendanceCode = (): void => {
  localStorage.removeItem('attendanceCode');
};

// Load attendance code from localStorage
export const loadAttendanceCode = (): any => {
  const savedCode = localStorage.getItem('attendanceCode');
  if (savedCode) {
    return JSON.parse(savedCode);
  }
  return null;
};

// Generate new attendance code
export const generateNewAttendanceCode = (
  sessionDate: Date | undefined, 
  sessionName: string
): { code: string; expiresAt: number; date: string; sessionName?: string } | null => {
  if (!sessionDate) {
    return null;
  }
  
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  return { 
    code, 
    expiresAt,
    date: format(sessionDate, 'yyyy-MM-dd'),
    sessionName: sessionName || undefined
  };
};
