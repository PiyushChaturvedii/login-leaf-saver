
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Award, Clock } from 'lucide-react';
import { toast } from "sonner";

interface TeacherFormData {
  name: string;
  subjects: string;
  qualifications: string;
  availableHours: string;
}

interface TeacherProfileFormProps {
  initialData?: Partial<TeacherFormData>;
  onSubmit: (data: TeacherFormData) => void;
}

export const TeacherProfileForm = ({ initialData = {}, onSubmit }: TeacherProfileFormProps) => {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: initialData.name || '',
    subjects: initialData.subjects || '',
    qualifications: initialData.qualifications || '',
    availableHours: initialData.availableHours || '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof TeacherFormData, string>>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name as keyof TeacherFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof TeacherFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = "नाम आवश्यक है";
    if (!formData.subjects.trim()) newErrors.subjects = "विषय आवश्यक हैं";
    if (!formData.qualifications.trim()) newErrors.qualifications = "योग्यताएं आवश्यक हैं";
    if (!formData.availableHours.trim()) newErrors.availableHours = "उपलब्ध घंटे आवश्यक हैं";
    
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
  
  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">शिक्षक प्रोफाइल सेटअप</CardTitle>
        <CardDescription className="text-center">आपकी प्रोफ़ाइल जानकारी पूरी करें</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                <BookOpen size={24} />
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
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <BookOpen size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="subjects">विषय (अल्पविराम से अलग करें)</Label>
                <Input 
                  id="subjects"
                  name="subjects" 
                  value={formData.subjects} 
                  onChange={handleChange}
                  className={errors.subjects ? "border-red-300" : ""}
                />
                {errors.subjects && <p className="text-sm text-red-500">{errors.subjects}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <Award size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="qualifications">योग्यताएं</Label>
                <Textarea 
                  id="qualifications"
                  name="qualifications" 
                  value={formData.qualifications} 
                  onChange={handleChange}
                  className={errors.qualifications ? "border-red-300" : ""}
                  rows={3}
                />
                {errors.qualifications && <p className="text-sm text-red-500">{errors.qualifications}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                <Clock size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="availableHours">उपलब्ध घंटे</Label>
                <Input 
                  id="availableHours"
                  name="availableHours" 
                  value={formData.availableHours} 
                  onChange={handleChange}
                  placeholder="उदाहरण: सोम-शुक्र 9AM-5PM, शनि 10AM-2PM"
                  className={errors.availableHours ? "border-red-300" : ""}
                />
                {errors.availableHours && <p className="text-sm text-red-500">{errors.availableHours}</p>}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg flex justify-end">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          प्रोफ़ाइल पूरा करें
        </Button>
      </CardFooter>
    </Card>
  );
};
