
/**
 * FeesRegistrationForm component
 * Form for registering or updating student fees
 * Allows setting base amount and EMI plan
 */

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Edit } from "lucide-react";
import { toast } from "sonner";
import { calculateGST, calculateEmiAmount } from './FeesUtils';
import { UserData } from './FeesTypes';

interface FeesRegistrationFormProps {
  /** Student email to identify the student in localStorage */
  studentEmail: string;
  /** Initial base amount value (for editing mode) */
  initialAmount?: number;
  /** Initial EMI plan value (for editing mode) */
  initialEmiPlan?: string;
  /** Whether the form is in editing mode */
  isEditing: boolean;
  /** Callback when edit is canceled */
  onCancel?: () => void;
  /** Callback when registration or update is completed */
  onComplete: () => void;
}

export const FeesRegistrationForm = ({
  studentEmail,
  initialAmount = 0,
  initialEmiPlan = "3",
  isEditing,
  onCancel,
  onComplete
}: FeesRegistrationFormProps) => {
  // Form state
  const [feesAmount, setFeesAmount] = useState<number>(initialAmount);
  const [selectedEmiPlan, setSelectedEmiPlan] = useState<string>(initialEmiPlan);

  // Update state when props change
  useEffect(() => {
    setFeesAmount(initialAmount);
    setSelectedEmiPlan(initialEmiPlan);
  }, [initialAmount, initialEmiPlan]);

  /**
   * Handles initial fees registration
   * Creates new fees record for student
   */
  const handleFeesRegistration = () => {
    const gstAmount = calculateGST(feesAmount);
    const totalAmount = feesAmount + gstAmount;
    const emiAmount = calculateEmiAmount(totalAmount, parseInt(selectedEmiPlan));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: UserData) =>
      user.email === studentEmail
        ? {
            ...user,
            fees: {
              amount: feesAmount,
              gstAmount: gstAmount,
              totalAmount: totalAmount,
              paid: 0,
              payments: [],
              emiPlan: {
                totalEmis: parseInt(selectedEmiPlan),
                paidEmis: 0,
                emiAmount: emiAmount
              }
            },
          }
        : user
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('Fees registration successful!');
    onComplete();
  };

  /**
   * Handles fees update
   * Updates existing fees record while preserving payment history
   */
  const handleUpdateFees = () => {
    const gstAmount = calculateGST(feesAmount);
    const totalAmount = feesAmount + gstAmount;
    const emiAmount = calculateEmiAmount(totalAmount, parseInt(selectedEmiPlan));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: UserData) => u.email === studentEmail);
    
    // Preserve existing payment data
    const paidAmount = user?.fees?.paid || 0;
    const paidEmis = user?.fees?.emiPlan?.paidEmis || 0;
    
    const updatedUsers = users.map((user: UserData) =>
      user.email === studentEmail
        ? {
            ...user,
            fees: {
              amount: feesAmount,
              gstAmount: gstAmount,
              totalAmount: totalAmount,
              paid: paidAmount,
              payments: user.fees?.payments || [],
              lastPaid: user.fees?.lastPaid,
              emiPlan: {
                totalEmis: parseInt(selectedEmiPlan),
                paidEmis: paidEmis,
                emiAmount: emiAmount
              }
            },
          }
        : user
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('Fees updated successfully!');
    onComplete();
  };

  return (
    <div className="space-y-5 p-4 bg-gray-50 rounded-lg">
      <h5 className="font-medium text-gray-800">
        {isEditing ? "Update Course Fees" : "Register Course Fees"}
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Base Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <Input
              type="number"
              className="pl-7"
              placeholder="Enter base amount"
              value={feesAmount || ''}
              onChange={(e) => setFeesAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">EMI Plan</label>
          <Select value={selectedEmiPlan} onValueChange={setSelectedEmiPlan}>
            <SelectTrigger>
              <SelectValue placeholder="Select EMI plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button 
              onClick={handleUpdateFees}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Update Fees
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleFeesRegistration}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Register Fees
          </Button>
        )}
      </div>
    </div>
  );
};
