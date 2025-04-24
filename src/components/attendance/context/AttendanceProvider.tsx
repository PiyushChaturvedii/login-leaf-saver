
import React, { createContext, useState, useEffect } from 'react';
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
  loadAttendanceCode,
  removeAttendanceCode,
  saveAttendanceCode,
  generateNewAttendanceCode
} from './attendanceUtils';
import {
  loadAndValidateAttendanceCode,
  setupCodeTimer
} from './attendanceCodeUtils';
import {
  submitAttendance,
  manageAttendanceRecords
} from './attendanceActions';

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
    loadAndValidateAttendanceCode(setAttendanceCode);
    
    // Return cleanup function from the timer setup
    return setupCodeTimer(attendanceCode, setTimeLeft, setAttendanceCode);
  }, [attendanceCode]);

  const generateAttendanceCode = () => {
    if (!sessionDate) {
      console.error("Cannot generate code: Session date is undefined");
      return;
    }

    const newCode = generateNewAttendanceCode(sessionDate, sessionName);
    if (!newCode) {
      console.error("Failed to generate attendance code");
      return;
    }
    
    setAttendanceCode(newCode);
    saveAttendanceCode(newCode);
    console.log("Generated attendance code:", newCode);
  };

  const handleSubmitAttendance = (e: React.FormEvent) => {
    submitAttendance(
      e,
      userEmail,
      attendanceCode,
      submittedCode,
      attendances,
      setAttendances,
      setSubmittedCode
    );
  };

  const handleDeleteAttendance = (id: string) => {
    manageAttendanceRecords.handleDeleteAttendance(
      id,
      isInstructor,
      attendances,
      setAttendances
    );
  };

  const handleEditAttendance = (id: string, studentEmail: string, status: "present" | "absent" | "leave") => {
    manageAttendanceRecords.handleEditAttendance(
      id,
      studentEmail,
      status,
      isInstructor,
      attendances,
      setAttendances,
      sessionDate,
      sessionName
    );
  };

  const handleManualAttendance = (studentEmail: string, date: string, sessionName?: string, status: "present" | "absent" | "leave" = "present") => {
    manageAttendanceRecords.handleManualAttendance(
      studentEmail,
      date,
      sessionName,
      status,
      isInstructor,
      attendances,
      setAttendances
    );
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
    submitAttendance: handleSubmitAttendance,
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
