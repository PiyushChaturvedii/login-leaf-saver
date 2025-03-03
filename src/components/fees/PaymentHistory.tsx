
import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";
import { formatDate } from './FeesUtils';
import { UserData } from './FeesTypes';

interface PaymentHistoryProps {
  payments: NonNullable<UserData['fees']>['payments'];
}

export const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  if (!payments || payments.length === 0) {
    return null;
  }

  return (
    <div>
      <h5 className="font-medium text-gray-800 mb-3">Payment History</h5>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(payment.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.receipt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <Button variant="ghost" size="sm" className="flex items-center text-blue-600 hover:text-blue-800">
                      <DownloadCloud className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
