
import React from 'react';
import { Label } from "@/components/ui/label";

interface FormFieldWithIconProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  error?: string;
}

export const FormFieldWithIcon = ({ 
  icon, 
  label, 
  children, 
  error 
}: FormFieldWithIconProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="p-2 rounded-full bg-purple-100 text-purple-600">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <Label htmlFor={label}>{label}</Label>
        {children}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};
