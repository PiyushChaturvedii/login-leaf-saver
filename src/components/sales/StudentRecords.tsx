
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { StudentForm } from './StudentForm';
import { FeedbackPanel } from './FeedbackPanel';

// Define the types
interface Student {
  id: number;
  name: string;
  contact: string;
  courseInterested: string;
  source: string;
  status: 'New' | 'Called' | 'Follow-up' | 'Converted';
  timestamp: string;
  entryDate: string;
  notes?: string;
}

export const StudentRecords: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Rahul Singh",
      contact: "9876543210",
      courseInterested: "Web Development",
      source: "Instagram",
      status: "New",
      timestamp: "10:30 AM",
      entryDate: "2023-05-13"
    },
    {
      id: 2,
      name: "Priya Sharma",
      contact: "8765432109",
      courseInterested: "UI/UX Design",
      source: "Facebook",
      status: "Called",
      timestamp: "11:45 AM",
      entryDate: "2023-05-13"
    },
    {
      id: 3,
      name: "Amit Kumar",
      contact: "7654321098",
      courseInterested: "Python Programming",
      source: "Website",
      status: "Follow-up",
      timestamp: "01:15 PM",
      entryDate: "2023-05-13"
    },
    {
      id: 4,
      name: "Neha Gupta",
      contact: "6543210987",
      courseInterested: "Digital Marketing",
      source: "Referral",
      status: "Converted",
      timestamp: "02:30 PM",
      entryDate: "2023-05-13"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.contact.includes(searchTerm) ||
                         student.courseInterested.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesStatus = statusFilter ? student.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'timestamp' | 'entryDate'>) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const entryDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const studentWithId: Student = {
      ...newStudent,
      id: students.length + 1,
      timestamp,
      entryDate
    };
    
    setStudents([...students, studentWithId]);
    setShowAddForm(false);
    toast.success("New student record added successfully!");
  };

  const handleUpdateStatus = (updatedStudent: Student) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    setShowFeedbackPanel(false);
    setSelectedStudent(null);
    toast.success("Student status updated successfully!");
  };

  const openFeedbackPanel = (student: Student) => {
    setSelectedStudent(student);
    setShowFeedbackPanel(true);
  };

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
    <DashboardLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-800">Student Records</h1>
            <p className="text-gray-600">Manage and track student inquiries</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="bg-green-600 hover:bg-green-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add New Record
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filter Records</CardTitle>
            <CardDescription>Search and filter student records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, contact or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Called">Called</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.contact}</TableCell>
                      <TableCell>{student.courseInterested}</TableCell>
                      <TableCell>{student.source}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>{student.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openFeedbackPanel(student)}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No students found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {showAddForm && (
          <StudentForm 
            onSubmit={handleAddStudent}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {showFeedbackPanel && selectedStudent && (
          <FeedbackPanel
            student={selectedStudent}
            onSubmit={handleUpdateStatus}
            onCancel={() => {
              setShowFeedbackPanel(false);
              setSelectedStudent(null);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
