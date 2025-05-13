
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, iconColor, borderColor }) => {
  return (
    <Card className={`bg-white shadow-sm border-l-4 ${borderColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Icon className={`w-4 h-4 mr-2 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};
