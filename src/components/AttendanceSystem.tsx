
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, CheckCircle, XCircle, Edit, Save, Trash, Clock } from 'lucide-react';

interface AttendanceProps {
  isInstructor: boolean;
  userEmail?: string;
}

interface Attendance {
  id: string;
  studentEmail: string;
  code: string;
  submittedAt: string;
  date: string; // Added date field
  sessionName?: string; // Added session name field
}

interface AttendanceCode {
  code: string;
  expiresAt: number;
  date: string; // Added date field
  sessionName?: string; // Added session name field
}

interface AttendanceRecord {
  date: string;
  present: boolean;
  sessionName?: string;
}

export const AttendanceSystem = ({ isInstructor, userEmail }: AttendanceProps) => {
  const [attendanceCode, setAttendanceCode] = useState<AttendanceCode | null>(null);
  const [submittedCode, setSubmittedCode] = useState('');
  const [attendances, setAttendances] = useState<Attendance[]>(
    JSON.parse(localStorage.getItem('attendances') || '[]')
  );
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionName, setSessionName] = useState('');
  const [editingAttendance, setEditingAttendance] = useState<string | null>(null);
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
      date: sessionDate,
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

  const getAttendanceRecords = (email: string) => {
    // Get all unique dates from attendances
    const allSessions = Array.from(
      new Set(
        attendances.map(a => `${a.date}${a.sessionName ? '-' + a.sessionName : ''}`)
      )
    );
    
    // Create a record for each date
    return allSessions.map(sessionKey => {
      const [date, sessionName] = sessionKey.includes('-') 
        ? sessionKey.split('-')
        : [sessionKey, undefined];
      
      const present = attendances.some(
        a => a.studentEmail === email && 
        a.date === date && 
        (sessionName === undefined || a.sessionName === sessionName)
      );
      
      return {
        date,
        sessionName,
        present
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getStudentAttendanceStats = (email: string) => {
    const records = getAttendanceRecords(email);
    const totalSessions = records.length;
    const attended = records.filter(r => r.present).length;
    const percentage = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;
    
    return { 
      totalSessions, 
      attended, 
      percentage,
      records
    };
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
    setEditingAttendance(null);
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

  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl border-indigo-100">
      <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
        {isInstructor ? 'Attendance Management' : 'Submit Attendance'}
      </h3>
      {isInstructor ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-indigo-500" /> Session Date
              </label>
              <Input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="border-indigo-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Session Name (Optional)</label>
              <Input
                placeholder="e.g. Morning Session, React Basics"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="border-indigo-100"
              />
            </div>
          </div>
          
          <Button 
            onClick={generateAttendanceCode} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Generate Attendance Code
          </Button>
          
          {attendanceCode && timeLeft && (
            <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl shadow-inner animate-pulse-soft">
              <p className="text-2xl font-bold font-mono tracking-wider text-indigo-800">{attendanceCode.code}</p>
              <div className="flex items-center justify-center space-x-1 text-sm text-indigo-600 mt-1">
                <Clock className="w-4 h-4" />
                <span>
                  Expires in {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs text-indigo-600 mt-1">
                For session: {new Date(attendanceCode.date).toLocaleDateString()}
                {attendanceCode.sessionName && ` - ${attendanceCode.sessionName}`}
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="font-medium mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Attendance Records</h4>
            
            <div className="space-y-4">
              {getAllStudentEmails().map(email => {
                const stats = getStudentAttendanceStats(email);
                return (
                  <div key={email} className="border border-indigo-100 p-4 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-white to-indigo-50">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{email}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                          stats.percentage >= 80 ? 'bg-green-100 text-green-800' : 
                          stats.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {stats.percentage}%
                        </span>
                        <span className="text-sm text-gray-600">
                          {stats.attended}/{stats.totalSessions} sessions
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <div className="text-xs font-medium bg-gray-100 p-2 rounded-t grid grid-cols-5">
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Session</div>
                        <div className="text-center">Status</div>
                      </div>
                      
                      {stats.records.map((record, idx) => (
                        <div 
                          key={idx} 
                          className="text-sm grid grid-cols-5 p-2 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <div className="col-span-2">{new Date(record.date).toLocaleDateString()}</div>
                          <div className="col-span-2">{record.sessionName || 'Regular Session'}</div>
                          <div className="text-center">
                            {editingAttendance === `${email}-${record.date}-${record.sessionName || ''}` ? (
                              <div className="flex items-center justify-center space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-6 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => handleEditAttendance(
                                    attendances.find(a => 
                                      a.studentEmail === email && 
                                      a.date === record.date && 
                                      (a.sessionName === record.sessionName || 
                                        (!a.sessionName && !record.sessionName))
                                    )?.id || '', 
                                    email, 
                                    !record.present
                                  )}
                                >
                                  <Save className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-1">
                                {record.present ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-indigo-600"
                                  onClick={() => setEditingAttendance(`${email}-${record.date}-${record.sessionName || ''}`)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {stats.records.length === 0 && (
                        <div className="text-sm text-gray-500 italic p-2">No attendance records found</div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <Button 
                        size="sm"
                        variant="outline" 
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        onClick={() => handleManualAttendance(email, sessionDate, sessionName || undefined)}
                      >
                        Mark Present for {new Date(sessionDate).toLocaleDateString()}
                        {sessionName && ` - ${sessionName}`}
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {getAllStudentEmails().length === 0 && (
                <div className="text-center py-8 text-gray-500 italic">
                  No students found. Students need to register first.
                </div>
              )}
            </div>
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
              className="border-indigo-100"
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Submit Attendance
            </Button>
          </form>
          
          {userEmail && (
            <div className="mt-6">
              <h4 className="font-medium mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">My Attendance Records</h4>
              
              <div className="mb-4 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl shadow-inner">
                {(() => {
                  const stats = getStudentAttendanceStats(userEmail);
                  return (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">{stats.percentage}%</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Total Attendance: {stats.attended} of {stats.totalSessions} sessions
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                          style={{ width: `${stats.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <div className="border border-indigo-100 rounded-lg overflow-hidden">
                <div className="text-xs font-medium bg-gray-100 p-2 grid grid-cols-4">
                  <div className="col-span-1">Date</div>
                  <div className="col-span-2">Session</div>
                  <div className="text-center">Status</div>
                </div>
                
                {getStudentAttendanceStats(userEmail).records.map((record, idx) => (
                  <div 
                    key={idx} 
                    className={`text-sm grid grid-cols-4 p-2 border-b border-gray-100 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <div className="col-span-1">{new Date(record.date).toLocaleDateString()}</div>
                    <div className="col-span-2">{record.sessionName || 'Regular Session'}</div>
                    <div className="text-center">
                      {record.present ? (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-green-600">Present</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-red-600 mr-1" />
                          <span className="text-red-600">Absent</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {getStudentAttendanceStats(userEmail).records.length === 0 && (
                  <div className="text-sm text-gray-500 italic p-4 text-center">
                    No attendance records found
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
