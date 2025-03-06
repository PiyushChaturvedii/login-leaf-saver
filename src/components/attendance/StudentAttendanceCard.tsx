
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentStats } from "./types";
import { StudentAttendanceHeader } from "./StudentAttendanceHeader";
import { StudentAttendanceListView } from "./StudentAttendanceListView";
import { StudentAttendanceSummary } from "./StudentAttendanceSummary";

interface StudentAttendanceCardProps {
  studentEmail: string;
  stats: StudentStats;
}

export const StudentAttendanceCard = ({ studentEmail, stats }: StudentAttendanceCardProps) => {
  const [selectedTab, setSelectedTab] = useState("list");

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <StudentAttendanceHeader stats={stats} />
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <StudentAttendanceListView stats={stats} />
          </TabsContent>
          
          <TabsContent value="summary">
            <StudentAttendanceSummary stats={stats} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
