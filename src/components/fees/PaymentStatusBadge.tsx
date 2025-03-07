
import { UserData } from './FeesTypes';

interface PaymentStatusBadgeProps {
  fees: NonNullable<UserData['fees']>;
}

export const PaymentStatusBadge = ({ fees }: PaymentStatusBadgeProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
      {fees.paid >= fees.totalAmount 
        ? <div className="w-5 h-5 text-green-600">✓</div> 
        : fees.paid >= (fees.totalAmount * 0.5)
          ? <div className="w-5 h-5 text-amber-500">⏱</div>
          : <div className="w-5 h-5 text-red-500">⚠</div>}
      <span className={`text-sm font-medium ${
        fees.paid >= fees.totalAmount 
          ? "text-green-600" 
          : fees.paid >= (fees.totalAmount * 0.5)
            ? "text-amber-500"
            : "text-red-500"
      }`}>
        {fees.paid >= fees.totalAmount 
          ? 'Fully Paid' 
          : `${Math.round((fees.paid / fees.totalAmount) * 100)}% Paid`}
      </span>
    </div>
  );
};
