
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { UserData } from './FeesTypes';

interface PaymentEmiEditorProps {
  fees: NonNullable<UserData['fees']>;
  isEditingEmi: boolean;
  setIsEditingEmi: (value: boolean) => void;
  newEmiAmount: number;
  setNewEmiAmount: (value: number) => void;
  handleUpdateEmiAmount: () => void;
}

export const PaymentEmiEditor = ({
  fees,
  isEditingEmi,
  setIsEditingEmi,
  newEmiAmount,
  setNewEmiAmount,
  handleUpdateEmiAmount
}: PaymentEmiEditorProps) => {
  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">EMI Amount:</span>
        {isEditingEmi ? (
          <div className="flex space-x-2">
            <Input 
              type="number" 
              value={newEmiAmount} 
              onChange={(e) => setNewEmiAmount(Number(e.target.value))}
              className="w-24 h-8 py-1 text-sm"
            />
            <Button 
              size="sm" 
              onClick={handleUpdateEmiAmount}
              className="h-8 px-2 py-1 bg-green-600 hover:bg-green-700"
            >
              Save
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setIsEditingEmi(false);
                setNewEmiAmount(fees.emiPlan.emiAmount);
              }}
              className="h-8 px-2 py-1"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm">₹{fees.emiPlan.emiAmount.toLocaleString('en-IN')}</span>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsEditingEmi(true)}
              className="h-6 w-6"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
