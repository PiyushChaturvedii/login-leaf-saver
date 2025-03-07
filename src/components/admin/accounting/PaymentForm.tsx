
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserData } from '../../fees/FeesTypes';
import { recordPayment } from './AccountingUtils';

interface PaymentFormProps {
  students: UserData[];
  onPaymentRecorded: (updatedStudents: UserData[]) => void;
  onCancel: () => void;
}

export const PaymentForm = ({ students, onPaymentRecorded, onCancel }: PaymentFormProps) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [receiptNumber, setReceiptNumber] = useState<string>('');

  const handleAddPayment = () => {
    const updatedUsers = recordPayment(selectedStudent, amount, receiptNumber);
    if (updatedUsers) {
      const filteredStudents = updatedUsers.filter(
        (u: UserData) => u.role === 'student' && u.fees?.amount
      );
      onPaymentRecorded(filteredStudents);
      
      // Reset form
      setSelectedStudent('');
      setAmount(0);
      setReceiptNumber('');
    }
  };

  return (
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
  );
};
