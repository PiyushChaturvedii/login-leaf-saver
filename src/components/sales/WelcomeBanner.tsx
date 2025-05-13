
import React from 'react';
import { getCurrentTime } from '@/utils/dateUtils';

interface WelcomeBannerProps {
  userName: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  const { greeting } = getCurrentTime();

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">
            {greeting}, {userName}!
          </h1>
          <p className="text-green-600 mt-2">
            Ready to achieve your sales goals today? Your pipeline is waiting!
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-right">
            <span className="block text-sm text-green-600">Today's Target</span>
            <span className="text-xl font-bold text-green-800">5 Conversions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
