
import { UserData } from './FeesTypes';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface StudentHeaderProps {
  student: UserData;
  editingFees: boolean;
}

export const StudentHeader = ({ student, editingFees }: StudentHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800">{student.name}</h4>
        <p className="text-sm text-gray-600">{student.email}</p>
      </div>
      
      {/* Payment status badge - only show if fees are set and not in editing mode */}
      {student.fees?.emiPlan && !editingFees && (
        <PaymentStatusBadge fees={student.fees} />
      )}
    </div>
  );
};
