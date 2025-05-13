
import React from 'react';
import { DashboardTabContent } from './DashboardTabContent';
import { LeadsTabContent } from './LeadsTabContent';
import { ClientsTabContent } from './ClientsTabContent';
import { ReportsTabContent } from './ReportsTabContent';

interface TabsContentProps {
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

export const TabsContent: React.FC<TabsContentProps> = ({
  activeTab,
  showAddLeadForm,
  onAddLead,
  onLeadAdded,
  onCancelLeadForm,
  stats
}) => {
  // Return the appropriate tab content based on the active tab
  switch (activeTab) {
    case "dashboard":
      return (
        <DashboardTabContent 
          stats={stats}
          onAddLead={onAddLead}
        />
      );
    case "leads":
      return (
        <LeadsTabContent
          showAddLeadForm={showAddLeadForm}
          onAddLead={onAddLead}
          onLeadAdded={onLeadAdded}
          onCancelLeadForm={onCancelLeadForm}
        />
      );
    case "clients":
      return <ClientsTabContent />;
    case "reports":
      return <ReportsTabContent />;
    default:
      return null;
  }
};
