
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCardProps {
  userData: {
    name: string;
    role: string;
    email: string;
    photo?: string;
    [key: string]: any;
  };
  className?: string;
}

export const ProfileCard = ({ userData, className = '' }: ProfileCardProps) => {
  // Generate initials for the avatar fallback
  const getInitials = () => {
    return userData.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get role display name
  const getRoleDisplay = () => {
    switch (userData.role) {
      case 'admin': return 'एडमिन';
      case 'instructor': return 'शिक्षक';
      case 'student': return 'छात्र';
      case 'accounting': return 'अकाउंटेंट';
      default: return userData.role;
    }
  };

  // Get role color
  const getRoleBadgeClass = () => {
    switch (userData.role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'instructor': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'accounting': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-20"></div>
      <CardContent className="relative pt-0">
        <div className="-mt-10 flex justify-center">
          <Avatar className="h-20 w-20 border-4 border-white shadow-md">
            <AvatarImage src={userData.photo} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-lg">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium text-gray-900">{userData.name}</h3>
          <div className="flex justify-center mt-1">
            <Badge className={`${getRoleBadgeClass()} font-normal`}>
              {getRoleDisplay()}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-2">{userData.email}</p>
        </div>

        {userData.courseEnrollment && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500">कोर्स</p>
            <p className="text-gray-900">{userData.courseEnrollment}</p>
          </div>
        )}

        {userData.subjects && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500">विषय</p>
            <p className="text-gray-900">{userData.subjects}</p>
          </div>
        )}

        {userData.department && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500">विभाग</p>
            <p className="text-gray-900">{userData.department}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
