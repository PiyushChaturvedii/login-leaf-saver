
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Attendance, AttendanceCode } from '../types';
import { saveAttendances, generateNewAttendanceCode, saveAttendanceCode } from './attendanceUtils';

/**
 * Generates a new attendance code for a session
 */
export const generateCode = (
  sessionDate: Date | undefined,
  sessionName: string,
  setAttendanceCode: React.Dispatch<React.SetStateAction<AttendanceCode | null>>
) => {
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

/**
 * Submits attendance for a student
 */
export const submitAttendance = (
  e: React.FormEvent,
  userEmail: string | undefined,
  attendanceCode: AttendanceCode | null,
  submittedCode: string,
  attendances: Attendance[],
  setAttendances: React.Dispatch<React.SetStateAction<Attendance[]>>,
  setSubmittedCode: (code: string) => void
) => {
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

/**
 * Manages attendance records (delete, edit, manual marking)
 */
export const manageAttendanceRecords = {
  handleDeleteAttendance: (
    id: string, 
    isInstructor: boolean,
    attendances: Attendance[],
    setAttendances: React.Dispatch<React.SetStateAction<Attendance[]>>
  ) => {
    if (!isInstructor) return;
    
    const updatedAttendances = attendances.filter(a => a.id !== id);
    saveAttendances(updatedAttendances);
    setAttendances(updatedAttendances);
    toast.success('Attendance record deleted!');
  },

  handleEditAttendance: (
    id: string, 
    studentEmail: string, 
    status: "present" | "absent" | "leave",
    isInstructor: boolean,
    attendances: Attendance[],
    setAttendances: React.Dispatch<React.SetStateAction<Attendance[]>>,
    sessionDate?: Date,
    sessionName?: string
  ) => {
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
  },

  handleManualAttendance: (
    studentEmail: string, 
    date: string, 
    sessionName: string | undefined,
    status: "present" | "absent" | "leave",
    isInstructor: boolean,
    attendances: Attendance[],
    setAttendances: React.Dispatch<React.SetStateAction<Attendance[]>>
  ) => {
    if (!isInstructor) return;
    
    if (status === "absent") {
      // For absent status, find and remove the record if it exists
      const existingRecord = attendances.find(
        a => a.studentEmail === studentEmail && 
             a.date === date && 
             ((!sessionName && !a.sessionName) || (a.sessionName === sessionName))
      );
      
      if (existingRecord) {
        const updatedAttendances = attendances.filter(a => a.id !== existingRecord.id);
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
  }
};
