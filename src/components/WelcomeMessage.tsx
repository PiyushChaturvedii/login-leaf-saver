
import { Card } from "@/components/ui/card";

interface WelcomeProps {
  name: string;
  role: string;
  message?: string;
}

export const WelcomeMessage = ({ name, role, message }: WelcomeProps) => {
  const getWelcomeText = () => {
    switch (role) {
      case 'admin':
        return "Welcome to the admin dashboard. Here you can manage students, track fees, and oversee all academy activities.";
      case 'instructor':
        return "Welcome to the instructor panel. You can manage projects, attendance, and student submissions.";
      case 'student':
        return "Welcome to your student dashboard. Stay updated with your projects, attendance, and academic progress.";
      default:
        return message || "Welcome to the academy dashboard.";
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 shadow-lg mb-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {name}!</h1>
        <p className="text-gray-600">{getWelcomeText()}</p>
        {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
      </div>
    </Card>
  );
};
