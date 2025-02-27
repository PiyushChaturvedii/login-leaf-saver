
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
  role: 'admin' | 'instructor' | 'student';
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
  const [role, setRole] = useState<'admin' | 'instructor' | 'student'>('student');

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const existingData = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (existingData.some((user: UserData) => user.email === email)) {
        toast.error("User already exists!");
        return;
      }

      const userData: UserData = {
        email,
        password,
        role,
        name,
        approved: role === 'admin',
        ...(role === 'student' && {
          github,
          linkedin,
          whatsapp,
          college,
          course,
        }),
      };

      if (role === 'admin' && !existingData.some((user: UserData) => user.role === 'admin')) {
        userData.email = 'admin@academy.com';
        userData.password = 'admin123';
        userData.approved = true;
        toast.success("Default admin credentials set!");
      }

      existingData.push(userData);
      localStorage.setItem('users', JSON.stringify(existingData));
      toast.success("Registration successful! Waiting for admin approval.");
      onToggleForm();
    } catch (error) {
      toast.error("An error occurred!");
    }
  };

  return (
    <form onSubmit={handleRegistration} className="space-y-4">
      <Input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant={role === 'student' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('student')}
        >
          <School className="w-4 h-4 mr-2" />
          Student
        </Button>
        <Button
          type="button"
          variant={role === 'instructor' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('instructor')}
        >
          <UserCog className="w-4 h-4 mr-2" />
          Instructor
        </Button>
        <Button
          type="button"
          variant={role === 'admin' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('admin')}
        >
          <UserCog className="w-4 h-4 mr-2" />
          Admin
        </Button>
      </div>

      {role === 'student' && (
        <>
          <Input
            type="text"
            placeholder="GitHub Profile URL"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="LinkedIn Profile URL"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="WhatsApp Number"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Course/Branch"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </>
      )}

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        <UserPlus className="w-4 h-4 mr-2" />
        Create Account
      </Button>

      <button
        onClick={onToggleForm}
        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 w-full text-center"
        type="button"
      >
        Already have an account? Sign in
      </button>
    </form>
  );
};
