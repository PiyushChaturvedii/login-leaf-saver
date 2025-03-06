
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Edit, Save, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentRecordItemProps {
  date: string;
  sessionName: string | undefined;
  present: boolean;
  leave?: boolean;
  recordId: string;
  studentEmail: string;
  onEditAttendance: (id: string, email: string, status: "present" | "absent" | "leave") => void;
}

export const StudentRecordItem = ({
  date,
  sessionName,
  present,
  leave = false,
  recordId,
  studentEmail,
  onEditAttendance
}: StudentRecordItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<"present" | "absent" | "leave">(
    leave ? "leave" : (present ? "present" : "absent")
  );
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    onEditAttendance(recordId, studentEmail, status);
    setIsEditing(false);
  };

  const getStatusIcon = () => {
    if (leave) return <RefreshCw className="w-4 h-4 text-amber-500" />;
    if (present) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };
  
  const getStatusText = () => {
    if (leave) return "Leave";
    if (present) return "Present";
    return "Absent";
  };
  
  return (
    <div className={`text-sm grid grid-cols-6 p-2 border-b border-gray-100 bg-white`}>
      <div className="col-span-2">{new Date(date).toLocaleDateString()}</div>
      <div className="col-span-3">{sessionName || 'Regular Session'}</div>
      <div className="text-center">
        {isEditing ? (
          <div className="flex items-center justify-center space-x-1">
            <Select value={status} onValueChange={(val) => setStatus(val as any)}>
              <SelectTrigger className="h-7 w-24">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              variant="outline"
              className="h-7 px-2 text-green-600 border-green-200 hover:bg-green-50 ml-1"
              onClick={handleSave}
            >
              <Save className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-1">
            {getStatusIcon()}
            <span className="text-xs ml-1">{getStatusText()}</span>
            <Button 
              size="sm" 
              variant="ghost"
              className="h-6 w-6 p-0 text-gray-500 hover:text-indigo-600 ml-1"
              onClick={handleEdit}
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
