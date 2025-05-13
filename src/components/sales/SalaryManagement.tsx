
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/utils/dateUtils';

export const SalaryManagement: React.FC = () => {
  // In a real app, this would come from an API
  const salaryData = {
    baseSalary: 25000,
    incentivePerConversion: 500,
    targetConversions: 20,
    currentConversions: 12
  };
  
  const [incentiveAmount, setIncentiveAmount] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  
  const recentConversions = [
    { 
      id: 1, 
      studentName: 'Neha Gupta', 
      course: 'Digital Marketing', 
      date: new Date(2023, 4, 10) 
    },
    { 
      id: 2, 
      studentName: 'Rahul Verma', 
      course: 'Web Development', 
      date: new Date(2023, 4, 8) 
    },
    { 
      id: 3, 
      studentName: 'Priya Shah', 
      course: 'UI/UX Design', 
      date: new Date(2023, 4, 5) 
    },
    { 
      id: 4, 
      studentName: 'Amit Sharma', 
      course: 'Python Programming', 
      date: new Date(2023, 4, 2) 
    }
  ];
  
  useEffect(() => {
    // Calculate incentive amount based on conversions
    const calculatedIncentive = salaryData.currentConversions * salaryData.incentivePerConversion;
    setIncentiveAmount(calculatedIncentive);
    
    // Calculate total salary
    setTotalSalary(salaryData.baseSalary + calculatedIncentive);
  }, [salaryData.currentConversions, salaryData.incentivePerConversion, salaryData.baseSalary]);
  
  const progressPercentage = (salaryData.currentConversions / salaryData.targetConversions) * 100;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-800">Salary & Incentives</h1>
          <p className="text-gray-600">Track your earnings and performance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Fixed Salary</CardTitle>
              <CardDescription>Your monthly base pay</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-4xl font-bold text-green-700">₹{salaryData.baseSalary.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Incentives</CardTitle>
              <CardDescription>₹{salaryData.incentivePerConversion.toLocaleString()} per student converted</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-4xl font-bold text-purple-600">₹{incentiveAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Performance Target</CardTitle>
            <CardDescription>Current month conversion progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Conversions</span>
                <span className="text-sm font-medium">{salaryData.currentConversions} of {salaryData.targetConversions}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-sm text-gray-500">
                {progressPercentage >= 100 ? "Target achieved! Well done!" : `${Math.round(progressPercentage)}% of monthly target completed`}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t p-4 text-sm text-center italic text-gray-600">
            "We believe in rewarding contribution, not just holidays."
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
            <CardDescription>Students converted this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Incentive</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentConversions.map((conversion) => (
                  <TableRow key={conversion.id}>
                    <TableCell className="font-medium">{conversion.studentName}</TableCell>
                    <TableCell>{conversion.course}</TableCell>
                    <TableCell>{formatDate(conversion.date)}</TableCell>
                    <TableCell className="text-right">₹{salaryData.incentivePerConversion.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="text-gray-600">Total Conversions: {salaryData.currentConversions}</div>
            <div className="font-bold text-green-700">Projected Total Salary: ₹{totalSalary.toLocaleString()}</div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};
