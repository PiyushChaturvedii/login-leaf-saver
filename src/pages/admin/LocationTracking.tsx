
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { locationService } from '../../services/LocationService';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface LocationData {
  userId: string;
  role: string;
  lat: number;
  lng: number;
  timestamp: string;
  date: string;
}

const LocationTracking = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [locationLogs, setLocationLogs] = useState<LocationData[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LocationData[]>([]);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [userIdFilter, setUserIdFilter] = useState<string>('all');
  const [users, setUsers] = useState<{id: string, name: string, role: string}[]>([]);

  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/');
      return;
    }
    
    const user = JSON.parse(storedUser);
    setCurrentUser(user);
    
    if (user.role !== 'admin') {
      navigate('/user-dashboard');
      return;
    }
    
    // Load location logs
    const logs = locationService.getAllLocationLogs();
    setLocationLogs(logs);
    setFilteredLogs(logs);
    
    // Get unique users from logs
    const uniqueUsers = Array.from(new Set(logs.map(log => log.userId)))
      .map(userId => {
        const user = logs.find(log => log.userId === userId);
        return {
          id: userId,
          name: userId, // In a real app, you'd fetch the user's name
          role: user?.role || ''
        };
      });
    setUsers(uniqueUsers);
  }, [navigate]);

  useEffect(() => {
    let filtered = locationLogs;
    
    if (dateFilter) {
      filtered = filtered.filter(log => log.date === dateFilter);
    }
    
    if (roleFilter && roleFilter !== 'all') {
      filtered = filtered.filter(log => log.role === roleFilter);
    }
    
    if (userIdFilter && userIdFilter !== 'all') {
      filtered = filtered.filter(log => log.userId === userIdFilter);
    }
    
    setFilteredLogs(filtered);
  }, [dateFilter, roleFilter, userIdFilter, locationLogs]);

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">लोकेशन ट्रैकिंग डैशबोर्ड</CardTitle>
            <CardDescription>
              उपयोगकर्ताओं की स्थान जानकारी देखें और फ़िल्टर करें
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="w-full md:w-auto">
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full"
                  placeholder="दिनांक द्वारा फ़िल्टर करें"
                />
              </div>
              
              <div className="w-full md:w-auto flex-1">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="भूमिका द्वारा फ़िल्टर करें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी भूमिकाएँ</SelectItem>
                    <SelectItem value="admin">एडमिन</SelectItem>
                    <SelectItem value="instructor">शिक्षक</SelectItem>
                    <SelectItem value="student">छात्र</SelectItem>
                    <SelectItem value="sales">सेल्स</SelectItem>
                    <SelectItem value="accounting">अकाउंटिंग</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-auto flex-1">
                <Select value={userIdFilter} onValueChange={setUserIdFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="उपयोगकर्ता द्वारा फ़िल्टर करें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी उपयोगकर्ता</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>उपयोगकर्ता ID</TableHead>
                    <TableHead>भूमिका</TableHead>
                    <TableHead>दिनांक & समय</TableHead>
                    <TableHead>अक्षांश</TableHead>
                    <TableHead>देशांतर</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>{log.role}</TableCell>
                        <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                        <TableCell>{log.lat.toFixed(6)}</TableCell>
                        <TableCell>{log.lng.toFixed(6)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        कोई लोकेशन डेटा उपलब्ध नहीं है
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LocationTracking;
