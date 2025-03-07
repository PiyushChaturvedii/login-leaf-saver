
/**
 * PaymentProgress component
 * Shows a progress bar of fee payment status
 * Allows admin to record EMI payments for students
 * Enables editing of EMI amounts and previous EMI payments
 */

import { UserData } from './FeesTypes';
import { PaymentProgressContainer } from './PaymentProgressContainer';

interface PaymentProgressProps {
  /** Student email to identify the student in localStorage */
  studentEmail: string;
  /** Fee details of the student */
  fees: NonNullable<UserData['fees']>;
}

export const PaymentProgress = ({ studentEmail, fees }: PaymentProgressProps) => {
  return (
    <PaymentProgressContainer studentEmail={studentEmail} fees={fees} />
  );
};
