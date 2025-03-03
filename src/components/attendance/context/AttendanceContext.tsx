
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Attendance, 
  AttendanceCode,
  StudentStats,
  AttendanceRecord
} from '../types';
import { 
  getStudentAttendanceStats,
  getOverallStats,
  getSessionsForDate,
  getDaysWithSessions,
  isDateInMonth
} from '../utils';

interface AttendanceContextType {
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

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

interface AttendanceProviderProps {
  children: React.ReactNode;
  isInstructor: boolean;
  userEmail?: string;
}

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({ 
  children,
  isInstructor,
  userEmail
}) => {
  const [attendanceCode, setAttendanceCode] = useState<AttendanceCode | null>(null);
  const [submittedCode, setSubmittedCode] = useState('');
  const [attendances, setAttendances] = useState<Attendance[]>(
    JSON.parse(localStorage.getItem('attendances') || '[]')
  );
  const [sessionDate, setSessionDate] = useState<Date | undefined>(new Date());
  const [sessionName, setSessionName] = useState('');
  const [timeLeft, setTimeLeft] = useState<{minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    // Load attendance code from localStorage
    const savedCode = localStorage.getItem('attendanceCode');
    if (savedCode) {
      const parsedCode = JSON.parse(savedCode);
      if (Date.now() < parsedCode.expiresAt) {
        setAttendanceCode(parsedCode);
      } else {
        localStorage.removeItem('attendanceCode');
      }
    }

    // Set timer for countdown
    if (attendanceCode && Date.now() < attendanceCode.expiresAt) {
      const timer = setInterval(() => {
        const now = Date.now();
        if (now < attendanceCode.expiresAt) {
          const remaining = attendanceCode.expiresAt - now;
          const minutes = Math.floor(remaining / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeLeft({ minutes, seconds });
        } else {
          setTimeLeft(null);
          setAttendanceCode(null);
          localStorage.removeItem('attendanceCode');
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [attendanceCode]);

  const generateAttendanceCode = () => {
    if (!sessionDate) {
      toast.error('Please select a date for the session');
      return;
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    const newCode = { 
      code, 
      expiresAt,
      date: format(sessionDate, 'yyyy-MM-dd'),
      sessionName: sessionName || undefined
    };
    setAttendanceCode(newCode);
    localStorage.setItem('attendanceCode', JSON.stringify(newCode));
    toast.success('Attendance code generated! Valid for 5 minutes');
  };

  const submitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !attendanceCode) return;

    if (submittedCode !== attendanceCode.code) {
      toast.error('Invalid attendance code!');
      return;
    }

    if (Date.now() > attendanceCode.expiresAt) {
      toast.error('Attendance code has expired!');
      return;
    }

    // Check if student has already submitted attendance for this session
    const alreadySubmitted = attendances.some(
      a => a.studentEmail === userEmail && a.date === attendanceCode.date
    );

    if (alreadySubmitted) {
      toast.error('You have already submitted attendance for this session!');
      return;
    }

    const newAttendance: Attendance = {
      id: Date.now().toString(),
      studentEmail: userEmail,
      code: submittedCode,
      submittedAt: new Date().toISOString(),
      date: attendanceCode.date,
      sessionName: attendanceCode.sessionName
    };

    const updatedAttendances = [...attendances, newAttendance];
    localStorage.setItem('attendances', JSON.stringify(updatedAttendances));
    setAttendances(updatedAttendances);
    setSubmittedCode('');
    toast.success('Attendance submitted successfully!');
  };

  const handleDeleteAttendance = (id: string) => {
    if (!isInstructor) return;
    
    const updatedAttendances = attendances.filter(a => a.id !== id);
    localStorage.setItem('attendances', JSON.stringify(updatedAttendances));
    setAttendances(updatedAttendances);
    toast.success('Attendance record deleted!');
  };

  const handleEditAttendance = (id: string, studentEmail: string, present: boolean) => {
    if (!isInstructor) return;
    
    if (present) {
      // If marking present, find the attendance and remove it
      const updatedAttendances = attendances.filter(a => a.id !== id);
      localStorage.setItem('attendances', JSON.stringify(updatedAttendances));
      setAttendances(updatedAttendances);
    } else {
      // If marking absent, add a new attendance record
      const attendance = attendances.find(a => a.id === id);
      if (!attendance) return;
      
      const newAttendance: Attendance = {
        id: Date.now().toString(),
        studentEmail,
        code: 'MANUAL',
        submittedAt: new Date().toISOString(),
        date: attendance.date,
        sessionName: attendance.sessionName
      };
      
      const updatedAttendances = [...attendances, newAttendance];
      localStorage.setItem('attendances', JSON.stringify(updatedAttendances));
      setAttendances(updatedAttendances);
    }
    toast.success('Attendance record updated!');
  };

  const handleManualAttendance = (studentEmail: string, date: string, sessionName?: string) => {
    if (!isInstructor) return;
    
    const newAttendance: Attendance = {
      id: Date.now().toString(),
      studentEmail,
      code: 'MANUAL',
      submittedAt: new Date().toISOString(),
      date,
      sessionName
    };
    
    const updatedAttendances = [...attendances, newAttendance];
    localStorage.setItem('attendances', JSON.stringify(updatedAttendances));
    setAttendances(updatedAttendances);
    toast.success('Manual attendance recorded!');
  };

  const getAllStudentEmails = () => {
    // Get all emails from users who are students
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users
      .filter((user: any) => user.role === 'student')
      .map((user: any) => user.email);
  };

  // Helper function to find an attendance ID for a specific record
  const getAttendanceId = (email: string, date: string, sessionName?: string): string => {
    const attendance = attendances.find(
      a => a.studentEmail === email && 
      a.date === date && 
      ((!sessionName && !a.sessionName) || a.sessionName === sessionName)
    );
    return attendance?.id || '';
  };

  const getStudentStats = (email: string): StudentStats => {
    return getStudentAttendanceStats(email, attendances);
  };

  const getDaysWithSessionsData = (): Date[] => {
    return getDaysWithSessions(attendances);
  };

  const getSessionsForDateData = (date: Date): string[] => {
    return getSessionsForDate(date, attendances);
  };

  const isDateInMonthCheck = (date: Date, month: Date): boolean => {
    return isDateInMonth(date, month);
  };

  const getOverallStatsData = () => {
    return getOverallStats(getAllStudentEmails(), attendances);
  };

  const value: AttendanceContextType = {
    attendances,
    attendanceCode,
    submittedCode,
    timeLeft,
    sessionDate,
    sessionName,
    setSubmittedCode,
    setSessionDate,
    setSessionName,
    generateAttendanceCode,
    submitAttendance,
    handleManualAttendance,
    handleEditAttendance,
    handleDeleteAttendance,
    getStudentStats,
    getAttendanceId,
    getAllStudentEmails,
    getDaysWithSessionsData,
    getSessionsForDateData,
    isDateInMonthCheck,
    getOverallStatsData
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
