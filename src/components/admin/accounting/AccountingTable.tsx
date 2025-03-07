
import React from 'react';
import { format } from 'date-fns';
import { UserData } from '../../fees/FeesTypes';

interface AccountingTableProps {
  students: UserData[];
}

export const AccountingTable = ({ students }: AccountingTableProps) => {
  return (
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
  );
};
