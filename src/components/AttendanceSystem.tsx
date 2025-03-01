
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar as CalendarIcon, CheckCircle, XCircle, Edit, Save, Trash, Clock, PieChart, Users } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

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
  const [sessionDate, setSessionDate] = useState<Date | undefined>(new Date());
  const [sessionName, setSessionName] = useState('');
  const [editingAttendance, setEditingAttendance] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{minutes: number, seconds: number} | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

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

  // Calendar helpers
  const getSessionsForDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return Array.from(
      new Set(
        attendances
          .filter(a => a.date === formattedDate)
          .map(a => a.sessionName || 'Regular Session')
      )
    );
  };

  const getDaysWithSessions = () => {
    const days = new Set();
    attendances.forEach(attendance => {
      days.add(attendance.date);
    });
    return Array.from(days).map(day => new Date(day as string));
  };

  const isDateInMonth = (date: Date, month: Date) => {
    return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
  };

  // Calculate overall attendance stats for all students
  const getOverallStats = () => {
    const allStudents = getAllStudentEmails();
    if (allStudents.length === 0) return { averageAttendance: 0, totalSessions: 0 };
    
    const stats = allStudents.map(email => getStudentAttendanceStats(email));
    const totalPercentages = stats.reduce((sum, stat) => sum + stat.percentage, 0);
    const avgPercentage = Math.round(totalPercentages / allStudents.length);
    
    // Find total unique sessions
    const allSessions = Array.from(
      new Set(
        attendances.map(a => `${a.date}${a.sessionName ? '-' + a.sessionName : ''}`)
      )
    );
    
    return { 
      averageAttendance: avgPercentage,
      totalSessions: allSessions.length
    };
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl border-indigo-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {isInstructor ? 'Attendance Management' : 'Student Attendance'}
        </h3>
        
        {isInstructor && (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full md:w-auto mt-4 md:mt-0">
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="overview" className="flex items-center">
                <PieChart className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Students
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      
      {isInstructor ? (
        <>
          <TabsContent value="overview" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
                <h4 className="text-sm font-medium text-indigo-500 mb-2">Average Attendance</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-indigo-700">{getOverallStats().averageAttendance}%</span>
                  <span className="text-sm text-indigo-400 ml-2 mb-1">of classes</span>
                </div>
                <Progress 
                  value={getOverallStats().averageAttendance} 
                  className="h-2 mt-2" 
                />
              </Card>
              
              <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-purple-50 to-white">
                <h4 className="text-sm font-medium text-purple-500 mb-2">Total Sessions</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-purple-700">{getOverallStats().totalSessions}</span>
                  <span className="text-sm text-purple-400 ml-2 mb-1">sessions recorded</span>
                </div>
              </Card>
              
              <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-blue-50 to-white">
                <h4 className="text-sm font-medium text-blue-500 mb-2">Students</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-blue-700">{getAllStudentEmails().length}</span>
                  <span className="text-sm text-blue-400 ml-2 mb-1">enrolled</span>
                </div>
              </Card>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1 text-indigo-500" /> Session Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-indigo-100"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                        {sessionDate ? format(sessionDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={sessionDate}
                        onSelect={setSessionDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Generate Attendance Code
              </Button>
              
              {attendanceCode && timeLeft && (
                <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-inner my-4 animate-pulse-soft">
                  <div className="mb-2 text-indigo-400 text-xs uppercase font-semibold tracking-wider">Active Session Code</div>
                  <p className="text-3xl font-bold font-mono tracking-wider text-indigo-700 bg-white py-3 px-6 rounded-lg inline-block shadow-sm">{attendanceCode.code}</p>
                  <div className="flex items-center justify-center space-x-1 text-sm text-indigo-600 mt-3">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span>remaining</span>
                  </div>
                  <p className="text-xs text-indigo-600 mt-2">
                    For session: {new Date(attendanceCode.date).toLocaleDateString()}
                    {attendanceCode.sessionName && ` - ${attendanceCode.sessionName}`}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-0">
            <div className="p-1">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">
                  Session Calendar
                </h4>
                <div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMonth(new Date())}
                    className="text-xs"
                  >
                    Today
                  </Button>
                </div>
              </div>
              
              <div className="border border-indigo-100 rounded-lg overflow-hidden bg-white">
                <Calendar
                  mode="single"
                  selected={sessionDate}
                  onSelect={setSessionDate}
                  className="rounded-md"
                  onMonthChange={setSelectedMonth}
                  defaultMonth={selectedMonth}
                  modifiers={{
                    hasSessions: getDaysWithSessions().filter(date => isDateInMonth(date, selectedMonth))
                  }}
                  modifiersClassNames={{
                    hasSessions: "bg-indigo-100 font-bold text-indigo-700"
                  }}
                />
              </div>
              
              {sessionDate && (
                <div className="mt-4 p-4 border border-indigo-100 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-2">
                    {format(sessionDate, "MMMM d, yyyy")}
                  </h5>
                  {getSessionsForDate(sessionDate).length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Sessions on this day:</p>
                      <ul className="space-y-1">
                        {getSessionsForDate(sessionDate).map((session, idx) => (
                          <li key={idx} className="text-sm bg-indigo-50 px-3 py-2 rounded-md text-indigo-700">
                            {session}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No sessions on this day</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="students" className="mt-0">
            <div className="space-y-4">
              {getAllStudentEmails().length === 0 ? (
                <div className="text-center py-8 text-gray-500 italic">
                  No students found. Students need to register first.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getAllStudentEmails().map(email => {
                      const stats = getStudentAttendanceStats(email);
                      return (
                        <TooltipProvider key={email}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                className={`w-full justify-start h-auto py-3 px-4 border ${
                                  selectedStudent === email 
                                    ? 'border-indigo-500 bg-indigo-50' 
                                    : 'border-gray-200'
                                }`}
                                onClick={() => setSelectedStudent(email)}
                              >
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-medium truncate w-full">{email.split('@')[0]}</span>
                                  <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                                    stats.percentage >= 80 ? 'bg-green-100 text-green-800' : 
                                    stats.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {stats.percentage}%
                                  </span>
                                </div>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{email}</p>
                              <p className="text-xs">{stats.attended}/{stats.totalSessions} sessions</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                  
                  {selectedStudent && (
                    <div className="mt-6 border border-indigo-100 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium">{selectedStudent}</h4>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-600">
                              Attendance: {getStudentAttendanceStats(selectedStudent).percentage}%
                            </span>
                            <Progress 
                              value={getStudentAttendanceStats(selectedStudent).percentage} 
                              className="h-2 w-28 ml-2" 
                            />
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                          onClick={() => handleManualAttendance(
                            selectedStudent, 
                            sessionDate ? format(sessionDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0], 
                            sessionName || undefined
                          )}
                        >
                          Mark Present
                        </Button>
                      </div>
                      
                      <div className="overflow-hidden border border-gray-100 rounded-lg">
                        <div className="text-xs font-medium bg-gray-100 p-2 grid grid-cols-6">
                          <div className="col-span-2">Date</div>
                          <div className="col-span-3">Session</div>
                          <div className="text-center">Status</div>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto">
                          {getStudentAttendanceStats(selectedStudent).records.map((record, idx) => (
                            <div 
                              key={idx} 
                              className={`text-sm grid grid-cols-6 p-2 border-b border-gray-100 ${
                                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }`}
                            >
                              <div className="col-span-2">{new Date(record.date).toLocaleDateString()}</div>
                              <div className="col-span-3">{record.sessionName || 'Regular Session'}</div>
                              <div className="text-center">
                                {editingAttendance === `${selectedStudent}-${record.date}-${record.sessionName || ''}` ? (
                                  <div className="flex items-center justify-center space-x-1">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="h-6 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                      onClick={() => handleEditAttendance(
                                        attendances.find(a => 
                                          a.studentEmail === selectedStudent && 
                                          a.date === record.date && 
                                          (a.sessionName === record.sessionName || 
                                            (!a.sessionName && !record.sessionName))
                                        )?.id || '', 
                                        selectedStudent, 
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
                                      onClick={() => setEditingAttendance(`${selectedStudent}-${record.date}-${record.sessionName || ''}`)}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {getStudentAttendanceStats(selectedStudent).records.length === 0 && (
                            <div className="text-sm text-gray-500 italic p-3 text-center">No attendance records found</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
              {userEmail && (() => {
                const stats = getStudentAttendanceStats(userEmail);
                return (
                  <>
                    <h4 className="text-sm font-medium text-indigo-500 mb-2">My Attendance</h4>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold text-indigo-700">{stats.percentage}%</span>
                      <span className="text-sm text-indigo-400 ml-2 mb-1">overall</span>
                    </div>
                    <Progress 
                      value={stats.percentage} 
                      className="h-2 mt-2" 
                    />
                  </>
                );
              })()}
            </Card>
            
            <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-purple-50 to-white md:col-span-2">
              {userEmail && (() => {
                const stats = getStudentAttendanceStats(userEmail);
                return (
                  <>
                    <h4 className="text-sm font-medium text-purple-500 mb-2">Session Summary</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-purple-700">{stats.attended}</span>
                        <span className="text-sm text-purple-400 ml-1">attended</span>
                      </div>
                      <div>
                        <span className="text-xl font-bold text-purple-700">{stats.totalSessions - stats.attended}</span>
                        <span className="text-sm text-purple-400 ml-1">missed</span>
                      </div>
                      <div>
                        <span className="text-xl font-bold text-purple-700">{stats.totalSessions}</span>
                        <span className="text-sm text-purple-400 ml-1">total</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </Card>
          </div>
          
          <div className="mb-6">
            <form onSubmit={submitAttendance} className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Enter Attendance Code"
                  value={submittedCode}
                  onChange={(e) => setSubmittedCode(e.target.value.toUpperCase())}
                  required
                  className="border-indigo-100 pr-24 font-mono uppercase tracking-wider text-center text-lg h-12"
                  maxLength={6}
                />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-10"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
          
          <Tabs defaultValue="calendar">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="calendar" className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="pt-4">
              {userEmail && (
                <div className="border border-indigo-100 rounded-lg overflow-hidden bg-white">
                  <Calendar
                    mode="single"
                    selected={sessionDate}
                    onSelect={setSessionDate}
                    className="rounded-md"
                    onMonthChange={setSelectedMonth}
                    defaultMonth={selectedMonth}
                    modifiers={{
                      present: getStudentAttendanceStats(userEmail).records
                        .filter(r => r.present)
                        .map(r => new Date(r.date)),
                      absent: getStudentAttendanceStats(userEmail).records
                        .filter(r => !r.present)
                        .map(r => new Date(r.date))
                    }}
                    modifiersClassNames={{
                      present: "bg-green-100 font-bold text-green-700",
                      absent: "bg-red-100 font-bold text-red-700"
                    }}
                  />
                  
                  {sessionDate && (
                    <div className="p-4 border-t border-indigo-100">
                      <h5 className="font-medium text-gray-700">
                        {format(sessionDate, "MMMM d, yyyy")}
                      </h5>
                      {userEmail && (() => {
                        const records = getStudentAttendanceStats(userEmail).records
                          .filter(r => r.date === format(sessionDate, 'yyyy-MM-dd'));
                        
                        if (records.length === 0) {
                          return (
                            <p className="text-sm text-gray-500 italic mt-1">No sessions on this day</p>
                          );
                        }
                        
                        return (
                          <div className="mt-2 space-y-2">
                            {records.map((record, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                {record.present ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-sm">
                                  {record.sessionName || 'Regular Session'}: 
                                  <span className={record.present ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                                    {record.present ? 'Present' : 'Absent'}
                                  </span>
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="pt-4">
              {userEmail && (
                <div className="border border-indigo-100 rounded-lg overflow-hidden">
                  <div className="text-xs font-medium bg-gray-100 p-2 grid grid-cols-4">
                    <div className="col-span-1">Date</div>
                    <div className="col-span-2">Session</div>
                    <div className="text-center">Status</div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
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
            </TabsContent>
          </Tabs>
        </>
      )}
    </Card>
  );
};
