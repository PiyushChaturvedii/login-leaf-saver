
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet, Download } from "lucide-react";
import { UserData } from '../fees/FeesTypes';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { format } from 'date-fns';

export const AccountingRole = () => {
  const [students, setStudents] = useState<UserData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [receiptNumber, setReceiptNumber] = useState<string>('');

  useEffect(() => {
    // Load users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredStudents = users.filter((u: UserData) => u.role === 'student' && u.fees?.amount);
    setStudents(filteredStudents);
  }, []);

  const handleAddPayment = () => {
    if (!selectedStudent || amount <= 0 || !receiptNumber) {
      toast.error("Please fill all fields correctly!");
      return;
    }

    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: UserData) => u.email === selectedStudent);

      if (userIndex === -1) {
        toast.error("Student not found!");
        return;
      }

      const user = users[userIndex];
      
      if (!user.fees) {
        toast.error("Student has no fee record!");
        return;
      }

      // Create payment record
      const payment = {
        amount,
        date: new Date().toISOString(),
        receipt: receiptNumber
      };

      // Update user's payment records
      const payments = user.fees.payments || [];
      const newPaid = (user.fees.paid || 0) + amount;
      const newPaidEmis = Math.floor(newPaid / user.fees.emiPlan.emiAmount);

      users[userIndex] = {
        ...user,
        fees: {
          ...user.fees,
          paid: newPaid,
          lastPaid: new Date().toISOString(),
          payments: [...payments, payment],
          emiPlan: {
            ...user.fees.emiPlan,
            paidEmis: Math.min(newPaidEmis, user.fees.emiPlan.totalEmis)
          }
        }
      };

      // Save updated users to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update state
      setStudents(users.filter((u: UserData) => u.role === 'student' && u.fees?.amount));
      
      // Reset form
      setShowAddForm(false);
      setSelectedStudent('');
      setAmount(0);
      setReceiptNumber('');
      
      toast.success("Payment recorded successfully!");
    } catch (error) {
      console.error("Payment recording error:", error);
      toast.error("Failed to record payment!");
    }
  };

  const exportToCSV = () => {
    // Prepare CSV data
    let csvContent = "Student Email,Name,Total Fees,Paid Amount,Remaining,Last Payment Date,Receipt Numbers\n";
    
    students.forEach(student => {
      if (student.fees) {
        const receipts = student.fees.payments?.map(p => p.receipt).join("; ") || "";
        const lastPaid = student.fees.lastPaid ? format(new Date(student.fees.lastPaid), 'yyyy-MM-dd') : "N/A";
        
        csvContent += `${student.email},${student.name},${student.fees.totalAmount},${student.fees.paid},${student.fees.totalAmount - student.fees.paid},${lastPaid},"${receipts}"\n`;
      }
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fees_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Report downloaded successfully!");
  };

  return (
    <Card className="shadow-md mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            <span>Accounts Management</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={exportToCSV}
              disabled={students.length === 0}
            >
              <Download className="w-4 h-4 mr-1" />
              Export Report
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="w-4 h-4 mr-1" />
              {showAddForm ? "Cancel" : "Record Payment"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-medium mb-3">Record New Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs mb-1 block">Student</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.email} value={student.email}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs mb-1 block">Amount (₹)</label>
                <Input
                  type="number"
                  value={amount || ''}
                  onChange={e => setAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block">Receipt Number</label>
                <Input
                  value={receiptNumber}
                  onChange={e => setReceiptNumber(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  className="w-full"
                  onClick={handleAddPayment}
                  disabled={!selectedStudent || amount <= 0 || !receiptNumber}
                >
                  Record Payment
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto mt-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left text-xs font-medium text-gray-600">Student</th>
                <th className="p-2 text-left text-xs font-medium text-gray-600">Email</th>
                <th className="p-2 text-right text-xs font-medium text-gray-600">Total Fees</th>
                <th className="p-2 text-right text-xs font-medium text-gray-600">Paid</th>
                <th className="p-2 text-right text-xs font-medium text-gray-600">Remaining</th>
                <th className="p-2 text-center text-xs font-medium text-gray-600">Last Payment</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-sm text-gray-500">
                    No fee records found
                  </td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student.email} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-sm">{student.name}</td>
                    <td className="p-2 text-sm">{student.email}</td>
                    <td className="p-2 text-sm text-right">₹{student.fees?.totalAmount.toLocaleString()}</td>
                    <td className="p-2 text-sm text-right">₹{student.fees?.paid.toLocaleString()}</td>
                    <td className="p-2 text-sm text-right">
                      ₹{(student.fees?.totalAmount - student.fees?.paid).toLocaleString()}
                    </td>
                    <td className="p-2 text-sm text-center">
                      {student.fees?.lastPaid 
                        ? format(new Date(student.fees.lastPaid), 'dd/MM/yyyy')
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
