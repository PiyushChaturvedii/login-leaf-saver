
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const ClientsTabContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Clients</CardTitle>
        <CardDescription>Manage your converted leads and clients</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-gray-500">
          Converted leads will appear here. Start by converting some leads!
        </p>
      </CardContent>
    </Card>
  );
};
