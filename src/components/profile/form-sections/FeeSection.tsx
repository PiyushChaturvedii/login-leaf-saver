
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldWithIcon } from '../form-fields/FormFieldWithIcon';

interface FeeSectionProps {
  feePlan: string;
  error?: string;
  onValueChange: (value: string) => void;
  language: 'en' | 'hi';
}

export const FeeSection = ({
  feePlan,
  error,
  onValueChange,
  language
}: FeeSectionProps) => {
  const feePlanOptions = [
    language === 'hi' ? "एकल भुगतान (10% छूट)" : "One-time Payment (10% discount)",
    language === 'hi' ? "दो किस्त (5% छूट)" : "Two Installments (5% discount)",
    language === 'hi' ? "तिमाही किस्त" : "Quarterly Installments",
    language === 'hi' ? "मासिक EMI" : "Monthly EMI"
  ];

  const feeLabel = language === 'hi' ? "शुल्क योजना" : "Fee Plan";
  const feeSelectPlaceholder = language === 'hi' ? "शुल्क योजना चुनें" : "Select Fee Plan";
  const paymentOptions = language === 'hi' ? "भुगतान विकल्प" : "Payment Options";

  return (
    <FormFieldWithIcon 
      icon={<CreditCard size={24} />}
      label={feeLabel}
      error={error}
    >
      <Select 
        value={feePlan} 
        onValueChange={onValueChange}
      >
        <SelectTrigger className={error ? "border-red-300" : ""}>
          <SelectValue placeholder={feeSelectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{paymentOptions}</SelectLabel>
            {feePlanOptions.map((plan) => (
              <SelectItem key={plan} value={plan}>
                {plan}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormFieldWithIcon>
  );
};
