
import React from 'react';
import { Users } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { FormFieldWithIcon } from '../form-fields/FormFieldWithIcon';

interface GuardianSectionProps {
  guardianInfo: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  language: 'en' | 'hi';
}

export const GuardianSection = ({
  guardianInfo,
  error,
  onChange,
  language
}: GuardianSectionProps) => {
  const guardianLabel = language === 'hi' ? "अभिभावक जानकारी" : "Guardian Information";
  const guardianPlaceholder = language === 'hi' ? "नाम, संबंध, संपर्क नंबर, पता" : "Name, Relationship, Contact Number, Address";

  return (
    <FormFieldWithIcon 
      icon={<Users size={24} />}
      label={guardianLabel}
      error={error}
    >
      <Textarea 
        id="guardianInfo"
        name="guardianInfo" 
        value={guardianInfo} 
        onChange={onChange}
        className={error ? "border-red-300" : ""}
        placeholder={guardianPlaceholder}
        rows={3}
      />
    </FormFieldWithIcon>
  );
};
