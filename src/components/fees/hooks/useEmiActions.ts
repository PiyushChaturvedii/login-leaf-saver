
import { useState } from "react";
import { toast } from "sonner";
import { UserData } from '../FeesTypes';
import { updateUserInStorage } from '../utils/storageUtils';

/**
 * Custom hook for EMI-related actions
 * Provides functions for updating EMI amounts and making EMI payments
 */
export const useEmiActions = (studentEmail: string, fees: NonNullable<UserData['fees']>) => {
  const [isEditingEmi, setIsEditingEmi] = useState(false);
  const [newEmiAmount, setNewEmiAmount] = useState(fees.emiPlan.emiAmount);

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

  return {
    isEditingEmi,
    setIsEditingEmi,
    newEmiAmount,
    setNewEmiAmount,
    handleEmiPayment,
    handleUpdateEmiAmount
  };
};
