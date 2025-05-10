
import { useState } from 'react';
import { UserPlus, School, UserCog } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface RegistrationFormProps {
  onToggleForm: () => void;
}

interface UserData {
  email: string;
  password: string;
  role: 'admin' | 'instructor' | 'student' | 'sales' | 'accounting';
  name: string;
  approved?: boolean;
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  college?: string;
  course?: string;
}

export const RegistrationForm = ({ onToggleForm }: RegistrationFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [role, setRole] = useState<'admin' | 'instructor' | 'student' | 'sales' | 'accounting'>('student');

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const existingData = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (existingData.some((user: UserData) => user.email === email)) {
        toast.error("यूजर पहले से मौजूद है!");
        return;
      }

      // Check if we're creating the first admin
      const isFirstAdmin = role === 'admin' && !existingData.some((user: UserData) => user.role === 'admin');

      const userData: UserData = {
        email: isFirstAdmin ? 'admin@academy.com' : email,
        password: isFirstAdmin ? 'admin123' : password,
        role,
        name,
        approved: role === 'admin', // Admin users are auto-approved
        ...(role === 'student' && {
          github,
          linkedin,
          whatsapp,
          college,
          course,
        }),
      };

      if (isFirstAdmin) {
        toast.success("डिफ़ॉल्ट एडमिन क्रेडेंशियल्स सेट किए गए!");
      }

      existingData.push(userData);
      localStorage.setItem('users', JSON.stringify(existingData));
      
      if (role !== 'admin') {
        toast.success("पंजीकरण सफल! एडमिन अप्रूवल का इंतजार करें।");
      } else {
        toast.success("एडमिन पंजीकरण सफल! आप अब लॉगिन कर सकते हैं।");
      }
      
      onToggleForm();
    } catch (error) {
      toast.error("एक त्रुटि हुई!");
    }
  };

  return (
    <form onSubmit={handleRegistration} className="space-y-4">
      <Input
        type="text"
        placeholder="पूरा नाम"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={role === 'student' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('student')}
        >
          <School className="w-4 h-4 mr-2" />
          छात्र
        </Button>
        <Button
          type="button"
          variant={role === 'instructor' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('instructor')}
        >
          <UserCog className="w-4 h-4 mr-2" />
          शिक्षक
        </Button>
        <Button
          type="button"
          variant={role === 'admin' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('admin')}
        >
          <UserCog className="w-4 h-4 mr-2" />
          एडमिन
        </Button>
        <Button
          type="button"
          variant={role === 'sales' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('sales')}
        >
          <UserCog className="w-4 h-4 mr-2" />
          सेल्स
        </Button>
      </div>

      {role === 'student' && (
        <>
          <Input
            type="text"
            placeholder="GitHub प्रोफाइल URL"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="LinkedIn प्रोफाइल URL"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="WhatsApp नंबर"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="कॉलेज का नाम"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="कोर्स/ब्रांच"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </>
      )}

      <Input
        type="email"
        placeholder="ईमेल"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="पासवर्ड"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        <UserPlus className="w-4 h-4 mr-2" />
        अकाउंट बनाएँ
      </Button>

      <button
        onClick={onToggleForm}
        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 w-full text-center"
        type="button"
      >
        पहले से अकाउंट है? साइन इन करें
      </button>
    </form>
  );
};
