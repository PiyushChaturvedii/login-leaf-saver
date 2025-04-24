
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentReminderProps {
  userEmail: string;
}

export const PaymentReminder = ({ userEmail }: PaymentReminderProps) => {
  const navigate = useNavigate();
  const fees = JSON.parse(localStorage.getItem('fees') || '[]');

  // Find current user's fee record
  const userFee = fees.find((fee: any) => fee.studentEmail === userEmail);
  
  if (!userFee) {
    return null;
  }

  const pendingAmount = userFee.totalAmount - userFee.paidAmount;
  
  // If all payments are made, show a different message
  if (pendingAmount <= 0) {
    return (
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-emerald-700 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            भुगतान स्थिति
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-emerald-600">
            सभी भुगतान पूरे हो गए हैं। धन्यवाद!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate next payment date (for demo purposes, set to a week from now)
  const today = new Date();
  const nextPaymentDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const formattedDate = nextPaymentDate.toLocaleDateString('hi-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Card className="overflow-hidden border-orange-100 animate-pulse-soft">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-orange-500" />
          आगामी EMI अनुस्मारक
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">अगला भुगतान देय</p>
            <p className="font-medium">{formattedDate}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">राशि</p>
            <p className="font-medium">₹{pendingAmount.toLocaleString('hi-IN')}</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/fees')} 
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          भुगतान विवरण देखें
        </Button>
      </CardContent>
    </Card>
  );
};
