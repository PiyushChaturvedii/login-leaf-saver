
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Users, BookOpen, CreditCard } from 'lucide-react';
import { toast } from "sonner";

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
    
    if (!formData.name.trim()) newErrors.name = "नाम आवश्यक है";
    if (!formData.guardianInfo.trim()) newErrors.guardianInfo = "अभिभावक जानकारी आवश्यक है";
    if (!formData.courseEnrollment.trim()) newErrors.courseEnrollment = "कोर्स चयन आवश्यक है";
    if (!formData.feePlan.trim()) newErrors.feePlan = "शुल्क योजना आवश्यक है";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast.error("कृपया सभी आवश्यक फ़ील्ड भरें");
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
    "एकल भुगतान (10% छूट)",
    "दो किस्त (5% छूट)",
    "तिमाही किस्त",
    "मासिक EMI"
  ];
  
  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">छात्र प्रोफाइल सेटअप</CardTitle>
        <CardDescription className="text-center">आपकी प्रोफ़ाइल जानकारी पूरी करें</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <GraduationCap size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="name">पूरा नाम</Label>
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
                <Label htmlFor="guardianInfo">अभिभावक जानकारी</Label>
                <Textarea 
                  id="guardianInfo"
                  name="guardianInfo" 
                  value={formData.guardianInfo} 
                  onChange={handleChange}
                  className={errors.guardianInfo ? "border-red-300" : ""}
                  placeholder="नाम, संबंध, संपर्क नंबर, पता"
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
                <Label htmlFor="courseEnrollment">कोर्स चयन</Label>
                <Select 
                  value={formData.courseEnrollment} 
                  onValueChange={(value) => handleSelectChange('courseEnrollment', value)}
                >
                  <SelectTrigger className={errors.courseEnrollment ? "border-red-300" : ""}>
                    <SelectValue placeholder="कोर्स चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>उपलब्ध कोर्स</SelectLabel>
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
                <Label htmlFor="feePlan">शुल्क योजना</Label>
                <Select 
                  value={formData.feePlan} 
                  onValueChange={(value) => handleSelectChange('feePlan', value)}
                >
                  <SelectTrigger className={errors.feePlan ? "border-red-300" : ""}>
                    <SelectValue placeholder="शुल्क योजना चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>भुगतान विकल्प</SelectLabel>
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
          प्रोफ़ाइल पूरा करें
        </Button>
      </CardFooter>
    </Card>
  );
};
