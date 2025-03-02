
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Edit, Save } from 'lucide-react';

interface StudentRecordItemProps {
  date: string;
  sessionName: string | undefined;
  present: boolean;
  recordId: string;
  studentEmail: string;
  onEditAttendance: (id: string, email: string, present: boolean) => void;
}

export const StudentRecordItem = ({
  date,
  sessionName,
  present,
  recordId,
  studentEmail,
  onEditAttendance
}: StudentRecordItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    onEditAttendance(recordId, studentEmail, !present);
    setIsEditing(false);
  };
  
  return (
    <div className={`text-sm grid grid-cols-6 p-2 border-b border-gray-100 bg-white`}>
      <div className="col-span-2">{new Date(date).toLocaleDateString()}</div>
      <div className="col-span-3">{sessionName || 'Regular Session'}</div>
      <div className="text-center">
        {isEditing ? (
          <div className="flex items-center justify-center space-x-1">
            <Button 
              size="sm" 
              variant="outline"
              className="h-6 px-2 text-green-600 border-green-200 hover:bg-green-50"
              onClick={handleSave}
            >
              <Save className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-1">
            {present ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <Button 
              size="sm" 
              variant="ghost"
              className="h-6 w-6 p-0 text-gray-500 hover:text-indigo-600"
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
