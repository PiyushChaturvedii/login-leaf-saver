
import React from 'react';
import { DashboardStats } from '../DashboardStats';
import { RecentActivitiesCard } from '../RecentActivitiesCard';
import { QuickActionsCard } from '../QuickActionsCard';

interface DashboardTabContentProps {
  stats: {
    totalLeads: number;
    followUps: number;
    converted: number;
    pending: number;
  };
  onAddLead: () => void;
}

export const DashboardTabContent: React.FC<DashboardTabContentProps> = ({ stats, onAddLead }) => {
  return (
    <div className="space-y-4">
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <RecentActivitiesCard onViewAll={() => {}} />
        <QuickActionsCard onAddLead={onAddLead} />
      </div>
    </div>
  );
};
