
import { UserData } from '../FeesTypes';
import { useEmiActions } from './useEmiActions';
import { usePaymentEditing } from './usePaymentEditing';

/**
 * Combines payment-related hooks into a single interface
 * This hook serves as the main entry point for all payment actions
 */
export const usePaymentActions = (studentEmail: string, fees: NonNullable<UserData['fees']>) => {
  const emiActions = useEmiActions(studentEmail, fees);
  const paymentEditing = usePaymentEditing(studentEmail);

  return {
    ...emiActions,
    ...paymentEditing
  };
};
