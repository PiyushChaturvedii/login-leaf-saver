
import React from 'react';
import { StatsCard } from './StatsCard';
import { Users, Phone, CheckCircle2, ChevronsRight } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalLeads: number;
    followUps: number;
    converted: number;
    pending: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Leads"
        value={stats.totalLeads}
        icon={Users}
        iconColor="text-blue-500"
        borderColor="border-blue-500"
      />
      
      <StatsCard
        title="Follow-ups"
        value={stats.followUps}
        icon={Phone}
        iconColor="text-yellow-500"
        borderColor="border-yellow-500"
      />
      
      <StatsCard
        title="Converted"
        value={stats.converted}
        icon={CheckCircle2}
        iconColor="text-green-500"
        borderColor="border-green-500"
      />
      
      <StatsCard
        title="Pending"
        value={stats.pending}
        icon={ChevronsRight}
        iconColor="text-purple-500"
        borderColor="border-purple-500"
      />
    </div>
  );
};
