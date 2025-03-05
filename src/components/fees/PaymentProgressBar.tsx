
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { calculateProgressPercentage, getStatusIcon } from './FeesUtils';
import { UserData } from './FeesTypes';

interface PaymentProgressBarProps {
  fees: NonNullable<UserData['fees']>;
}

export const PaymentProgressBar = ({ fees }: PaymentProgressBarProps) => {
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
    <>
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
    </>
  );
};
