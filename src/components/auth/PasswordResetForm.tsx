
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserService } from "@/services/UserService";

interface PasswordResetProps {
  onBack: () => void;
}

export const PasswordResetForm = ({ onBack }: PasswordResetProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if user exists
      const user = await UserService.getUserByEmail(email);
      
      if (user) {
        // In a real application, you would send a reset email here
        // For now, we'll just simulate success
        toast.success("पासवर्ड रीसेट निर्देश आपके ईमेल पर भेजे गए हैं");
        setIsSubmitted(true);
      } else {
        toast.error("उस ईमेल से कोई खाता नहीं मिला");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("पासवर्ड रीसेट में त्रुटि हुई। कृपया पुन: प्रयास करें।");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium">पासवर्ड रीसेट भेजा गया</h3>
        <p className="text-sm text-gray-600">
          हमने {email} पर पासवर्ड रीसेट निर्देश भेज दिए हैं।
          कृपया अपना इनबॉक्स देखें और निर्देशों का पालन करें।
        </p>
        
        <Button onClick={onBack} className="mt-4 w-full">
          लॉगिन पर वापस जाएं
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">ईमेल पता</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="अपना पंजीकृत ईमेल पता दर्ज करें"
          required
          disabled={isLoading}
        />
      </div>
      
      <p className="text-sm text-gray-600">
        हम आपको एक पासवर्ड रीसेट लिंक भेजेंगे जिसे आप अपने खाते तक पुन: पहुंच प्राप्त करने के लिए उपयोग कर सकते हैं।
      </p>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          वापस जाएं
        </Button>
        
        <Button
          type="submit"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'भेज रहा है...' : 'रीसेट भेजें'}
        </Button>
      </div>
    </form>
  );
};
