
import React from 'react';
import { Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { FormFieldWithIcon } from '../form-fields/FormFieldWithIcon';

interface DateOfBirthSectionProps {
  dateOfBirth: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  language: 'en' | 'hi';
}

export const DateOfBirthSection = ({
  dateOfBirth,
  error,
  onChange,
  language
}: DateOfBirthSectionProps) => {
  const dobLabel = language === 'hi' ? "जन्म तिथि" : "Date of Birth";

  return (
    <FormFieldWithIcon 
      icon={<Calendar size={24} />}
      label={dobLabel}
      error={error}
    >
      <Input 
        id="dateOfBirth"
        name="dateOfBirth" 
        type="date"
        value={dateOfBirth} 
        onChange={onChange}
        className={error ? "border-red-300" : ""}
      />
    </FormFieldWithIcon>
  );
};
