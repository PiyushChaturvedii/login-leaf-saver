
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { StudentSubmissionForm } from './StudentSubmissionForm';
import { AttendanceStats } from './AttendanceStats';
import { StudentCalendarView } from './StudentCalendarView';
import { StudentListView } from './StudentListView';
import { useAttendance } from './context/useAttendance';

export const StudentDisplay = () => {
  const { 
    submittedCode, 
    setSubmittedCode, 
    submitAttendance,
    getStudentStats
  } = useAttendance();
  
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState("calendar");
  const stats = getStudentStats('currentUser');
  
  return (
    <>
      <AttendanceStats stats={stats} />
      
      <div className="mb-6">
        <StudentSubmissionForm 
          submittedCode={submittedCode}
          setSubmittedCode={setSubmittedCode}
          submitAttendance={submitAttendance}
        />
      </div>
      
      <Tabs defaultValue="calendar" value={selectedTab} onValueChange={setSelectedTab}>
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
          <StudentCalendarView 
            records={stats.records}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </TabsContent>
        
        <TabsContent value="list" className="pt-4">
          <StudentListView records={stats.records} />
        </TabsContent>
      </Tabs>
    </>
  );
};
