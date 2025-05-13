
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecentActivitiesCardProps {
  onViewAll: () => void;
}

export const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ onViewAll }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Your recent lead interactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-l-2 border-blue-400 pl-3 py-2">
          <p className="text-sm text-gray-600">Today, 10:30 AM</p>
          <p className="font-medium">Called Rahul Singh about course inquiry</p>
        </div>
        <div className="border-l-2 border-green-400 pl-3 py-2">
          <p className="text-sm text-gray-600">Yesterday, 3:45 PM</p>
          <p className="font-medium">Converted lead: Priya Sharma enrolled in Web Dev</p>
        </div>
        <div className="border-l-2 border-yellow-400 pl-3 py-2">
          <p className="text-sm text-gray-600">Yesterday, 11:15 AM</p>
          <p className="font-medium">Follow-up scheduled with Amit Kumar</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onViewAll}>
          View All Activities
        </Button>
      </CardFooter>
    </Card>
  );
};
