
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export interface StudentFormData {
  name: string;
  guardianInfo: string;
  courseEnrollment: string;
  feePlan: string;
}

export const useStudentForm = (initialData: Partial<StudentFormData> = {}) => {
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState<StudentFormData>({
    name: initialData.name || '',
    guardianInfo: initialData.guardianInfo || '',
    courseEnrollment: initialData.courseEnrollment || '',
    feePlan: initialData.feePlan || '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof StudentFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSelectChange = (name: keyof StudentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = language === 'hi' ? "नाम आवश्यक है" : "Name is required";
    if (!formData.guardianInfo.trim()) newErrors.guardianInfo = language === 'hi' ? "अभिभावक जानकारी आवश्यक है" : "Guardian information is required";
    if (!formData.courseEnrollment.trim()) newErrors.courseEnrollment = language === 'hi' ? "कोर्स चयन आवश्यक है" : "Course selection is required";
    if (!formData.feePlan.trim()) newErrors.feePlan = language === 'hi' ? "शुल्क योजना आवश्यक है" : "Fee plan is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return {
    formData,
    errors,
    handleChange,
    handleSelectChange,
    validateForm
  };
};
