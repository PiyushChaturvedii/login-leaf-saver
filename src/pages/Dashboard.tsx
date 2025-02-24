
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Home, Bell, Inbox } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface UserData {
  email: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUserData(JSON.parse(currentUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="w-6 h-6 text-gray-700" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon">
                <Inbox className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="col-span-full bg-white p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <User className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Welcome back!</h2>
                <p className="text-gray-600">{userData?.email}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Quick Actions</h3>
              <Settings className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Inbox className="w-4 h-4 mr-2" />
                Messages
              </Button>
            </div>
          </Card>

          {/* Additional Cards */}
          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
            <p className="text-gray-600">No recent activity to show</p>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Notifications</h3>
            <p className="text-gray-600">You have no new notifications</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
