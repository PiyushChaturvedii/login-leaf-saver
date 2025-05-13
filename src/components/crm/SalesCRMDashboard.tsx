
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardTabContent } from './dashboard/TabContent';
import { useDashboardStats } from './dashboard/useDashboardStats';

interface SalesCRMDashboardProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

export const SalesCRMDashboard: React.FC<SalesCRMDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const { stats, loadStats } = useDashboardStats();

  const handleAddLead = () => {
    setShowAddLeadForm(true);
    setActiveTab("leads");
  };

  const handleLeadAdded = () => {
    setShowAddLeadForm(false);
    toast.success("Lead added successfully!");
    loadStats(); // Refresh stats after adding a lead
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <DashboardHeader user={user} onLogout={onLogout} />

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <DashboardTabContent 
            activeTab={activeTab}
            showAddLeadForm={showAddLeadForm}
            onAddLead={handleAddLead}
            onLeadAdded={handleLeadAdded}
            onCancelLeadForm={() => setShowAddLeadForm(false)}
            stats={stats}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
