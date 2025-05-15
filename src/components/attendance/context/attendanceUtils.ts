
import { format } from 'date-fns';
import { Attendance } from '../types';
import { DbService } from '@/services/DatabaseService';

// Get all student emails (from users who are students)
export const getAllStudentEmails = async (): Promise<string[]> => {
  const users = await DbService.find('users', { role: 'student' });
  return users.map((user: any) => user.email);
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

// Save attendance records to MongoDB
export const saveAttendances = async (attendances: Attendance[]): Promise<void> => {
  // First delete all existing records (in a real app we'd use a transaction)
  const existingAttendances = await DbService.find('attendances');
  for (const attendance of existingAttendances) {
    await DbService.delete('attendances', attendance._id);
  }
  
  // Then insert all new records
  for (const attendance of attendances) {
    await DbService.create('attendances', attendance);
  }
};

// Load attendance records from MongoDB
export const loadAttendances = async (): Promise<Attendance[]> => {
  return await DbService.find('attendances');
};

// Save attendance code to MongoDB
export const saveAttendanceCode = async (code: any): Promise<void> => {
  const existingCodes = await DbService.find('attendanceCodes');
  
  // If there's an existing code, update it, otherwise create a new one
  if (existingCodes.length > 0) {
    await DbService.update('attendanceCodes', existingCodes[0]._id, code);
  } else {
    await DbService.create('attendanceCodes', code);
  }
};

// Remove attendance code from MongoDB
export const removeAttendanceCode = async (): Promise<void> => {
  const existingCodes = await DbService.find('attendanceCodes');
  
  for (const code of existingCodes) {
    await DbService.delete('attendanceCodes', code._id);
  }
};

// Load attendance code from MongoDB
export const loadAttendanceCode = async (): Promise<any> => {
  const codes = await DbService.find('attendanceCodes');
  return codes.length > 0 ? codes[0] : null;
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
