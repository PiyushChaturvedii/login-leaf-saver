
import { useState, useEffect } from 'react';
import { DbService } from '@/services/DatabaseService';

interface DashboardStats {
  totalLeads: number;
  followUps: number;
  converted: number;
  pending: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    followUps: 0,
    converted: 0,
    pending: 0
  });

  const loadStats = async () => {
    // Load leads from MongoDB
    const leads = await DbService.find('crm_leads');
    
    // Calculate dashboard stats
    const totalLeads = leads.length;
    const followUps = leads.filter((lead: any) => lead.status === 'follow-up').length;
    const converted = leads.filter((lead: any) => lead.status === 'converted').length;
    const pending = leads.filter((lead: any) => lead.status === 'new').length;
    
    setStats({
      totalLeads,
      followUps,
      converted,
      pending
    });
  };

  // Initial load
  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loadStats
  };
};
