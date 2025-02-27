
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PasswordResetFormProps {
  onBack: () => void;
}

export const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [resetEmail, setResetEmail] = useState('');

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === resetEmail);
    
    if (userIndex === -1) {
      toast.error("User not found!");
      return;
    }

    const newPassword = Math.random().toString(36).slice(-8);
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    toast.success(`Password reset successful! New password: ${newPassword}`);
    onBack();
    setResetEmail('');
  };

  return (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">Reset Password</Button>
      <Button 
        type="button" 
        variant="ghost" 
        className="w-full"
        onClick={onBack}
      >
        Back to Login
      </Button>
    </form>
  );
};
