
/**
 * PaymentProgress component
 * Shows a progress bar of fee payment status
 * Allows admin to record EMI payments for students
 * Enables editing of EMI amounts and previous EMI payments
 */

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { usePaymentActions } from './hooks/usePaymentActions';
import { PaymentProgressBar } from './PaymentProgressBar';
import { PaymentEmiEditor } from './PaymentEmiEditor';
import { PaymentsList } from './PaymentsList';
import { UserData } from './FeesTypes';

interface PaymentProgressProps {
  /** Student email to identify the student in localStorage */
  studentEmail: string;
  /** Fee details of the student */
  fees: NonNullable<UserData['fees']>;
}

export const PaymentProgress = ({ studentEmail, fees }: PaymentProgressProps) => {
  const {
    isEditingEmi,
    setIsEditingEmi,
    newEmiAmount,
    setNewEmiAmount,
    isEditingPayment,
    setIsEditingPayment,
    handleEmiPayment,
    handleUpdateEmiAmount,
    handleEditPayment,
    handleRemovePayment
  } = usePaymentActions(studentEmail, fees);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <PaymentProgressBar fees={fees} />
      
      {/* EMI Amount editing section */}
      <PaymentEmiEditor 
        fees={fees}
        isEditingEmi={isEditingEmi}
        setIsEditingEmi={setIsEditingEmi}
        newEmiAmount={newEmiAmount}
        setNewEmiAmount={setNewEmiAmount}
        handleUpdateEmiAmount={handleUpdateEmiAmount}
      />
      
      {/* Payments editing section */}
      <div className="mt-3 border-t pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Previous Payments:</span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsEditingPayment(!isEditingPayment)}
            className="h-7 text-xs"
          >
            {isEditingPayment ? "Done" : "Edit Payments"}
          </Button>
        </div>
        
        <PaymentsList 
          payments={fees.payments}
          isEditingPayment={isEditingPayment}
          handleEditPayment={handleEditPayment}
          handleRemovePayment={handleRemovePayment}
        />
      </div>
      
      {/* Only show payment button if there are unpaid EMIs */}
      {fees.emiPlan.paidEmis < fees.emiPlan.totalEmis && (
        <Button 
          onClick={handleEmiPayment}
          className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Record EMI Payment
        </Button>
      )}
    </div>
  );
};
