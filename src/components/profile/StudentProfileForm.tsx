
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { useStudentForm, StudentFormData } from '@/hooks/useStudentForm';
import { NameSection } from './form-sections/NameSection';
import { GuardianSection } from './form-sections/GuardianSection';
import { CourseSection } from './form-sections/CourseSection';
import { FeeSection } from './form-sections/FeeSection';
import { StudentIdSection } from './form-sections/StudentIdSection';
import { DateOfBirthSection } from './form-sections/DateOfBirthSection';
import { GenderSection } from './form-sections/GenderSection';

interface StudentProfileFormProps {
  initialData?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => void;
}

export const StudentProfileForm = ({ initialData = {}, onSubmit }: StudentProfileFormProps) => {
  const { language } = useLanguage();
  const { formData, errors, handleChange, handleSelectChange, validateForm } = useStudentForm(initialData);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast.error(language === 'hi' ? "कृपया सभी आवश्यक फ़ील्ड भरें" : "Please fill in all required fields");
    }
  };
  
  const headerTitle = language === 'hi' ? "छात्र प्रोफाइल सेटअप" : "Student Profile Setup";
  const headerDescription = language === 'hi' ? "आपकी प्रोफ़ाइल जानकारी पूरी करें" : "Complete your profile information";
  const submitButtonText = language === 'hi' ? "प्रोफ़ाइल पूरा करें" : "Complete Profile";

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">{headerTitle}</CardTitle>
        <CardDescription className="text-center">{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <StudentIdSection 
              studentId={formData.studentId}
              error={errors.studentId}
              onChange={handleChange}
              language={language}
            />
            
            <NameSection 
              name={formData.name}
              error={errors.name}
              onChange={handleChange}
              language={language}
            />
            
            <DateOfBirthSection 
              dateOfBirth={formData.dateOfBirth}
              error={errors.dateOfBirth}
              onChange={handleChange}
              language={language}
            />
            
            <GenderSection 
              gender={formData.gender}
              error={errors.gender}
              onValueChange={(value) => handleSelectChange('gender', value)}
              language={language}
            />
            
            <GuardianSection 
              guardianInfo={formData.guardianInfo}
              error={errors.guardianInfo}
              onChange={handleChange}
              language={language}
            />
            
            <CourseSection 
              courseEnrollment={formData.courseEnrollment}
              error={errors.courseEnrollment}
              onValueChange={(value) => handleSelectChange('courseEnrollment', value)}
              language={language}
            />
            
            <FeeSection 
              feePlan={formData.feePlan}
              error={errors.feePlan}
              onValueChange={(value) => handleSelectChange('feePlan', value)}
              language={language}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg flex justify-end">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {submitButtonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
