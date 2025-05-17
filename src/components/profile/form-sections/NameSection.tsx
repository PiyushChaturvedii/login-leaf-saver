
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { FormFieldWithIcon } from '../form-fields/FormFieldWithIcon';

interface NameSectionProps {
  name: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  language: 'en' | 'hi';
}

export const NameSection = ({
  name,
  error,
  onChange,
  language
}: NameSectionProps) => {
  const nameLabel = language === 'hi' ? "पूरा नाम" : "Full Name";

  return (
    <FormFieldWithIcon 
      icon={<GraduationCap size={24} />}
      label={nameLabel}
      error={error}
    >
      <Input 
        id="name"
        name="name" 
        value={name} 
        onChange={onChange}
        className={error ? "border-red-300" : ""}
      />
    </FormFieldWithIcon>
  );
};
