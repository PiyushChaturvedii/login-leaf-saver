
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserData {
  email: string;
  name: string;
  fees?: {
    amount: number;
    paid: number;
    lastPaid?: string;
  };
}

export const AdminFees = () => {
  const [feesAmount, setFeesAmount] = useState<number>(0);

  const handleFeesUpdate = (studentEmail: string, amount: number) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: UserData) =>
      user.email === studentEmail
        ? {
            ...user,
            fees: {
              amount: user.fees?.amount || 0,
              paid: (user.fees?.paid || 0) + amount,
              lastPaid: new Date().toISOString(),
            },
          }
        : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('Fees updated successfully!');
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Fees Management</h3>
      <div className="space-y-4">
        {JSON.parse(localStorage.getItem('users') || '[]')
          .filter((user: UserData) => user.role === 'student')
          .map((student: UserData) => (
            <div key={student.email} className="border p-4 rounded-lg">
              <h4 className="font-medium">{student.name}</h4>
              <p className="text-sm text-gray-600">{student.email}</p>
              <div className="mt-2">
                <p>Total Fees: ₹{student.fees?.amount || 0}</p>
                <p>Paid: ₹{student.fees?.paid || 0}</p>
                <p>Balance: ₹{(student.fees?.amount || 0) - (student.fees?.paid || 0)}</p>
                {student.fees?.lastPaid && (
                  <p className="text-sm text-gray-600">
                    Last Paid: {new Date(student.fees.lastPaid).toLocaleDateString()}
                  </p>
                )}
                <div className="mt-2 flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    onChange={(e) => setFeesAmount(Number(e.target.value))}
                  />
                  <Button onClick={() => handleFeesUpdate(student.email, feesAmount)}>
                    Add Payment
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
};
