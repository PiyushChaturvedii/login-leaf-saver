
/**
 * PaymentActionButton component
 * Button to record EMI payments
 */

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PaymentActionButtonProps {
  onClick: () => void;
}

export const PaymentActionButton = ({ onClick }: PaymentActionButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-200 shadow hover:shadow-md"
    >
      <PlusCircle className="w-4 h-4 mr-2" />
      Record EMI Payment
    </Button>
  );
};
