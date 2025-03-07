
import React, { useState, useEffect } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  studentEmail: string;
  month: string;
  year: string;
  driveLink: string;
  fileName: string;
  uploadDate: string;
}

interface StudentInvoicesProps {
  studentEmail: string;
}

export const StudentInvoices = ({ studentEmail }: StudentInvoicesProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Load invoices from localStorage
    const allInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    // Filter invoices for this student
    const studentInvoices = allInvoices.filter(
      (invoice: Invoice) => invoice.studentEmail === studentEmail
    );
    setInvoices(studentInvoices);
  }, [studentEmail]);

  if (invoices.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
        No invoices available
      </div>
    );
  }

  return (
    <div>
      <h5 className="font-medium text-gray-800 mb-3">Your Invoices</h5>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice, index) => (
                <tr key={invoice.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {invoice.month} {invoice.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      {invoice.fileName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {format(new Date(invoice.uploadDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      <a 
                        href={invoice.driveLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
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
