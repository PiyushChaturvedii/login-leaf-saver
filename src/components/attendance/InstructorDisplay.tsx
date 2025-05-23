
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, CalendarIcon, Users } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AttendanceCodeGenerator } from './AttendanceCodeGenerator';
import { AttendanceStats } from './AttendanceStats';
import { InstructorCalendarView } from './InstructorCalendarView';
import { StudentsListView } from './StudentsListView';
import { useAttendance } from './context/useAttendance';
import { Progress } from "@/components/ui/progress";

export const InstructorDisplay = () => {
  const { 
    attendanceCode,
    timeLeft,
    sessionDate,
    sessionName,
    setSessionDate,
    setSessionName,
    generateAttendanceCode,
    getStudentStats,
    handleManualAttendance,
    handleEditAttendance,
    getAttendanceId,
    getAllStudentEmails,
    getDaysWithSessionsData,
    getSessionsForDateData,
    isDateInMonthCheck,
    getOverallStatsData
  } = useAttendance();

  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const overallStats = getOverallStatsData();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-0">
          Attendance Management
        </h3>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px] bg-indigo-50 p-1 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="flex items-center data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
            >
              <PieChart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex items-center data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Calendar</span>
              <span className="sm:hidden">Cal</span>
            </TabsTrigger>
            <TabsTrigger 
              value="students" 
              className="flex items-center data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Students</span>
              <span className="sm:hidden">List</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-3px] animate-fade-in">
                <h4 className="text-sm font-medium text-indigo-500 mb-2">Average Attendance</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-indigo-700">{overallStats.averageAttendance}%</span>
                  <span className="text-sm text-indigo-400 ml-2 mb-1">of classes</span>
                </div>
                <Progress 
                  value={overallStats.averageAttendance} 
                  className="h-2 mt-2 bg-indigo-100" 
                />
              </Card>
              
              <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-purple-50 to-white transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-3px] animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h4 className="text-sm font-medium text-purple-500 mb-2">Total Sessions</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-purple-700">{overallStats.totalSessions}</span>
                  <span className="text-sm text-purple-400 ml-2 mb-1">sessions recorded</span>
                </div>
              </Card>
              
              <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-blue-50 to-white transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-3px] animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h4 className="text-sm font-medium text-blue-500 mb-2">Students</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-blue-700">{overallStats.studentsCount}</span>
                  <span className="text-sm text-blue-400 ml-2 mb-1">enrolled</span>
                </div>
              </Card>
            </div>
            
            <AttendanceCodeGenerator
              attendanceCode={attendanceCode}
              timeLeft={timeLeft}
              sessionDate={sessionDate}
              sessionName={sessionName}
              setSessionDate={setSessionDate}
              setSessionName={setSessionName}
              generateAttendanceCode={generateAttendanceCode}
            />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-4">
            <InstructorCalendarView
              sessionDate={sessionDate}
              setSessionDate={setSessionDate}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              getDaysWithSessions={getDaysWithSessionsData}
              getSessionsForDate={getSessionsForDateData}
              isDateInMonth={isDateInMonthCheck}
            />
          </TabsContent>
          
          <TabsContent value="students" className="mt-4">
            <StudentsListView
              students={getAllStudentEmails()}
              getStudentStats={getStudentStats}
              handleManualAttendance={handleManualAttendance}
              handleEditAttendance={handleEditAttendance}
              sessionDate={sessionDate}
              sessionName={sessionName}
              getAttendanceId={getAttendanceId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
