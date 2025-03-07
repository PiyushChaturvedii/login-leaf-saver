
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
      className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
    >
      <PlusCircle className="w-4 h-4 mr-2" />
      Record EMI Payment
    </Button>
  );
};
