
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle2, Phone, TrendingUp } from 'lucide-react';

export const SalesStats: React.FC = () => {
  // In a real app, these would come from an API or context
  const stats = {
    newLeads: 18,
    conversions: 5,
    followUps: 12,
    conversionRate: 28 // percentage
  };

  return (
    <>
      <Card className="bg-white border-l-4 border-blue-500 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Leads</p>
              <p className="text-2xl font-bold">{stats.newLeads}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-l-4 border-green-500 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversions</p>
              <p className="text-2xl font-bold">{stats.conversions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-l-4 border-amber-500 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-full mr-4">
              <Phone className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Follow Ups</p>
              <p className="text-2xl font-bold">{stats.followUps}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-l-4 border-purple-500 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold">{stats.conversionRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
