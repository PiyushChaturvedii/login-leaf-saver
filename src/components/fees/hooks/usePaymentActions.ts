
import { useState } from "react";
import { toast } from "sonner";
import { UserData } from '../FeesTypes';

/**
 * Custom hook for payment-related actions
 * Provides functions for EMI payments, updating EMI amounts, and editing/removing payments
 */
export const usePaymentActions = (studentEmail: string, fees: NonNullable<UserData['fees']>) => {
  const [isEditingEmi, setIsEditingEmi] = useState(false);
  const [newEmiAmount, setNewEmiAmount] = useState(fees.emiPlan.emiAmount);
  const [isEditingPayment, setIsEditingPayment] = useState(false);

  /**
   * Handles EMI payment recording
   * Updates the student data in localStorage with new payment information
   */
  const handleEmiPayment = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: UserData) => u.email === studentEmail);
    
    // Validate if EMI payment is possible
    if (!user?.fees?.emiPlan || user.fees.emiPlan.paidEmis >= user.fees.emiPlan.totalEmis) {
      toast.error('No pending EMIs or EMI plan not set!');
      return;
    }

    // Generate receipt number, payment date and amount
    const receipt = `RCT-${new Date().getTime().toString().substring(7)}`;
    const paymentDate = new Date().toISOString();
    const paymentAmount = user.fees.emiPlan.emiAmount;

    // Update user data with new payment information
    const updatedUsers = users.map((u: UserData) =>
      u.email === studentEmail
        ? {
            ...u,
            fees: {
              ...u.fees!,
              paid: (u.fees?.paid || 0) + paymentAmount,
              lastPaid: paymentDate,
              payments: [
                ...(u.fees?.payments || []),
                {
                  amount: paymentAmount,
                  date: paymentDate,
                  receipt: receipt
                }
              ],
              emiPlan: {
                ...u.fees.emiPlan,
                paidEmis: u.fees.emiPlan.paidEmis + 1
              }
            },
          }
        : u
    );

    // Save updated data to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('EMI payment recorded successfully!');
  };

  /**
   * Handles EMI amount update
   * Updates the EMI amount for future payments
   */
  const handleUpdateEmiAmount = () => {
    if (!newEmiAmount || newEmiAmount <= 0) {
      toast.error('Please enter a valid EMI amount');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const updatedUsers = users.map((u: UserData) =>
      u.email === studentEmail
        ? {
            ...u,
            fees: {
              ...u.fees!,
              emiPlan: {
                ...u.fees!.emiPlan,
                emiAmount: newEmiAmount
              }
            },
          }
        : u
    );

    // Save updated data to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('EMI amount updated successfully!');
    setIsEditingEmi(false);
  };

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
  };
};
