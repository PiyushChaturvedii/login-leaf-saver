
import { UserData } from '../../fees/FeesTypes';
import { format } from 'date-fns';
import { toast } from "sonner";
import { DbService } from '@/services/DatabaseService';

/**
 * Record a new payment for a student
 */
export const recordPayment = async (
  selectedStudent: string,
  amount: number,
  receiptNumber: string
): Promise<UserData[] | null> => {
  if (!selectedStudent || amount <= 0 || !receiptNumber) {
    toast.error("Please fill all fields correctly!");
    return null;
  }

  try {
    // Get the student from MongoDB
    const users = await DbService.find('users', { email: selectedStudent });
    
    if (users.length === 0) {
      toast.error("Student not found!");
      return null;
    }

    const user = users[0];
    
    if (!user.fees) {
      toast.error("Student has no fee record!");
      return null;
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

    const updatedUser = {
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

    // Save updated user to MongoDB
    await DbService.update('users', user._id, updatedUser);
    
    toast.success("Payment recorded successfully!");
    return await DbService.find('users');
  } catch (error) {
    console.error("Payment recording error:", error);
    toast.error("Failed to record payment!");
    return null;
  }
};

/**
 * Generate CSV data for exporting
 */
export const generateCSVExport = async (students: UserData[]) => {
  // Get all students with fees from MongoDB
  const users = await DbService.find('users', { role: 'student' });
  const studentsWithFees = users.filter((s: UserData) => s.fees?.amount);
  
  // Prepare CSV data
  let csvContent = "Student Email,Name,Total Fees,Paid Amount,Remaining,Last Payment Date,Receipt Numbers\n";
  
  studentsWithFees.forEach(student => {
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

/**
 * Load student data with fees from MongoDB
 */
export const loadStudentsWithFees = async (): Promise<UserData[]> => {
  const users = await DbService.find('users', { role: 'student' });
  return users.filter((u: UserData) => u.fees?.amount);
};
