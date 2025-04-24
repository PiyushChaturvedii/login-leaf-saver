
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AttendanceCode } from './types';

interface AttendanceCodeGeneratorProps {
  attendanceCode: AttendanceCode | null;
  timeLeft: { minutes: number, seconds: number } | null;
  sessionDate: Date | undefined;
  sessionName: string;
  setSessionDate: (date: Date | undefined) => void;
  setSessionName: (name: string) => void;
  generateAttendanceCode: () => void;
}

export const AttendanceCodeGenerator = ({
  attendanceCode,
  timeLeft,
  sessionDate,
  sessionName,
  setSessionDate,
  setSessionName,
  generateAttendanceCode
}: AttendanceCodeGeneratorProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-600 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1 text-indigo-500" /> Session Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-indigo-100 hover:bg-indigo-50 hover:text-indigo-700"
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
          <label className="text-sm text-gray-600 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1 text-indigo-500" /> Session Name (Optional)
          </label>
          <Input
            placeholder="e.g. Morning Session, React Basics"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200"
          />
        </div>
      </div>
      
      <Button 
        onClick={generateAttendanceCode} 
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-200"
      >
        Generate Attendance Code
      </Button>
      
      {attendanceCode && timeLeft && (
        <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-inner my-4 animate-pulse-soft">
          <div className="mb-2 text-indigo-400 text-xs uppercase font-semibold tracking-wider">Active Session Code</div>
          <p className="text-3xl md:text-4xl font-bold font-mono tracking-wider text-indigo-700 bg-white py-3 px-6 rounded-lg inline-block shadow-sm">{attendanceCode.code}</p>
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
  );
};
