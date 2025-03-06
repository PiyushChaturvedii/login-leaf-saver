
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentStats } from './types';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface StudentItemProps {
  email: string;
  stats: StudentStats;
  isSelected: boolean;
  onSelect: () => void;
  onQuickMark?: (email: string, status: "present" | "absent" | "leave") => void;
  showQuickButtons?: boolean;
}

export const StudentItem = ({
  email,
  stats,
  isSelected,
  onSelect,
  onQuickMark,
  showQuickButtons = false
}: StudentItemProps) => {
  const displayName = email.split('@')[0];
  
  return (
    <Card 
      className={`cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md
        ${isSelected ? 'ring-2 ring-indigo-400 shadow-md' : 'shadow-sm'}
      `}
      onClick={onSelect}
    >
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm truncate" title={email}>{displayName}</h4>
          <div className={`text-xs font-medium px-2 py-0.5 rounded-full
            ${stats.percentage >= 75 ? 'bg-green-100 text-green-800' : 
             stats.percentage >= 50 ? 'bg-amber-100 text-amber-800' : 
             'bg-red-100 text-red-800'}
          `}>
            {stats.percentage}%
          </div>
        </div>
        
        <div className="text-xs text-gray-500 flex justify-between">
          <span>Present: {stats.attended}/{stats.totalSessions}</span>
          {stats.leaves > 0 && <span>Leaves: {stats.leaves}</span>}
        </div>

        {showQuickButtons && onQuickMark && (
          <div className="flex space-x-1 pt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-7 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={(e) => {
                e.stopPropagation();
                onQuickMark(email, "present");
              }}
            >
              <CheckCircle className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-7 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
              onClick={(e) => {
                e.stopPropagation();
                onQuickMark(email, "leave");
              }}
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-7 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onQuickMark(email, "absent");
              }}
            >
              <XCircle className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
