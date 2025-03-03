
export const calculateGST = (amount: number) => {
  return amount * 0.18; // 18% GST
};

export const calculateEmiAmount = (totalAmount: number, numberOfEmis: number) => {
  return Math.ceil(totalAmount / numberOfEmis);
};

export const calculateProgressPercentage = (paid: number, total: number) => {
  return (paid / total) * 100;
};

export const getStatusColor = (paid: number, total: number) => {
  const percentage = (paid / total) * 100;
  if (percentage >= 100) return "text-green-600";
  if (percentage >= 50) return "text-amber-500";
  return "text-red-500";
};

export const getStatusIcon = (paid: number, total: number) => {
  const percentage = (paid / total) * 100;
  if (percentage >= 100) return "check-circle";
  if (percentage >= 50) return "clock";
  return "alert-circle";
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric'
  });
};
