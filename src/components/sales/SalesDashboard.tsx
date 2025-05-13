
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SalesStats } from './SalesStats';
import { WelcomeBanner } from './WelcomeBanner';
import { MotivationalQuote } from './MotivationalQuote';
import { RecentActivities } from './RecentActivities';
import { StudentRecordsPreview } from './StudentRecordsPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Users, MessageSquare, User } from 'lucide-react';

interface SalesDashboardProps {
  userData: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({ userData, onLogout }) => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <WelcomeBanner userName={userData.name} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <SalesStats />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 space-y-6">
            <StudentRecordsPreview />
            <RecentActivities />
          </div>
          
          <div className="space-y-6">
            <MotivationalQuote />
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Access important tools quickly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/sales/records">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Student Records
                  </Button>
                </Link>
                
                <Link to="/sales/salary">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Salary & Incentives
                  </Button>
                </Link>
                
                <Link to="/sales/messages">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                </Link>
                
                <Link to="/sales/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
