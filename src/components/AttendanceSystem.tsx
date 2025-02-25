
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AttendanceProps {
  isInstructor: boolean;
  userEmail?: string;
}

interface Attendance {
  id: string;
  studentEmail: string;
  code: string;
  submittedAt: string;
}

interface AttendanceCode {
  code: string;
  expiresAt: number;
}

export const AttendanceSystem = ({ isInstructor, userEmail }: AttendanceProps) => {
  const [attendanceCode, setAttendanceCode] = useState<AttendanceCode | null>(null);
  const [submittedCode, setSubmittedCode] = useState('');
  const [attendances, setAttendances] = useState<Attendance[]>(
    JSON.parse(localStorage.getItem('attendances') || '[]')
  );

  const generateAttendanceCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    const newCode = { code, expiresAt };
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

    const newAttendance: Attendance = {
      id: Date.now().toString(),
      studentEmail: userEmail,
      code: submittedCode,
      submittedAt: new Date().toISOString(),
    };

    const updatedAttendances = [...attendances, newAttendance];
    localStorage.setItem('attendances', JSON.stringify(updatedAttendances));
    setAttendances(updatedAttendances);
    setSubmittedCode('');
    toast.success('Attendance submitted successfully!');
  };

  const getAttendanceStats = (email: string) => {
    const totalSessions = attendanceCode ? 1 : 0;
    const attended = attendances.filter(a => a.studentEmail === email).length;
    const absent = totalSessions - attended;
    return { totalSessions, attended, absent };
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {isInstructor ? 'Attendance Management' : 'Submit Attendance'}
      </h3>
      {isInstructor ? (
        <div className="space-y-4">
          <Button onClick={generateAttendanceCode} className="w-full">
            Generate Attendance Code
          </Button>
          {attendanceCode && Date.now() < attendanceCode.expiresAt && (
            <div className="text-center">
              <p className="text-xl font-bold">{attendanceCode.code}</p>
              <p className="text-sm text-gray-600">
                Expires in {Math.ceil((attendanceCode.expiresAt - Date.now()) / 1000)}s
              </p>
            </div>
          )}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Attendance Records</h4>
            {Array.from(new Set(attendances.map(a => a.studentEmail))).map(email => {
              const stats = getAttendanceStats(email);
              return (
                <div key={email} className="border p-2 rounded mb-2">
                  <p className="font-medium">{email}</p>
                  <p className="text-sm text-gray-600">
                    Total Sessions: {stats.totalSessions} | 
                    Attended: {stats.attended} | 
                    Absent: {stats.absent}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={submitAttendance} className="space-y-4">
            <Input
              placeholder="Enter Attendance Code"
              value={submittedCode}
              onChange={(e) => setSubmittedCode(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Submit Attendance
            </Button>
          </form>
          <div className="mt-4">
            <h4 className="font-medium mb-2">My Attendance Records</h4>
            {userEmail && (
              <div className="mb-4">
                <p className="text-sm font-medium">Attendance Statistics</p>
                <div className="text-sm text-gray-600">
                  {(() => {
                    const stats = getAttendanceStats(userEmail);
                    return `Total Sessions: ${stats.totalSessions} | Attended: ${stats.attended} | Absent: ${stats.absent}`;
                  })()}
                </div>
              </div>
            )}
            {attendances
              .filter(a => a.studentEmail === userEmail)
              .map((attendance) => (
                <div key={attendance.id} className="text-sm">
                  Submitted: {new Date(attendance.submittedAt).toLocaleString()}
                </div>
              ))}
          </div>
        </>
      )}
    </Card>
  );
};
