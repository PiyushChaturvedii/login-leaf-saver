
/**
 * PaymentProgress component
 * Shows a progress bar of fee payment status
 * Allows admin to record EMI payments for students
 * Enables editing of EMI amounts and previous EMI payments
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Edit,
  Trash2,
  PlusCircle 
} from "lucide-react";
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
        
        {fees.payments && fees.payments.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {fees.payments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 rounded bg-white">
                <div className="flex-1">
                  <div className="font-medium">₹{payment.amount.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
                </div>
                
                {isEditingPayment && (
                  <div className="flex items-center space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => {
                        // Create a modal or inline edit form
                        const newAmount = window.prompt("Enter new payment amount:", payment.amount.toString());
                        if (newAmount) {
                          handleEditPayment(index, parseFloat(newAmount));
                        }
                      }}
                      className="h-7 w-7"
                    >
                      <Edit className="h-3.5 w-3.5 text-blue-500" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to remove this payment?")) {
                          handleRemovePayment(index);
                        }
                      }}
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic text-center py-2">
            No payments recorded yet
          </div>
        )}
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
