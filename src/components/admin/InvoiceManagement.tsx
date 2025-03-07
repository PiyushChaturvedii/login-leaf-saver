
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileText, Plus, Trash, Link as LinkIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserData } from '../fees/FeesTypes';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  studentEmail: string;
  month: string;
  year: string;
  driveLink: string;
  fileName: string;
  uploadDate: string;
}

export const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [students, setStudents] = useState<UserData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [driveLink, setDriveLink] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    // Load users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const studentUsers = users.filter((u: UserData) => u.role === 'student');
    setStudents(studentUsers);
    
    // Load invoices from localStorage
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(storedInvoices);
  }, []);

  const handleAddInvoice = () => {
    if (!selectedStudent || !month || !year || !driveLink) {
      toast.error("Please fill all required fields");
      return;
    }

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      studentEmail: selectedStudent,
      month,
      year,
      driveLink,
      fileName: fileName || `Invoice-${month}-${year}.pdf`,
      uploadDate: new Date().toISOString()
    };

    const updatedInvoices = [...invoices, newInvoice];
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);

    // Reset form
    setSelectedStudent("");
    setMonth("");
    setYear(new Date().getFullYear().toString());
    setDriveLink("");
    setFileName("");
    setShowAddForm(false);

    toast.success("Invoice added successfully!");
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
    toast.success("Invoice deleted successfully!");
  };

  const getStudentName = (email: string) => {
    const student = students.find(s => s.email === email);
    return student ? student.name : email;
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => 
    (new Date().getFullYear() - 2 + i).toString()
  );

  return (
    <Card className="shadow-md mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            <span>Invoice Management</span>
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="w-4 h-4 mr-1" />
            {showAddForm ? "Cancel" : "Add Invoice"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-medium mb-3">Add New Invoice</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <Label htmlFor="student-select">Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student-select">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.email} value={student.email}>
                        {student.name} ({student.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="month-select">Month</Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger id="month-select">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(m => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year-select">Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger id="year-select">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(y => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="drive-link">Google Drive Link</Label>
                <Input
                  id="drive-link"
                  placeholder="https://drive.google.com/file/d/..."
                  value={driveLink}
                  onChange={e => setDriveLink(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="file-name">File Name (Optional)</Label>
                <Input
                  id="file-name"
                  placeholder="e.g. Invoice-Jan-2023.pdf"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                />
              </div>
              <Button 
                className="w-full"
                onClick={handleAddInvoice}
                disabled={!selectedStudent || !month || !year || !driveLink}
              >
                Add Invoice
              </Button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left text-xs font-medium text-gray-600">Student</th>
                <th className="p-2 text-left text-xs font-medium text-gray-600">Month/Year</th>
                <th className="p-2 text-left text-xs font-medium text-gray-600">File Name</th>
                <th className="p-2 text-left text-xs font-medium text-gray-600">Uploaded</th>
                <th className="p-2 text-right text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-sm text-gray-500">
                    No invoices uploaded yet
                  </td>
                </tr>
              ) : (
                invoices.map(invoice => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-sm">{getStudentName(invoice.studentEmail)}</td>
                    <td className="p-2 text-sm">{invoice.month} {invoice.year}</td>
                    <td className="p-2 text-sm">{invoice.fileName}</td>
                    <td className="p-2 text-sm">
                      {format(new Date(invoice.uploadDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="p-2 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={invoice.driveLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
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
