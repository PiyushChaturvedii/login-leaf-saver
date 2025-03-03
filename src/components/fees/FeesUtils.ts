
/**
 * Utility functions for the fees management system
 */

/**
 * Calculates GST amount based on the given base amount
 * @param amount - Base amount without GST
 * @returns The calculated GST amount (18% of base amount)
 */
export const calculateGST = (amount: number) => {
  return amount * 0.18; // 18% GST
};

/**
 * Calculates EMI amount based on total amount and number of EMIs
 * @param totalAmount - Total amount including GST
 * @param numberOfEmis - Number of EMIs to divide the amount into
 * @returns The calculated amount per EMI (rounded up to nearest integer)
 */
export const calculateEmiAmount = (totalAmount: number, numberOfEmis: number) => {
  return Math.ceil(totalAmount / numberOfEmis);
};

/**
 * Calculates progress percentage of paid amount against total amount
 * @param paid - Amount paid so far
 * @param total - Total amount to be paid
 * @returns The percentage of total amount that has been paid
 */
export const calculateProgressPercentage = (paid: number, total: number) => {
  return (paid / total) * 100;
};

/**
 * Determines text color class based on payment progress
 * @param paid - Amount paid so far
 * @param total - Total amount to be paid
 * @returns Tailwind CSS class for text color based on payment status
 */
export const getStatusColor = (paid: number, total: number) => {
  const percentage = (paid / total) * 100;
  if (percentage >= 100) return "text-green-600";
  if (percentage >= 50) return "text-amber-500";
  return "text-red-500";
};

/**
 * Determines icon type based on payment progress
 * @param paid - Amount paid so far
 * @param total - Total amount to be paid
 * @returns Icon identifier based on payment status
 */
export const getStatusIcon = (paid: number, total: number) => {
  const percentage = (paid / total) * 100;
  if (percentage >= 100) return "check-circle";
  if (percentage >= 50) return "clock";
  return "alert-circle";
};

/**
 * Formats a date string to a localized format
 * @param dateString - ISO date string to format
 * @returns Formatted date string in Indian locale (DD MMM YYYY)
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric'
  });
};
