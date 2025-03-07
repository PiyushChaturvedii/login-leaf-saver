
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { FeesOverview } from './FeesOverview';
import { PaymentProgress } from './PaymentProgress';
import { PaymentHistory } from './PaymentHistory';
import { StudentInvoices } from './StudentInvoices';
import { UserData } from './FeesTypes';

interface StudentFeesDisplayProps {
  student: UserData;
  onEditFees: () => void;
}

export const StudentFeesDisplay = ({ student, onEditFees }: StudentFeesDisplayProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEditFees}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit Fees
        </Button>
      </div>
      <FeesOverview fees={student.fees} />
      <PaymentProgress studentEmail={student.email} fees={student.fees} />
      <PaymentHistory payments={student.fees.payments} />
      <StudentInvoices studentEmail={student.email} />
    </div>
  );
};
