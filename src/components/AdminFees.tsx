
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Receipt, Calendar, CheckCircle, AlertCircle, Clock, DownloadCloud } from "lucide-react";

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
    payments?: {
      amount: number;
      date: string;
      receipt: string;
    }[];
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
              payments: [],
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

    const receipt = `RCT-${new Date().getTime().toString().substring(7)}`;
    const paymentDate = new Date().toISOString();
    const paymentAmount = user.fees.emiPlan.emiAmount;

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

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('EMI payment recorded successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    });
  };

  const calculateProgressPercentage = (paid: number, total: number) => {
    return (paid / total) * 100;
  };

  const getStatusColor = (paid: number, total: number) => {
    const percentage = (paid / total) * 100;
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getStatusIcon = (paid: number, total: number) => {
    const percentage = (paid / total) * 100;
    if (percentage >= 100) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (percentage >= 50) return <Clock className="w-5 h-5 text-amber-500" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-gray-800">Fees Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {JSON.parse(localStorage.getItem('users') || '[]')
              .filter((user: UserData) => user.role === 'student')
              .map((student: UserData) => (
                <Card key={student.email} className="overflow-hidden bg-gradient-to-r from-gray-50 to-white border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      
                      {student.fees?.emiPlan && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                          {getStatusIcon(student.fees.paid, student.fees.totalAmount)}
                          <span className={`text-sm font-medium ${getStatusColor(student.fees.paid, student.fees.totalAmount)}`}>
                            {student.fees.paid >= student.fees.totalAmount 
                              ? 'Fully Paid' 
                              : `${Math.round((student.fees.paid / student.fees.totalAmount) * 100)}% Paid`}
                          </span>
                        </div>
                      )}
                    </div>

                    {!student.fees?.emiPlan ? (
                      <div className="space-y-5 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-800">Register Course Fees</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Base Amount (₹)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                              <Input
                                type="number"
                                className="pl-7"
                                placeholder="Enter base amount"
                                onChange={(e) => setFeesAmount(Number(e.target.value))}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">EMI Plan</label>
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
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Register Fees
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
                            <CardContent className="pt-6">
                              <h5 className="text-sm font-medium text-gray-600 mb-1">Course Fee</h5>
                              <div className="flex justify-between items-center">
                                <p className="text-2xl font-bold text-gray-900">₹{student.fees.amount.toLocaleString('en-IN')}</p>
                                <CreditCard className="h-5 w-5 text-blue-600" />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Base fee without taxes</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-none">
                            <CardContent className="pt-6">
                              <h5 className="text-sm font-medium text-gray-600 mb-1">Total Amount</h5>
                              <div className="flex justify-between items-center">
                                <p className="text-2xl font-bold text-gray-900">₹{student.fees.totalAmount.toLocaleString('en-IN')}</p>
                                <Receipt className="h-5 w-5 text-emerald-600" />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Including GST @ 18%</p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-none">
                            <CardContent className="pt-6">
                              <h5 className="text-sm font-medium text-gray-600 mb-1">EMI Plan</h5>
                              <div className="flex justify-between items-center">
                                <p className="text-2xl font-bold text-gray-900">₹{student.fees.emiPlan.emiAmount.toLocaleString('en-IN')}/mo</p>
                                <Calendar className="h-5 w-5 text-amber-600" />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{student.fees.emiPlan.totalEmis} months plan</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-gray-800">Payment Progress</h5>
                            <span className="text-sm font-medium">
                              {student.fees.emiPlan.paidEmis} of {student.fees.emiPlan.totalEmis} EMIs
                            </span>
                          </div>
                          <Progress 
                            value={calculateProgressPercentage(student.fees.paid, student.fees.totalAmount)} 
                            className="h-2 mb-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>₹{student.fees.paid.toLocaleString('en-IN')} paid</span>
                            <span>₹{(student.fees.totalAmount - student.fees.paid).toLocaleString('en-IN')} remaining</span>
                          </div>
                          
                          {student.fees.emiPlan.paidEmis < student.fees.emiPlan.totalEmis && (
                            <Button 
                              onClick={() => handleEmiPayment(student.email)}
                              className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                              Record EMI Payment
                            </Button>
                          )}
                        </div>
                        
                        {student.fees.payments && student.fees.payments.length > 0 && (
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
                                    {student.fees.payments.map((payment, index) => (
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
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
