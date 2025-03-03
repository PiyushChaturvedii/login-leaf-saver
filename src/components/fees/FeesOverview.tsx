
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Receipt, Calendar } from "lucide-react";
import { UserData } from './FeesTypes';

interface FeesOverviewProps {
  fees: NonNullable<UserData['fees']>;
}

export const FeesOverview = ({ fees }: FeesOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
        <CardContent className="pt-6">
          <h5 className="text-sm font-medium text-gray-600 mb-1">Course Fee</h5>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-gray-900">₹{fees.amount.toLocaleString('en-IN')}</p>
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Base fee without taxes</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-none">
        <CardContent className="pt-6">
          <h5 className="text-sm font-medium text-gray-600 mb-1">Total Amount</h5>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-gray-900">₹{fees.totalAmount.toLocaleString('en-IN')}</p>
            <Receipt className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Including GST @ 18%</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-none">
        <CardContent className="pt-6">
          <h5 className="text-sm font-medium text-gray-600 mb-1">EMI Plan</h5>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-gray-900">₹{fees.emiPlan?.emiAmount.toLocaleString('en-IN')}/mo</p>
            <Calendar className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">{fees.emiPlan?.totalEmis} months plan</p>
        </CardContent>
      </Card>
    </div>
  );
};
