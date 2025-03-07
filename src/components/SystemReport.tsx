
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import { Input } from './ui/input';
import { PasswordChange } from './admin/PasswordChange';
import { AccountingRole } from './admin/AccountingRole';
import { InvoiceManagement } from './admin/InvoiceManagement';

// Define the user type
interface User {
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student' | 'accounting';
  password?: string;
  fees?: any;
}

export const SystemReport = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'instructor' | 'student' | 'accounting'>('student');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Load users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
    
    // Load current user session
    const sessionData = localStorage.getItem('currentUser');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      setCurrentUserEmail(session.email);
      setCurrentUserRole(session.role);
    }
  }, []);

  const handleEditUser = (user: User) => {
    setEditingUser(user.email);
    setEditName(user.name);
    setEditRole(user.role);
  };

  const handleSaveUser = (email: string) => {
    const updatedUsers = users.map(user => 
      user.email === email 
        ? { ...user, name: editName, role: editRole }
        : user
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setEditingUser(null);
    toast.success('User updated successfully');
  };

  const handleDeleteUser = (email: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const filteredUsers = users.filter(user => user.email !== email);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      setUsers(filteredUsers);
      toast.success('User deleted successfully');
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full">
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      
      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            <span>All Users</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-slate-100 p-3 rounded-md grid grid-cols-12 font-medium">
              <div className="col-span-3">Name</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-3">Role</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            {users.map((user) => (
              <div key={user.email} className="bg-white p-3 rounded-md shadow-sm border grid grid-cols-12 items-center">
                {editingUser === user.email ? (
                  <>
                    <div className="col-span-3">
                      <Input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-4">{user.email}</div>
                    <div className="col-span-3">
                      <select 
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as 'admin' | 'instructor' | 'student' | 'accounting')}
                        className="w-full p-2 border rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="instructor">Instructor</option>
                        <option value="student">Student</option>
                        <option value="accounting">Accounting</option>
                      </select>
                    </div>
                    <div className="col-span-2 flex justify-end space-x-1">
                      <Button size="sm" onClick={() => handleSaveUser(user.email)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-3">{user.name}</div>
                    <div className="col-span-4">{user.email}</div>
                    <div className="col-span-3 capitalize">{user.role}</div>
                    <div className="col-span-2 flex justify-end space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.email)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Show password change component for admin */}
      {currentUserEmail && currentUserRole === 'admin' && (
        <PasswordChange email={currentUserEmail} />
      )}
      
      {/* Show accounting role component for admin or accounting role */}
      {currentUserEmail && 
        (currentUserRole === 'admin' || currentUserRole === 'accounting') && (
        <>
          <AccountingRole />
          <InvoiceManagement />
        </>
      )}
    </div>
  );
};
