
/**
 * PaymentProgressContainer component
 * Main container that orchestrates the payment progress UI
 */

import { UserData } from './FeesTypes';
import { PaymentProgressBar } from './PaymentProgressBar';
import { PaymentEmiEditor } from './PaymentEmiEditor';
import { PaymentsList } from './PaymentsList';
import { PaymentActionButton } from './PaymentActionButton';
import { usePaymentActions } from './hooks/usePaymentActions';

interface PaymentProgressContainerProps {
  /** Student email to identify the student in localStorage */
  studentEmail: string;
  /** Fee details of the student */
  fees: NonNullable<UserData['fees']>;
}

export const PaymentProgressContainer = ({ studentEmail, fees }: PaymentProgressContainerProps) => {
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
      
      <PaymentEmiEditor 
        fees={fees}
        isEditingEmi={isEditingEmi}
        setIsEditingEmi={setIsEditingEmi}
        newEmiAmount={newEmiAmount}
        setNewEmiAmount={setNewEmiAmount}
        handleUpdateEmiAmount={handleUpdateEmiAmount}
      />
      
      <PaymentsList 
        payments={fees.payments}
        isEditingPayment={isEditingPayment}
        setIsEditingPayment={setIsEditingPayment}
        handleEditPayment={handleEditPayment}
        handleRemovePayment={handleRemovePayment}
      />
      
      {fees.emiPlan.paidEmis < fees.emiPlan.totalEmis && (
        <PaymentActionButton onClick={handleEmiPayment} />
      )}
    </div>
  );
};
