
/**
 * StudentFeeCard component
 * Card displaying a student's fee details
 * Shows fee overview, payment progress, and payment history
 * Allows editing fee details
 */

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FeesRegistrationForm } from './FeesRegistrationForm';
import { StudentHeader } from './StudentHeader';
import { StudentFeesDisplay } from './StudentFeesDisplay';
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
        <StudentHeader student={student} editingFees={editingFees} />

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
          <StudentFeesDisplay student={student} onEditFees={handleEditFees} />
        )}
      </CardContent>
    </Card>
  );
};
