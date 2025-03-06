
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock } from "lucide-react";

interface PasswordChangeProps {
  email: string;
}

export const PasswordChange = ({ email }: PasswordChangeProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords
      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match!");
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long!");
        setLoading(false);
        return;
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === email);

      if (userIndex === -1) {
        toast.error("User not found!");
        setLoading(false);
        return;
      }

      // Check current password
      if (users[userIndex].password !== currentPassword) {
        toast.error("Current password is incorrect!");
        setLoading(false);
        return;
      }

      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));

      toast.success("Password updated successfully!");
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Failed to update password!");
    }

    setLoading(false);
  };

  return (
    <Card className="shadow-md mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Lock className="mr-2 h-5 w-5" />
          <span>Change Password</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
