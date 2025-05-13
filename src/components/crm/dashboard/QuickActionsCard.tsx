
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Phone, FileText, BarChart } from 'lucide-react';

interface QuickActionsCardProps {
  onAddLead: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ onAddLead }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common sales tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={onAddLead} className="w-full justify-start bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Lead
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Phone className="w-4 h-4 mr-2" />
          Follow-up Calls
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <BarChart className="w-4 h-4 mr-2" />
          Sales Analytics
        </Button>
      </CardContent>
    </Card>
  );
};
