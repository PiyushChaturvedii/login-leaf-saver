
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudentStats } from './types';

interface AttendanceStatsProps {
  stats: StudentStats;
  isInstructor?: boolean;
}

export const AttendanceStats = ({ stats, isInstructor }: AttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
        <h4 className="text-sm font-medium text-indigo-500 mb-2">
          {isInstructor ? 'Average Attendance' : 'My Attendance'}
        </h4>
        <div className="flex items-end">
          <span className="text-3xl font-bold text-indigo-700">{stats.percentage}%</span>
          <span className="text-sm text-indigo-400 ml-2 mb-1">
            {isInstructor ? 'of classes' : 'overall'}
          </span>
        </div>
        <Progress value={stats.percentage} className="h-2 mt-2" />
      </Card>
      
      <Card className="p-4 border border-indigo-100 bg-gradient-to-br from-purple-50 to-white md:col-span-2">
        <h4 className="text-sm font-medium text-purple-500 mb-2">
          {isInstructor ? 'Total Sessions' : 'Session Summary'}
        </h4>
        {isInstructor ? (
          <div className="flex items-end">
            <span className="text-3xl font-bold text-purple-700">{stats.totalSessions}</span>
            <span className="text-sm text-purple-400 ml-2 mb-1">sessions recorded</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-purple-700">{stats.attended}</span>
              <span className="text-sm text-purple-400 ml-1">attended</span>
            </div>
            <div>
              <span className="text-xl font-bold text-purple-700">{stats.totalSessions - stats.attended}</span>
              <span className="text-sm text-purple-400 ml-1">missed</span>
            </div>
            <div>
              <span className="text-xl font-bold text-purple-700">{stats.totalSessions}</span>
              <span className="text-sm text-purple-400 ml-1">total</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
