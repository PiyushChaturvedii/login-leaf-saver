
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';

export const StudentRecordsPreview: React.FC = () => {
  // Sample data - in a real app this would come from an API or context
  const recentStudents = [
    {
      id: 1,
      name: "Rahul Singh",
      course: "Web Development",
      status: "New",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      name: "Priya Sharma",
      course: "UI/UX Design",
      status: "Follow-up",
      timestamp: "3 hours ago"
    },
    {
      id: 3,
      name: "Amit Kumar",
      course: "Python Programming",
      status: "Converted",
      timestamp: "5 hours ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'Called':
        return <Badge className="bg-amber-500">Called</Badge>;
      case 'Follow-up':
        return <Badge className="bg-purple-500">Follow-up</Badge>;
      case 'Converted':
        return <Badge className="bg-green-500">Converted</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Today's Leads</CardTitle>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{recentStudents.length} new today</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentStudents.map(student => (
            <div key={student.id} className="flex justify-between items-center border-b pb-2 last:border-0">
              <div>
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-gray-500">{student.course}</div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(student.status)}
                <span className="text-xs text-gray-500">{student.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/sales/records" className="w-full">
          <Button variant="outline" className="w-full">
            View All Records
            <ChevronsRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
