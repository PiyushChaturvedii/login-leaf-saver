
import React from 'react';
import { UserRound } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormFieldWithIcon } from '../form-fields/FormFieldWithIcon';
import { Label } from '@/components/ui/label';

interface GenderSectionProps {
  gender: string;
  error?: string;
  onValueChange: (value: string) => void;
  language: 'en' | 'hi';
}

export const GenderSection = ({
  gender,
  error,
  onValueChange,
  language
}: GenderSectionProps) => {
  const genderLabel = language === 'hi' ? "लिंग" : "Gender";
  const maleLabel = language === 'hi' ? "पुरुष" : "Male";
  const femaleLabel = language === 'hi' ? "महिला" : "Female";
  const otherLabel = language === 'hi' ? "अन्य" : "Other";

  return (
    <FormFieldWithIcon 
      icon={<UserRound size={24} />}
      label={genderLabel}
      error={error}
    >
      <RadioGroup 
        value={gender} 
        onValueChange={onValueChange}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="male" id="male" />
          <Label htmlFor="male">{maleLabel}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="female" id="female" />
          <Label htmlFor="female">{femaleLabel}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="other" id="other" />
          <Label htmlFor="other">{otherLabel}</Label>
        </div>
      </RadioGroup>
    </FormFieldWithIcon>
  );
};
