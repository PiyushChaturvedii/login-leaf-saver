
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldWithIcon } from '../form-fields/FormFieldWithIcon';
import { StudentFormData } from '@/hooks/useStudentForm';

interface CourseSectionProps {
  courseEnrollment: string;
  error?: string;
  onValueChange: (value: string) => void;
  language: 'en' | 'hi';
}

export const CourseSection = ({
  courseEnrollment,
  error,
  onValueChange,
  language
}: CourseSectionProps) => {
  const courseOptions = [
    "Full Stack Web Development",
    "AI & Machine Learning",
    "Digital Marketing",
    "Mobile App Development",
    "Data Science & Analytics",
    "Cyber Security"
  ];

  const courseLabel = language === 'hi' ? "कोर्स चयन" : "Course Selection";
  const courseSelectPlaceholder = language === 'hi' ? "कोर्स चुनें" : "Select Course";
  const availableCourses = language === 'hi' ? "उपलब्ध कोर्स" : "Available Courses";

  return (
    <FormFieldWithIcon 
      icon={<BookOpen size={24} />}
      label={courseLabel}
      error={error}
    >
      <Select 
        value={courseEnrollment} 
        onValueChange={onValueChange}
      >
        <SelectTrigger className={error ? "border-red-300" : ""}>
          <SelectValue placeholder={courseSelectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{availableCourses}</SelectLabel>
            {courseOptions.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormFieldWithIcon>
  );
};
