
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Home, Bell, Upload, Video, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UserData {
  email: string;
  name: string;
  role: 'admin' | 'student';
  github?: string;
  linkedin?: string;
  whatsapp?: string;
  college?: string;
  course?: string;
}

interface Project {
  id: string;
  title: string;
  deployLink?: string;
  studentEmail?: string;
  submittedAt: string;
  grade?: number;
}

interface AttendanceCode {
  code: string;
  expiresAt: number;
}

interface Attendance {
  id: string;
  studentEmail: string;
  code: string;
  submittedAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'attendance'>('projects');
  const [deployLink, setDeployLink] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [attendanceCode, setAttendanceCode] = useState<AttendanceCode | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [submittedCode, setSubmittedCode] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUserData(JSON.parse(currentUser));

    // Load projects
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }

    // Load attendances
    const savedAttendances = localStorage.getItem('attendances');
    if (savedAttendances) {
      setAttendances(JSON.parse(savedAttendances));
    }

    // Load attendance code
    const savedCode = localStorage.getItem('attendanceCode');
    if (savedCode) {
      const code = JSON.parse(savedCode);
      if (code.expiresAt > Date.now()) {
        setAttendanceCode(code);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success("Logged out successfully");
    navigate('/');
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    if (userData.role === 'admin') {
      const newProject: Project = {
        id: Date.now().toString(),
        title: newProjectTitle,
        submittedAt: new Date().toISOString(),
      };
      const updatedProjects = [...projects, newProject];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      setNewProjectTitle('');
      toast.success('Project created successfully!');
    } else {
      // Student submitting deploy link
      const project = projects.find(p => !p.deployLink);
      if (project) {
        const updatedProjects = projects.map(p => 
          p.id === project.id 
            ? { ...p, deployLink, studentEmail: userData.email }
            : p
        );
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        setDeployLink('');
        toast.success('Project link submitted successfully!');
      }
    }
  };

  const generateAttendanceCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    const newCode = { code, expiresAt };
    setAttendanceCode(newCode);
    localStorage.setItem('attendanceCode', JSON.stringify(newCode));
    toast.success('Attendance code generated! Valid for 5 minutes');
  };

  const submitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData || !attendanceCode) return;

    if (submittedCode !== attendanceCode.code) {
      toast.error('Invalid attendance code!');
      return;
    }

    if (Date.now() > attendanceCode.expiresAt) {
      toast.error('Attendance code has expired!');
      return;
    }

    const newAttendance: Attendance = {
      id: Date.now().toString(),
      studentEmail: userData.email,
      code: submittedCode,
      submittedAt: new Date().toISOString(),
    };

    const updatedAttendances = [...attendances, newAttendance];
    localStorage.setItem('attendances', JSON.stringify(updatedAttendances));
    setAttendances(updatedAttendances);
    setSubmittedCode('');
    toast.success('Attendance submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="w-6 h-6 text-gray-700" />
              <span className="ml-2 text-lg font-semibold text-gray-900">
                {userData?.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setActiveTab('projects')}>
                Projects
              </Button>
              {userData?.role === 'student' && (
                <>
                  <Button variant="ghost" onClick={() => setActiveTab('profile')}>
                    Profile
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveTab('attendance')}>
                    Attendance
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Welcome Card */}
          <Card className="bg-white p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <User className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Welcome, {userData?.name}!</h2>
                <p className="text-gray-600">{userData?.email}</p>
              </div>
            </div>
          </Card>

          {activeTab === 'projects' && (
            <div className="space-y-6">
              {userData?.role === 'admin' ? (
                <>
                  {/* Admin: Create Project */}
                  <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Project</h3>
                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      <Input
                        placeholder="Project Title"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        required
                      />
                      <Button type="submit" className="w-full">
                        Create Project
                      </Button>
                    </form>
                  </Card>

                  {/* Admin: View Submissions */}
                  <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Project Submissions</h3>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="border p-4 rounded-lg">
                          <h4 className="font-medium">{project.title}</h4>
                          {project.deployLink ? (
                            <>
                              <p className="text-sm text-gray-600">
                                Submitted by: {project.studentEmail}
                              </p>
                              <a
                                href={project.deployLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Deployment
                              </a>
                              <div className="mt-2">
                                <Input
                                  type="number"
                                  placeholder="Grade (0-100)"
                                  min="0"
                                  max="100"
                                  defaultValue={project.grade}
                                  onChange={(e) => {
                                    const updatedProjects = projects.map(p =>
                                      p.id === project.id
                                        ? { ...p, grade: Number(e.target.value) }
                                        : p
                                    );
                                    localStorage.setItem('projects', JSON.stringify(updatedProjects));
                                    setProjects(updatedProjects);
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-gray-600">Waiting for submission...</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Admin: Attendance Management */}
                  <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Attendance Management</h3>
                    <div className="space-y-4">
                      <Button onClick={generateAttendanceCode} className="w-full">
                        Generate Attendance Code
                      </Button>
                      {attendanceCode && Date.now() < attendanceCode.expiresAt && (
                        <div className="text-center">
                          <p className="text-xl font-bold">{attendanceCode.code}</p>
                          <p className="text-sm text-gray-600">
                            Expires in {Math.ceil((attendanceCode.expiresAt - Date.now()) / 1000)}s
                          </p>
                        </div>
                      )}
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Attendance Records</h4>
                        {attendances.map((attendance) => (
                          <div key={attendance.id} className="text-sm">
                            {attendance.studentEmail} - {new Date(attendance.submittedAt).toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  {/* Student: Submit Project */}
                  <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Submit Project</h3>
                    {projects
                      .filter(p => !p.deployLink)
                      .map((project) => (
                        <div key={project.id} className="space-y-4">
                          <h4 className="font-medium">{project.title}</h4>
                          <form onSubmit={handleProjectSubmit}>
                            <Input
                              type="url"
                              placeholder="GitHub Deploy Link"
                              value={deployLink}
                              onChange={(e) => setDeployLink(e.target.value)}
                              required
                            />
                            <Button type="submit" className="w-full mt-2">
                              Submit Project
                            </Button>
                          </form>
                        </div>
                      ))}
                  </Card>

                  {/* Student: View Submissions */}
                  <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">My Submissions</h3>
                    <div className="space-y-4">
                      {projects
                        .filter(p => p.studentEmail === userData?.email)
                        .map((project) => (
                          <div key={project.id} className="border p-4 rounded-lg">
                            <h4 className="font-medium">{project.title}</h4>
                            <a
                              href={project.deployLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Deployment
                            </a>
                            <p className="mt-2">
                              Grade: {project.grade !== undefined ? project.grade : 'Pending'}
                            </p>
                          </div>
                        ))}
                    </div>
                  </Card>
                </>
              )}
            </div>
          )}

          {activeTab === 'profile' && userData?.role === 'student' && (
            <Card className="p-6 bg-white shadow-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Student Profile</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="mt-1">{userData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="mt-1">{userData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">College</label>
                    <p className="mt-1">{userData.college}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Course</label>
                    <p className="mt-1">{userData.course}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">GitHub</label>
                    <a
                      href={userData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline block"
                    >
                      {userData.github}
                    </a>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">LinkedIn</label>
                    <a
                      href={userData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline block"
                    >
                      {userData.linkedin}
                    </a>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                    <p className="mt-1">{userData.whatsapp}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'attendance' && userData?.role === 'student' && (
            <Card className="p-6 bg-white shadow-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Submit Attendance</h3>
              <form onSubmit={submitAttendance} className="space-y-4">
                <Input
                  placeholder="Enter Attendance Code"
                  value={submittedCode}
                  onChange={(e) => setSubmittedCode(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Submit Attendance
                </Button>
              </form>
              <div className="mt-4">
                <h4 className="font-medium mb-2">My Attendance Records</h4>
                {attendances
                  .filter(a => a.studentEmail === userData.email)
                  .map((attendance) => (
                    <div key={attendance.id} className="text-sm">
                      Submitted: {new Date(attendance.submittedAt).toLocaleString()}
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
