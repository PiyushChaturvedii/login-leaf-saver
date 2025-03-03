
export interface UserData {
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  fees?: {
    amount: number;
    gstAmount: number;
    totalAmount: number;
    paid: number;
    lastPaid?: string;
    payments?: {
      amount: number;
      date: string;
      receipt: string;
    }[];
    emiPlan?: {
      totalEmis: number;
      paidEmis: number;
      emiAmount: number;
    };
  };
}
