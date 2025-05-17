
import React from 'react';
import { IdCard } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { FormFieldWithIcon } from '../form-fields/FormFieldWithIcon';

interface StudentIdSectionProps {
  studentId: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  language: 'en' | 'hi';
}

export const StudentIdSection = ({
  studentId,
  error,
  onChange,
  language
}: StudentIdSectionProps) => {
  const idLabel = language === 'hi' ? "छात्र आईडी" : "Student ID";
  const idPlaceholder = language === 'hi' ? "छात्र पंजीकरण संख्या" : "Student registration number";

  return (
    <FormFieldWithIcon 
      icon={<IdCard size={24} />}
      label={idLabel}
      error={error}
    >
      <Input 
        id="studentId"
        name="studentId" 
        value={studentId} 
        onChange={onChange}
        className={error ? "border-red-300" : ""}
        placeholder={idPlaceholder}
      />
    </FormFieldWithIcon>
  );
};
