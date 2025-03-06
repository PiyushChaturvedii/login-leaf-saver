
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Attendance, 
  AttendanceCode,
} from '../types';
import { 
  getStudentAttendanceStats,
  getOverallStats,
  getSessionsForDate,
  getDaysWithSessions,
  isDateInMonth
} from '../utils';
import { 
  AttendanceContextType, 
  AttendanceProviderProps 
} from './types';
import {
  getAllStudentEmails,
  getAttendanceId,
  saveAttendances,
  loadAttendances,
  saveAttendanceCode,
  removeAttendanceCode,
  loadAttendanceCode,
  generateNewAttendanceCode
} from './attendanceUtils';

export const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({ 
  children,
  isInstructor,
  userEmail
}) => {
  const [attendanceCode, setAttendanceCode] = useState<AttendanceCode | null>(null);
  const [submittedCode, setSubmittedCode] = useState('');
  const [attendances, setAttendances] = useState<Attendance[]>(loadAttendances());
  const [sessionDate, setSessionDate] = useState<Date | undefined>(new Date());
  const [sessionName, setSessionName] = useState('');
  const [timeLeft, setTimeLeft] = useState<{minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    // Load attendance code from localStorage
    const parsedCode = loadAttendanceCode();
    if (parsedCode && Date.now() < parsedCode.expiresAt) {
      setAttendanceCode(parsedCode);
    } else if (parsedCode) {
      removeAttendanceCode();
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
          removeAttendanceCode();
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

    const newCode = generateNewAttendanceCode(sessionDate, sessionName);
    if (!newCode) {
      toast.error('Failed to generate attendance code');
      return;
    }
    
    setAttendanceCode(newCode);
    saveAttendanceCode(newCode);
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
      sessionName: attendanceCode.sessionName,
      status: "present"
    };

    const updatedAttendances = [...attendances, newAttendance];
    saveAttendances(updatedAttendances);
    setAttendances(updatedAttendances);
    setSubmittedCode('');
    toast.success('Attendance submitted successfully!');
  };

  const handleDeleteAttendance = (id: string) => {
    if (!isInstructor) return;
    
    const updatedAttendances = attendances.filter(a => a.id !== id);
    saveAttendances(updatedAttendances);
    setAttendances(updatedAttendances);
    toast.success('Attendance record deleted!');
  };

  const handleEditAttendance = (id: string, studentEmail: string, status: "present" | "absent" | "leave") => {
    if (!isInstructor) return;
    
    if (status === "absent") {
      // If marking absent, find the attendance and remove it
      const updatedAttendances = attendances.filter(a => a.id !== id);
      saveAttendances(updatedAttendances);
      setAttendances(updatedAttendances);
    } else {
      // If marking present or leave, update or add a new record
      const attendance = attendances.find(a => a.id === id);
      if (!attendance) {
        // Record not found, might be an absent record, create new
        const existingRecordForDate = attendances.find(
          a => a.studentEmail === studentEmail && 
          (a.id === id || (a.date === sessionDate?.toISOString().split('T')[0] && 
                          (a.sessionName === sessionName || (!a.sessionName && !sessionName))))
        );
        
        const dateToUse = existingRecordForDate?.date || 
                         (sessionDate ? format(sessionDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0]);
        const sessionToUse = existingRecordForDate?.sessionName || sessionName;
        
        const newAttendance: Attendance = {
          id: Date.now().toString(),
          studentEmail,
          code: 'MANUAL',
          submittedAt: new Date().toISOString(),
          date: dateToUse,
          sessionName: sessionToUse,
          status
        };
        
        const updatedAttendances = [...attendances, newAttendance];
        saveAttendances(updatedAttendances);
        setAttendances(updatedAttendances);
      } else {
        // Update existing record
        const updatedAttendances = attendances.map(a => 
          a.id === id ? { ...a, status } : a
        );
        saveAttendances(updatedAttendances);
        setAttendances(updatedAttendances);
      }
    }
    
    toast.success('Attendance record updated!');
  };

  const handleManualAttendance = (studentEmail: string, date: string, sessionName?: string, status: "present" | "absent" | "leave" = "present") => {
    if (!isInstructor) return;
    
    if (status === "absent") {
      // For absent status, find and remove the record if it exists
      const recordId = getAttendanceIdHelper(studentEmail, date, sessionName);
      if (recordId) {
        const updatedAttendances = attendances.filter(a => a.id !== recordId);
        saveAttendances(updatedAttendances);
        setAttendances(updatedAttendances);
      }
      toast.success('Attendance marked as absent');
      return;
    }
    
    // Check if record exists
    const existingRecord = attendances.find(
      a => a.studentEmail === studentEmail && 
           a.date === date && 
           ((!sessionName && !a.sessionName) || (a.sessionName === sessionName))
    );
    
    if (existingRecord) {
      // Update existing record
      const updatedAttendances = attendances.map(a => 
        a.id === existingRecord.id ? { ...a, status } : a
      );
      saveAttendances(updatedAttendances);
      setAttendances(updatedAttendances);
    } else {
      // Create new record
      const newAttendance: Attendance = {
        id: Date.now().toString(),
        studentEmail,
        code: 'MANUAL',
        submittedAt: new Date().toISOString(),
        date,
        sessionName,
        status
      };
      
      const updatedAttendances = [...attendances, newAttendance];
      saveAttendances(updatedAttendances);
      setAttendances(updatedAttendances);
    }
    
    toast.success(`Attendance marked as ${status}`);
  };

  // Helper function to find an attendance ID for a specific record
  const getAttendanceIdHelper = (email: string, date: string, sessionName?: string): string => {
    return getAttendanceId(email, date, sessionName, attendances);
  };

  const getStudentStats = (email: string) => {
    return getStudentAttendanceStats(email, attendances);
  };

  const getDaysWithSessionsData = () => {
    return getDaysWithSessions(attendances);
  };

  const getSessionsForDateData = (date: Date) => {
    return getSessionsForDate(date, attendances);
  };

  const isDateInMonthCheck = (date: Date, month: Date) => {
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
    getAttendanceId: getAttendanceIdHelper,
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
