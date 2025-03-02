
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StudentStats } from './types';

interface StudentItemProps {
  email: string;
  stats: StudentStats;
  isSelected: boolean;
  onSelect: () => void;
}

export const StudentItem = ({
  email,
  stats,
  isSelected,
  onSelect
}: StudentItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            className={`w-full justify-start h-auto py-3 px-4 border ${
              isSelected 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200'
            }`}
            onClick={onSelect}
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium truncate w-full">{email.split('@')[0]}</span>
              <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                stats.percentage >= 80 ? 'bg-green-100 text-green-800' : 
                stats.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {stats.percentage}%
              </span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{email}</p>
          <p className="text-xs">{stats.attended}/{stats.totalSessions} sessions</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
