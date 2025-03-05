
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  if (!stats.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 animate-fade-in">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <CardContent className="p-0 h-full">
            <div className={`flex items-center p-5 ${stat.color} text-white h-full`}>
              <div className="mr-4 bg-white/20 p-3 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center text-xs mt-1">
                    <span className={`
                      ${stat.trend === 'up' ? 'text-green-200' : ''}
                      ${stat.trend === 'down' ? 'text-red-200' : ''}
                      ${stat.trend === 'neutral' ? 'text-blue-200' : ''}
                    `}>
                      {stat.trend === 'up' && '↑ '}
                      {stat.trend === 'down' && '↓ '}
                      {stat.trendValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
