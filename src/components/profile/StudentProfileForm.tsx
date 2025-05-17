
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Users, BookOpen, CreditCard } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

interface StudentFormData {
  name: string;
  guardianInfo: string;
  courseEnrollment: string;
  feePlan: string;
}

interface StudentProfileFormProps {
  initialData?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => void;
}

export const StudentProfileForm = ({ initialData = {}, onSubmit }: StudentProfileFormProps) => {
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast.error(language === 'hi' ? "कृपया सभी आवश्यक फ़ील्ड भरें" : "Please fill in all required fields");
    }
  };
  
  const courseOptions = [
    "Full Stack Web Development",
    "AI & Machine Learning",
    "Digital Marketing",
    "Mobile App Development",
    "Data Science & Analytics",
    "Cyber Security"
  ];
  
  const feePlanOptions = [
    language === 'hi' ? "एकल भुगतान (10% छूट)" : "One-time Payment (10% discount)",
    language === 'hi' ? "दो किस्त (5% छूट)" : "Two Installments (5% discount)",
    language === 'hi' ? "तिमाही किस्त" : "Quarterly Installments",
    language === 'hi' ? "मासिक EMI" : "Monthly EMI"
  ];
  
  const headerTitle = language === 'hi' ? "छात्र प्रोफाइल सेटअप" : "Student Profile Setup";
  const headerDescription = language === 'hi' ? "आपकी प्रोफ़ाइल जानकारी पूरी करें" : "Complete your profile information";
  const nameLabel = language === 'hi' ? "पूरा नाम" : "Full Name";
  const guardianLabel = language === 'hi' ? "अभिभावक जानकारी" : "Guardian Information";
  const guardianPlaceholder = language === 'hi' ? "नाम, संबंध, संपर्क नंबर, पता" : "Name, Relationship, Contact Number, Address";
  const courseLabel = language === 'hi' ? "कोर्स चयन" : "Course Selection";
  const courseSelectPlaceholder = language === 'hi' ? "कोर्स चुनें" : "Select Course";
  const availableCourses = language === 'hi' ? "उपलब्ध कोर्स" : "Available Courses";
  const feeLabel = language === 'hi' ? "शुल्क योजना" : "Fee Plan";
  const feeSelectPlaceholder = language === 'hi' ? "शुल्क योजना चुनें" : "Select Fee Plan";
  const paymentOptions = language === 'hi' ? "भुगतान विकल्प" : "Payment Options";
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
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <GraduationCap size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="name">{nameLabel}</Label>
                <Input 
                  id="name"
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className={errors.name ? "border-red-300" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                <Users size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="guardianInfo">{guardianLabel}</Label>
                <Textarea 
                  id="guardianInfo"
                  name="guardianInfo" 
                  value={formData.guardianInfo} 
                  onChange={handleChange}
                  className={errors.guardianInfo ? "border-red-300" : ""}
                  placeholder={guardianPlaceholder}
                  rows={3}
                />
                {errors.guardianInfo && <p className="text-sm text-red-500">{errors.guardianInfo}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <BookOpen size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="courseEnrollment">{courseLabel}</Label>
                <Select 
                  value={formData.courseEnrollment} 
                  onValueChange={(value) => handleSelectChange('courseEnrollment', value)}
                >
                  <SelectTrigger className={errors.courseEnrollment ? "border-red-300" : ""}>
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
                {errors.courseEnrollment && <p className="text-sm text-red-500">{errors.courseEnrollment}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <CreditCard size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="feePlan">{feeLabel}</Label>
                <Select 
                  value={formData.feePlan} 
                  onValueChange={(value) => handleSelectChange('feePlan', value)}
                >
                  <SelectTrigger className={errors.feePlan ? "border-red-300" : ""}>
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
                {errors.feePlan && <p className="text-sm text-red-500">{errors.feePlan}</p>}
              </div>
            </div>
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
