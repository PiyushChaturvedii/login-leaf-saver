
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { StudentStats } from "./types";

interface StudentAttendanceCardProps {
  studentEmail: string;
  stats: StudentStats;
}

export const StudentAttendanceCard = ({ studentEmail, stats }: StudentAttendanceCardProps) => {
  const [selectedTab, setSelectedTab] = useState("list");
  
  const getStatusIcon = (present: boolean, leave?: boolean) => {
    if (leave) return <RefreshCw className="w-4 h-4 text-amber-500" />;
    if (present) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };
  
  const getStatusClass = (present: boolean, leave?: boolean) => {
    if (leave) return "bg-amber-100 text-amber-800";
    if (present) return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            <span>Attendance Details</span>
          </div>
          <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {stats.percentage}% Attendance
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="text-sm text-gray-500 mb-2">
              All attendance records listed chronologically
            </div>
            
            <div className="overflow-hidden border rounded-md">
              <div className="bg-gray-100 py-2 px-3 text-xs font-semibold grid grid-cols-12">
                <div className="col-span-3">Date</div>
                <div className="col-span-5">Session</div>
                <div className="col-span-4 text-center">Status</div>
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {stats.records.map((record, index) => (
                  <div key={index} className="py-2 px-3 border-t text-sm grid grid-cols-12 items-center">
                    <div className="col-span-3">
                      {format(new Date(record.date), 'dd/MM/yyyy')}
                    </div>
                    <div className="col-span-5 truncate" title={record.sessionName || 'Regular Session'}>
                      {record.sessionName || 'Regular Session'}
                    </div>
                    <div className="col-span-4 flex justify-center">
                      <span className={`px-2 py-0.5 rounded-full flex items-center text-xs ${getStatusClass(record.present, record.leave)}`}>
                        {getStatusIcon(record.present, record.leave)}
                        <span className="ml-1">
                          {record.leave ? 'Leave' : (record.present ? 'Present' : 'Absent')}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
                
                {stats.records.length === 0 && (
                  <div className="py-4 text-center text-gray-500 italic">
                    No attendance records found
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">{stats.attended}</div>
                  <div className="text-xs text-green-600">Present</div>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-amber-700">{stats.leaves || 0}</div>
                  <div className="text-xs text-amber-600">Leaves</div>
                </div>
                
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-700">
                    {stats.totalSessions - stats.attended - (stats.leaves || 0)}
                  </div>
                  <div className="text-xs text-red-600">Absent</div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Attendance Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Total Sessions:</span>
                    <span className="font-medium">{stats.totalSessions}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Present Count:</span>
                    <span className="font-medium text-green-600">{stats.attended}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Leave Count:</span>
                    <span className="font-medium text-amber-600">{stats.leaves || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Absent Count:</span>
                    <span className="font-medium text-red-600">
                      {stats.totalSessions - stats.attended - (stats.leaves || 0)}
                    </span>
                  </li>
                  <li className="flex justify-between pt-2 border-t">
                    <span>Attendance Percentage:</span>
                    <span className="font-medium text-blue-600">{stats.percentage}%</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
