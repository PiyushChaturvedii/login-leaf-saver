
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserCog } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
    console.log("Loaded users:", filteredUsers);
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
      console.log("Before update:", allUsers[userIndex]);
      allUsers[userIndex].password = newPassword;
      console.log("After update:", allUsers[userIndex]);
      localStorage.setItem('users', JSON.stringify(allUsers));

      // Show success message
      toast.success(`Password for ${allUsers[userIndex].name} updated successfully!`);
      
      // Reset form
      setNewPassword('');
      setConfirmPassword('');
      setSelectedUser('');
      
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Failed to update password! Please try again.");
    } finally {
      setLoading(false);
    }
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
            <Label htmlFor="user-select">Select User</Label>
            <Select 
              value={selectedUser} 
              onValueChange={setSelectedUser}
            >
              <SelectTrigger id="user-select" className="w-full">
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
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
              className="border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              className="border-gray-300"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all" 
            disabled={loading || !selectedUser || !newPassword || !confirmPassword}
          >
            {loading ? "Updating..." : "Update User Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
