
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Lock } from 'lucide-react';

interface UserData {
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  password: string;
  approved?: boolean;
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  college?: string;
  course?: string;
  photo?: string;
}

export const AdminProfile = () => {
  const [users, setUsers] = useState<UserData[]>(
    JSON.parse(localStorage.getItem('users') || '[]')
  );
  const [newPassword, setNewPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleApproval = (email: string, approved: boolean) => {
    const updatedUsers = users.map(user =>
      user.email === email ? { ...user, approved } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    toast.success(`User ${approved ? 'approved' : 'rejected'} successfully!`);
  };

  const handlePasswordReset = (email: string) => {
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    const updatedUsers = users.map(user =>
      user.email === email ? { ...user, password: newPassword } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setNewPassword('');
    setSelectedUser(null);
    toast.success('Password updated successfully!');
  };

  const handleUserDelete = (email: string) => {
    const updatedUsers = users.filter(user => user.email !== email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    toast.success('User deleted successfully!');
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">User Management</h3>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.email} className="border p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {user.photo ? (
                  <img src={user.photo} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10 p-2 bg-gray-100 rounded-full" />
                )}
                <div>
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">Role: {user.role}</p>
                  {user.role === 'student' && (
                    <p className="text-sm text-gray-600">
                      College: {user.college} | Course: {user.course}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                {!user.approved && user.role !== 'admin' && (
                  <Button
                    onClick={() => handleApproval(user.email, true)}
                    size="sm"
                    className="w-full"
                  >
                    Approve
                  </Button>
                )}
                {selectedUser === user.email ? (
                  <div className="flex space-x-2">
                    <Input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-32"
                    />
                    <Button
                      size="sm"
                      onClick={() => handlePasswordReset(user.email)}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUser(user.email)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Reset Password
                  </Button>
                )}
                {user.role !== 'admin' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUserDelete(user.email)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
