
import { UserData } from '../../fees/FeesTypes';
import { format } from 'date-fns';
import { toast } from "sonner";

/**
 * Record a new payment for a student
 */
export const recordPayment = (
  selectedStudent: string,
  amount: number,
  receiptNumber: string
): UserData[] | null => {
  if (!selectedStudent || amount <= 0 || !receiptNumber) {
    toast.error("Please fill all fields correctly!");
    return null;
  }

  try {
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: UserData) => u.email === selectedStudent);

    if (userIndex === -1) {
      toast.error("Student not found!");
      return null;
    }

    const user = users[userIndex];
    
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
    
    toast.success("Payment recorded successfully!");
    return users;
  } catch (error) {
    console.error("Payment recording error:", error);
    toast.error("Failed to record payment!");
    return null;
  }
};

/**
 * Generate CSV data for exporting
 */
export const generateCSVExport = (students: UserData[]) => {
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

/**
 * Load student data with fees from localStorage
 */
export const loadStudentsWithFees = (): UserData[] => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.filter((u: UserData) => u.role === 'student' && u.fees?.amount);
};
