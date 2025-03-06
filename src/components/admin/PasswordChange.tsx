
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, UserCog } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PasswordChangeProps {
  email: string;
}

export const PasswordChange = ({ email }: PasswordChangeProps) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    // Filter out the admin user from the list
    const filteredUsers = storedUsers.filter((u: any) => u.email !== email);
    setUsers(filteredUsers);
  }, [email]);

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

      if (!selectedUser) {
        toast.error("Please select a user!");
        setLoading(false);
        return;
      }

      // Get users from localStorage
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = allUsers.findIndex((u: any) => u.email === selectedUser);

      if (userIndex === -1) {
        toast.error("User not found!");
        setLoading(false);
        return;
      }

      // Update password
      allUsers[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(allUsers));

      toast.success("Password updated successfully!");
      
      // Reset form
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
          <UserCog className="mr-2 h-5 w-5" />
          <span>Change User Password</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select User</label>
            <Select 
              value={selectedUser} 
              onValueChange={setSelectedUser}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.email} value={user.email}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            disabled={loading || !selectedUser || !newPassword || !confirmPassword}
          >
            {loading ? "Updating..." : "Update User Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
