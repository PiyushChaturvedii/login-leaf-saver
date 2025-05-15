
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet, Download } from "lucide-react";
import { UserData } from '../fees/FeesTypes';
import { PaymentForm } from './accounting/PaymentForm';
import { AccountingTable } from './accounting/AccountingTable';
import { loadStudentsWithFees, generateCSVExport } from './accounting/AccountingUtils';

export const AccountingRole = () => {
  const [students, setStudents] = useState<UserData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load users from localStorage
    const loadStudents = async () => {
      try {
        setIsLoading(true);
        const loadedStudents = await loadStudentsWithFees();
        setStudents(loadedStudents);
      } catch (error) {
        console.error("Error loading students with fees:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStudents();
  }, []);

  const handlePaymentRecorded = (updatedStudents: UserData[]) => {
    setStudents(updatedStudents);
    setShowAddForm(false);
  };

  const exportToCSV = () => {
    generateCSVExport(students);
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
          <PaymentForm 
            students={students}
            onPaymentRecorded={handlePaymentRecorded}
            onCancel={() => setShowAddForm(false)}
          />
        )}
        
        <AccountingTable students={students} />
      </CardContent>
    </Card>
  );
};
