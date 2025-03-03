
/**
 * StudentFeeCard component
 * Card displaying a student's fee details
 * Shows fee overview, payment progress, and payment history
 * Allows editing fee details
 */

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { FeesRegistrationForm } from './FeesRegistrationForm';
import { FeesOverview } from './FeesOverview';
import { PaymentProgress } from './PaymentProgress';
import { PaymentHistory } from './PaymentHistory';
import { UserData } from './FeesTypes';

interface StudentFeeCardProps {
  /** Student data with fee details */
  student: UserData;
}

export const StudentFeeCard = ({ student }: StudentFeeCardProps) => {
  // State to control fee editing mode
  const [editingFees, setEditingFees] = useState(false);

  /**
   * Handles click on Edit Fees button
   * Enables editing mode
   */
  const handleEditFees = () => {
    setEditingFees(true);
  };

  /**
   * Handles cancellation of fee editing
   * Disables editing mode without saving changes
   */
  const handleCancelEdit = () => {
    setEditingFees(false);
  };

  /**
   * Handles completion of fee update
   * Disables editing mode after successful update
   */
  const handleUpdateComplete = () => {
    setEditingFees(false);
  };

  return (
    <Card key={student.email} className="overflow-hidden bg-gradient-to-r from-gray-50 to-white border-gray-100">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{student.name}</h4>
            <p className="text-sm text-gray-600">{student.email}</p>
          </div>
          
          {/* Payment status badge - only show if fees are set and not in editing mode */}
          {student.fees?.emiPlan && !editingFees && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
              {student.fees.paid >= student.fees.totalAmount 
                ? <div className="w-5 h-5 text-green-600">✓</div> 
                : student.fees.paid >= (student.fees.totalAmount * 0.5)
                  ? <div className="w-5 h-5 text-amber-500">⏱</div>
                  : <div className="w-5 h-5 text-red-500">⚠</div>}
              <span className={`text-sm font-medium ${
                student.fees.paid >= student.fees.totalAmount 
                  ? "text-green-600" 
                  : student.fees.paid >= (student.fees.totalAmount * 0.5)
                    ? "text-amber-500"
                    : "text-red-500"
              }`}>
                {student.fees.paid >= student.fees.totalAmount 
                  ? 'Fully Paid' 
                  : `${Math.round((student.fees.paid / student.fees.totalAmount) * 100)}% Paid`}
              </span>
            </div>
          )}
        </div>

        {/* Show registration form if fees not set or editing mode is active */}
        {(!student.fees?.emiPlan || editingFees) ? (
          <FeesRegistrationForm 
            studentEmail={student.email}
            initialAmount={student.fees?.amount}
            initialEmiPlan={student.fees?.emiPlan?.totalEmis.toString()}
            isEditing={!!student.fees?.emiPlan}
            onCancel={handleCancelEdit}
            onComplete={handleUpdateComplete}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEditFees}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Fees
              </Button>
            </div>
            <FeesOverview fees={student.fees} />
            <PaymentProgress studentEmail={student.email} fees={student.fees} />
            <PaymentHistory payments={student.fees.payments} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
