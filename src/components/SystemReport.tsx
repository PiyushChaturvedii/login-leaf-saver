
import { Card } from "@/components/ui/card";

interface UserData {
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  college?: string;
  course?: string;
  fees?: {
    amount: number;
    paid: number;
    lastPaid?: string;
  };
}

interface Project {
  id: string;
  title: string;
  deployLink?: string;
  studentEmail?: string;
  submittedAt: string;
  grade?: number;
  startDate: string;
  endDate: string;
  createdBy: string;
}

interface Attendance {
  id: string;
  studentEmail: string;
  code: string;
  submittedAt: string;
}

export const SystemReport = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const attendances = JSON.parse(localStorage.getItem('attendances') || '[]');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">System Report</h2>
        
        {/* Users Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Users Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-medium">Total Users</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-lg font-medium">Students</p>
              <p className="text-3xl font-bold">
                {users.filter((u: UserData) => u.role === 'student').length}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-lg font-medium">Instructors</p>
              <p className="text-3xl font-bold">
                {users.filter((u: UserData) => u.role === 'instructor').length}
              </p>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Projects Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-lg font-medium">Total Projects</p>
              <p className="text-3xl font-bold">{projects.length}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-lg font-medium">Submitted Projects</p>
              <p className="text-3xl font-bold">
                {projects.filter((p: Project) => p.deployLink).length}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Reports */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Student Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">College</th>
                    <th className="border p-2">Course</th>
                    <th className="border p-2">Fees Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user: UserData) => user.role === 'student')
                    .map((student: UserData) => (
                      <tr key={student.email}>
                        <td className="border p-2">{student.name}</td>
                        <td className="border p-2">{student.email}</td>
                        <td className="border p-2">{student.college || '-'}</td>
                        <td className="border p-2">{student.course || '-'}</td>
                        <td className="border p-2">₹{student.fees?.paid || 0}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Project Submissions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">Submission Date</th>
                    <th className="border p-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {projects
                    .filter((project: Project) => project.deployLink)
                    .map((project: Project) => (
                      <tr key={project.id}>
                        <td className="border p-2">{project.title}</td>
                        <td className="border p-2">{project.studentEmail || '-'}</td>
                        <td className="border p-2">
                          {new Date(project.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="border p-2">{project.grade || 'Pending'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Attendance Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2">Student</th>
                    <th className="border p-2">Sessions Attended</th>
                    <th className="border p-2">Last Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user: UserData) => user.role === 'student')
                    .map((student: UserData) => {
                      const studentAttendances = attendances.filter(
                        (a: Attendance) => a.studentEmail === student.email
                      );
                      const lastAttendance = studentAttendances[studentAttendances.length - 1];
                      
                      return (
                        <tr key={student.email}>
                          <td className="border p-2">{student.name}</td>
                          <td className="border p-2">{studentAttendances.length}</td>
                          <td className="border p-2">
                            {lastAttendance
                              ? new Date(lastAttendance.submittedAt).toLocaleDateString()
                              : '-'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
