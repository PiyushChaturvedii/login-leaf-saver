
/**
 * PaymentProgress component
 * Shows a progress bar of fee payment status
 * Allows admin to record EMI payments for students
 * Enables editing of EMI amounts
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { CheckCircle, AlertCircle, Clock, Edit } from "lucide-react";
import { toast } from "sonner";
import { calculateProgressPercentage, getStatusColor, getStatusIcon } from './FeesUtils';
import { UserData } from './FeesTypes';

interface PaymentProgressProps {
  /** Student email to identify the student in localStorage */
  studentEmail: string;
  /** Fee details of the student */
  fees: NonNullable<UserData['fees']>;
}

export const PaymentProgress = ({ studentEmail, fees }: PaymentProgressProps) => {
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

  /**
   * Renders the appropriate status icon based on payment progress
   * @returns React element representing the status icon
   */
  const renderStatusIcon = () => {
    const iconType = getStatusIcon(fees.paid, fees.totalAmount);
    if (iconType === "check-circle") {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (iconType === "clock") {
      return <Clock className="w-5 h-5 text-amber-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-medium text-gray-800">Payment Progress</h5>
        <span className="text-sm font-medium">
          {fees.emiPlan.paidEmis} of {fees.emiPlan.totalEmis} EMIs
        </span>
      </div>
      <Progress 
        value={calculateProgressPercentage(fees.paid, fees.totalAmount)} 
        className="h-2 mb-2"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>₹{fees.paid.toLocaleString('en-IN')} paid</span>
        <span>₹{(fees.totalAmount - fees.paid).toLocaleString('en-IN')} remaining</span>
      </div>
      
      {/* EMI Amount editing section */}
      <div className="mt-3 border-t pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">EMI Amount:</span>
          {isEditingEmi ? (
            <div className="flex space-x-2">
              <Input 
                type="number" 
                value={newEmiAmount} 
                onChange={(e) => setNewEmiAmount(Number(e.target.value))}
                className="w-24 h-8 py-1 text-sm"
              />
              <Button 
                size="sm" 
                onClick={handleUpdateEmiAmount}
                className="h-8 px-2 py-1 bg-green-600 hover:bg-green-700"
              >
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsEditingEmi(false);
                  setNewEmiAmount(fees.emiPlan.emiAmount);
                }}
                className="h-8 px-2 py-1"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm">₹{fees.emiPlan.emiAmount.toLocaleString('en-IN')}</span>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsEditingEmi(true)}
                className="h-6 w-6"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Only show payment button if there are unpaid EMIs */}
      {fees.emiPlan.paidEmis < fees.emiPlan.totalEmis && (
        <Button 
          onClick={handleEmiPayment}
          className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          Record EMI Payment
        </Button>
      )}
    </div>
  );
};
