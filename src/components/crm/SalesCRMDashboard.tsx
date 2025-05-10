
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Phone, CheckCircle2, ChevronsRight, UserPlus, FileText, BarChart } from "lucide-react";
import { LeadsList } from './LeadsList';
import { LeadForm } from './LeadForm';
import { toast } from 'sonner';

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
  const [stats, setStats] = useState({
    totalLeads: 0,
    followUps: 0,
    converted: 0,
    pending: 0
  });

  useEffect(() => {
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
  }, [showAddLeadForm]);

  const handleAddLead = () => {
    setShowAddLeadForm(true);
    setActiveTab("leads");
  };

  const handleLeadAdded = () => {
    setShowAddLeadForm(false);
    toast.success("Lead added successfully!");
    
    // Refresh stats
    const leads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Sales CRM Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">Sales Executive</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white shadow-sm border-l-4 border-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  Total Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalLeads}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border-l-4 border-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-yellow-500" />
                  Follow-ups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.followUps}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border-l-4 border-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                  Converted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.converted}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border-l-4 border-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ChevronsRight className="w-4 h-4 mr-2 text-purple-500" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your recent lead interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-2 border-blue-400 pl-3 py-2">
                  <p className="text-sm text-gray-600">Today, 10:30 AM</p>
                  <p className="font-medium">Called Rahul Singh about course inquiry</p>
                </div>
                <div className="border-l-2 border-green-400 pl-3 py-2">
                  <p className="text-sm text-gray-600">Yesterday, 3:45 PM</p>
                  <p className="font-medium">Converted lead: Priya Sharma enrolled in Web Dev</p>
                </div>
                <div className="border-l-2 border-yellow-400 pl-3 py-2">
                  <p className="text-sm text-gray-600">Yesterday, 11:15 AM</p>
                  <p className="font-medium">Follow-up scheduled with Amit Kumar</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("leads")}>
                  View All Activities
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common sales tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleAddLead} className="w-full justify-start bg-blue-600 hover:bg-blue-700">
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
          </div>
        </TabsContent>
        
        <TabsContent value="leads">
          {showAddLeadForm ? (
            <LeadForm onLeadAdded={handleLeadAdded} onCancel={() => setShowAddLeadForm(false)} />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Leads Management</h2>
                <Button onClick={handleAddLead}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Lead
                </Button>
              </div>
              <LeadsList />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="clients">
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
        </TabsContent>
        
        <TabsContent value="reports">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Making sure the LogOut is imported
import { LogOut } from 'lucide-react';
