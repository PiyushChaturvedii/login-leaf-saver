
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTime } from '@/utils/dateUtils';

export const RecentActivities: React.FC = () => {
  const activities = [
    {
      id: 1,
      action: "Called Rahul about Web Development course",
      time: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      type: "call"
    },
    {
      id: 2,
      action: "Added new lead: Priya Sharma",
      time: new Date(Date.now() - 120 * 60000), // 2 hours ago
      type: "lead"
    },
    {
      id: 3,
      action: "Converted Amit Kumar for Python course",
      time: new Date(Date.now() - 240 * 60000), // 4 hours ago
      type: "conversion"
    },
    {
      id: 4,
      action: "Scheduled follow-up with Sanjay for tomorrow",
      time: new Date(Date.now() - 300 * 60000), // 5 hours ago
      type: "followup"
    }
  ];

  const getActivityBorderClass = (type: string) => {
    switch (type) {
      case 'call': return 'border-l-blue-400';
      case 'lead': return 'border-l-green-400';
      case 'conversion': return 'border-l-purple-400';
      case 'followup': return 'border-l-amber-400';
      default: return 'border-l-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map(activity => (
          <div 
            key={activity.id} 
            className={`border-l-2 pl-4 py-2 ${getActivityBorderClass(activity.type)}`}
          >
            <p className="text-sm text-gray-500">{formatTime(activity.time)}</p>
            <p className="font-medium">{activity.action}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
