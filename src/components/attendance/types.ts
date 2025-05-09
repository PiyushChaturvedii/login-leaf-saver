
export interface AttendanceProps {
  isInstructor: boolean;
  userEmail?: string;
}

export interface Attendance {
  id: string;
  studentEmail: string;
  code: string;
  submittedAt: string;
  date: string;
  sessionName?: string;
  status?: "present" | "absent" | "leave";
}

export interface AttendanceCode {
  code: string;
  expiresAt: number;
  date: string;
  sessionName?: string;
}

export interface AttendanceRecord {
  date: string;
  present: boolean;
  leave?: boolean;
  sessionName?: string;
}

export interface StudentStats {
  totalSessions: number;
  attended: number;
  leaves: number;
  percentage: number;
  records: AttendanceRecord[];
}
