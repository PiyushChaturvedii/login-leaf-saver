
/**
 * Types for the fees management system
 */

export interface UserData {
  /** User's email address (unique identifier) */
  email: string;
  /** User's full name */
  name: string;
  /** User's role in the system */
  role: 'admin' | 'instructor' | 'student' | 'accounting';
  /** User's fees information (optional) */
  fees?: {
    /** Base fee amount without GST */
    amount: number;
    /** GST amount calculated on the base fee */
    gstAmount: number;
    /** Total amount including GST */
    totalAmount: number;
    /** Amount paid so far */
    paid: number;
    /** Date of last payment (optional) */
    lastPaid?: string;
    /** List of payment records (optional) */
    payments?: {
      /** Payment amount */
      amount: number;
      /** Payment date */
      date: string;
      /** Receipt number/ID */
      receipt: string;
    }[];
    /** EMI plan details (optional) */
    emiPlan?: {
      /** Total number of EMIs in the plan */
      totalEmis: number;
      /** Number of EMIs already paid */
      paidEmis: number;
      /** Amount per EMI */
      emiAmount: number;
    };
  };
}
