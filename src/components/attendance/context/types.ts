
import { Attendance, AttendanceCode, StudentStats } from '../types';

export interface AttendanceContextType {
  // State
  attendances: Attendance[];
  attendanceCode: AttendanceCode | null;
  submittedCode: string;
  timeLeft: { minutes: number, seconds: number } | null;
  sessionDate: Date | undefined;
  sessionName: string;
  
  // Setters
  setSubmittedCode: (code: string) => void;
  setSessionDate: (date: Date | undefined) => void;
  setSessionName: (name: string) => void;
  
  // Actions
  generateAttendanceCode: () => void;
  submitAttendance: (e: React.FormEvent) => void;
  handleManualAttendance: (studentEmail: string, date: string, sessionName?: string) => void;
  handleEditAttendance: (id: string, studentEmail: string, present: boolean) => void;
  handleDeleteAttendance: (id: string) => void;
  
  // Helpers
  getStudentStats: (email: string) => StudentStats;
  getAttendanceId: (email: string, date: string, sessionName?: string) => string;
  getAllStudentEmails: () => string[];
  getDaysWithSessionsData: () => Date[];
  getSessionsForDateData: (date: Date) => string[];
  isDateInMonthCheck: (date: Date, month: Date) => boolean;
  getOverallStatsData: () => { averageAttendance: number, totalSessions: number, studentsCount: number };
}

export interface AttendanceProviderProps {
  children: React.ReactNode;
  isInstructor: boolean;
  userEmail?: string;
}
