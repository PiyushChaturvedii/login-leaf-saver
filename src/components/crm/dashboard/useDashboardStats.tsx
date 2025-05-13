
import { useState, useEffect } from 'react';

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

  const loadStats = () => {
    // Load leads from localStorage
    const leads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    
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
