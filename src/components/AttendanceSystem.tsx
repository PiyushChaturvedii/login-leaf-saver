
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
            {attendances.map((attendance) => (
              <div key={attendance.id} className="text-sm">
                {attendance.studentEmail} - {new Date(attendance.submittedAt).toLocaleString()}
              </div>
            ))}
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
