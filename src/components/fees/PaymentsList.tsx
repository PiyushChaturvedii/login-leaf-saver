
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { UserData } from './FeesTypes';

interface PaymentsListProps {
  payments: NonNullable<UserData['fees']>['payments'];
  isEditingPayment: boolean;
  handleEditPayment: (index: number, newAmount: number) => void;
  handleRemovePayment: (index: number) => void;
}

export const PaymentsList = ({
  payments,
  isEditingPayment,
  handleEditPayment,
  handleRemovePayment
}: PaymentsListProps) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic text-center py-2">
        No payments recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {payments.map((payment, index) => (
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
  );
};
