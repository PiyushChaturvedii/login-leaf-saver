
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserData {
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  fees?: {
    amount: number;
    gstAmount: number;
    totalAmount: number;
    paid: number;
    lastPaid?: string;
    emiPlan?: {
      totalEmis: number;
      paidEmis: number;
      emiAmount: number;
    };
  };
}

export const AdminFees = () => {
  const [feesAmount, setFeesAmount] = useState<number>(0);
  const [selectedEmiPlan, setSelectedEmiPlan] = useState<string>("3");

  const calculateGST = (amount: number) => {
    return amount * 0.18; // 18% GST
  };

  const calculateEmiAmount = (totalAmount: number, numberOfEmis: number) => {
    return Math.ceil(totalAmount / numberOfEmis);
  };

  const handleFeesRegistration = (studentEmail: string, baseAmount: number, emiPlan: number) => {
    const gstAmount = calculateGST(baseAmount);
    const totalAmount = baseAmount + gstAmount;
    const emiAmount = calculateEmiAmount(totalAmount, emiPlan);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: UserData) =>
      user.email === studentEmail
        ? {
            ...user,
            fees: {
              amount: baseAmount,
              gstAmount: gstAmount,
              totalAmount: totalAmount,
              paid: 0,
              emiPlan: {
                totalEmis: emiPlan,
                paidEmis: 0,
                emiAmount: emiAmount
              }
            },
          }
        : user
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('Fees registration successful!');
  };

  const handleEmiPayment = (studentEmail: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: UserData) => u.email === studentEmail);
    
    if (!user?.fees?.emiPlan || user.fees.emiPlan.paidEmis >= user.fees.emiPlan.totalEmis) {
      toast.error('No pending EMIs or EMI plan not set!');
      return;
    }

    const updatedUsers = users.map((u: UserData) =>
      u.email === studentEmail
        ? {
            ...u,
            fees: {
              ...u.fees!,
              paid: (u.fees?.paid || 0) + u.fees.emiPlan.emiAmount,
              lastPaid: new Date().toISOString(),
              emiPlan: {
                ...u.fees.emiPlan,
                paidEmis: u.fees.emiPlan.paidEmis + 1
              }
            },
          }
        : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('EMI payment recorded successfully!');
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Fees Management</h3>
      <div className="space-y-6">
        {JSON.parse(localStorage.getItem('users') || '[]')
          .filter((user: UserData) => user.role === 'student')
          .map((student: UserData) => (
            <div key={student.email} className="border p-4 rounded-lg">
              <h4 className="font-medium">{student.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{student.email}</p>

              {!student.fees?.emiPlan ? (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">Base Amount (₹)</label>
                      <Input
                        type="number"
                        placeholder="Enter base amount"
                        onChange={(e) => setFeesAmount(Number(e.target.value))}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">EMI Plan</label>
                      <Select defaultValue={selectedEmiPlan} onValueChange={setSelectedEmiPlan}>
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
                  <Button 
                    onClick={() => handleFeesRegistration(student.email, feesAmount, parseInt(selectedEmiPlan))}
                    className="w-full"
                  >
                    Register Fees
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Base Amount</p>
                      <p className="font-medium">₹{student.fees.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">GST (18%)</p>
                      <p className="font-medium">₹{student.fees.gstAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium">₹{student.fees.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="font-medium">₹{student.fees.paid}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">EMI Amount</p>
                      <p className="font-medium">₹{student.fees.emiPlan.emiAmount}/month</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">EMIs Paid</p>
                      <p className="font-medium">{student.fees.emiPlan.paidEmis} of {student.fees.emiPlan.totalEmis}</p>
                    </div>
                  </div>
                  {student.fees.lastPaid && (
                    <p className="text-sm text-gray-600">
                      Last Paid: {new Date(student.fees.lastPaid).toLocaleDateString()}
                    </p>
                  )}
                  {student.fees.emiPlan.paidEmis < student.fees.emiPlan.totalEmis && (
                    <Button 
                      onClick={() => handleEmiPayment(student.email)}
                      className="w-full"
                    >
                      Record EMI Payment
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </Card>
  );
};

