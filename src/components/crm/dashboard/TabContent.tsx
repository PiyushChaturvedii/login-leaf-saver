
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LeadsList } from '../LeadsList';
import { LeadForm } from '../LeadForm';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { DashboardStats } from './DashboardStats';
import { RecentActivitiesCard } from './RecentActivitiesCard';
import { QuickActionsCard } from './QuickActionsCard';

interface DashboardTabContentProps {
  activeTab: string;
  showAddLeadForm: boolean;
  onAddLead: () => void;
  onLeadAdded: () => void;
  onCancelLeadForm: () => void;
  stats: {
    totalLeads: number;
    followUps: number;
    converted: number;
    pending: number;
  };
}

export const DashboardTabContent: React.FC<DashboardTabContentProps> = ({
  activeTab,
  showAddLeadForm,
  onAddLead,
  onLeadAdded,
  onCancelLeadForm,
  stats
}) => {
  // Dashboard tab content
  if (activeTab === "dashboard") {
    return (
      <div className="space-y-4">
        <DashboardStats stats={stats} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <RecentActivitiesCard onViewAll={() => {}} />
          <QuickActionsCard onAddLead={onAddLead} />
        </div>
      </div>
    );
  }
  
  // Leads tab content
  if (activeTab === "leads") {
    return (
      <>
        {showAddLeadForm ? (
          <LeadForm onLeadAdded={onLeadAdded} onCancel={onCancelLeadForm} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Leads Management</h2>
              <Button onClick={onAddLead}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Lead
              </Button>
            </div>
            <LeadsList />
          </>
        )}
      </>
    );
  }
  
  // Clients tab content
  if (activeTab === "clients") {
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
  }
  
  // Reports tab content
  if (activeTab === "reports") {
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
  }
  
  return null;
};
