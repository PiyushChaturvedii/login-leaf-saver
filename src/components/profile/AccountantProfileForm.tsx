
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Building, CreditCard, Banknote } from 'lucide-react';
import { toast } from "sonner";

interface AccountantFormData {
  name: string;
  department: string;
  bankDetails: string;
  paymentDetails: string;
}

interface AccountantProfileFormProps {
  initialData?: Partial<AccountantFormData>;
  onSubmit: (data: AccountantFormData) => void;
}

export const AccountantProfileForm = ({ initialData = {}, onSubmit }: AccountantProfileFormProps) => {
  const [formData, setFormData] = useState<AccountantFormData>({
    name: initialData.name || '',
    department: initialData.department || '',
    bankDetails: initialData.bankDetails || '',
    paymentDetails: initialData.paymentDetails || '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof AccountantFormData, string>>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof AccountantFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof AccountantFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = "नाम आवश्यक है";
    if (!formData.department.trim()) newErrors.department = "विभाग आवश्यक है";
    if (!formData.bankDetails.trim()) newErrors.bankDetails = "बैंक विवरण आवश्यक है";
    if (!formData.paymentDetails.trim()) newErrors.paymentDetails = "भुगतान विवरण आवश्यक है";
    
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
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">अकाउंटेंट प्रोफाइल सेटअप</CardTitle>
        <CardDescription className="text-center">आपकी प्रोफ़ाइल जानकारी पूरी करें</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <Briefcase size={24} />
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
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                <Building size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="department">विभाग</Label>
                <Input 
                  id="department"
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange}
                  className={errors.department ? "border-red-300" : ""}
                />
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <CreditCard size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="bankDetails">बैंक विवरण</Label>
                <Textarea 
                  id="bankDetails"
                  name="bankDetails" 
                  value={formData.bankDetails} 
                  onChange={handleChange}
                  className={errors.bankDetails ? "border-red-300" : ""}
                  placeholder="खाता संख्या, बैंक का नाम, IFSC कोड"
                  rows={3}
                />
                {errors.bankDetails && <p className="text-sm text-red-500">{errors.bankDetails}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                <Banknote size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="paymentDetails">UPI/Pay विवरण</Label>
                <Textarea 
                  id="paymentDetails"
                  name="paymentDetails" 
                  value={formData.paymentDetails} 
                  onChange={handleChange}
                  className={errors.paymentDetails ? "border-red-300" : ""}
                  placeholder="UPI आईडी, Google Pay, PhonePe, आदि"
                  rows={2}
                />
                {errors.paymentDetails && <p className="text-sm text-red-500">{errors.paymentDetails}</p>}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg flex justify-end">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          प्रोफ़ाइल पूरा करें
        </Button>
      </CardFooter>
    </Card>
  );
};
