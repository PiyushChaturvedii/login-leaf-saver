
import { useState } from "react";
import { toast } from "sonner";
import { UserData } from '../FeesTypes';

/**
 * Custom hook for payment editing actions
 * Provides functions for editing and removing existing payments
 */
export const usePaymentEditing = (studentEmail: string) => {
  const [isEditingPayment, setIsEditingPayment] = useState(false);

  /**
   * Edits a previous payment
   * @param index Index of the payment in the payments array
   * @param newAmount New amount for the payment
   */
  const handleEditPayment = (index: number, newAmount: number) => {
    if (!newAmount || newAmount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: UserData) => u.email === studentEmail);
    
    if (!user?.fees?.payments || user.fees.payments.length <= index) {
      toast.error('Payment not found!');
      return;
    }

    // Calculate the difference in amount
    const oldAmount = user.fees.payments[index].amount;
    const amountDifference = newAmount - oldAmount;
    
    // Update the payment and total paid amount
    const updatedPayments = [...user.fees.payments];
    updatedPayments[index] = {
      ...updatedPayments[index],
      amount: newAmount
    };
    
    const updatedUsers = users.map((u: UserData) =>
      u.email === studentEmail
        ? {
            ...u,
            fees: {
              ...u.fees!,
              paid: u.fees!.paid + amountDifference,
              payments: updatedPayments,
            },
          }
        : u
    );

    // Save updated data to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('Payment updated successfully!');
    setIsEditingPayment(false);
  };

  /**
   * Removes a previous payment
   * @param index Index of the payment in the payments array
   */
  const handleRemovePayment = (index: number) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: UserData) => u.email === studentEmail);
    
    if (!user?.fees?.payments || user.fees.payments.length <= index) {
      toast.error('Payment not found!');
      return;
    }

    // Get amount of the payment to be removed
    const paymentAmount = user.fees.payments[index].amount;
    
    // Calculate new paidEmis count
    const newPaidEmis = Math.max(0, user.fees.emiPlan.paidEmis - 1);
    
    // Create new payments array without the removed payment
    const updatedPayments = user.fees.payments.filter((_, i) => i !== index);
    
    const updatedUsers = users.map((u: UserData) =>
      u.email === studentEmail
        ? {
            ...u,
            fees: {
              ...u.fees!,
              paid: Math.max(0, u.fees!.paid - paymentAmount),
              payments: updatedPayments,
              emiPlan: {
                ...u.fees!.emiPlan,
                paidEmis: newPaidEmis
              }
            },
          }
        : u
    );

    // Save updated data to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('Payment removed successfully!');
  };

  return {
    isEditingPayment,
    setIsEditingPayment,
    handleEditPayment,
    handleRemovePayment
  };
};
