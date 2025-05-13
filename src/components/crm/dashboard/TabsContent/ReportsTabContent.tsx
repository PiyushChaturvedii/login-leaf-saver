
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const ReportsTabContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Reports</CardTitle>
        <CardDescription>View performance metrics and analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-gray-500">
          Reports and analytics will be available here.
        </p>
      </CardContent>
    </Card>
  );
};
