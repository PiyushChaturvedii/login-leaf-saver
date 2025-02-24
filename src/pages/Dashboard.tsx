
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
}

interface Project {
  id: string;
  studentEmail: string;
  title: string;
  description: string;
  submittedAt: string;
  grade?: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

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

    // Load zoom link for students
    const savedZoomLink = localStorage.getItem('zoomLink');
    if (savedZoomLink) {
      setZoomLink(savedZoomLink);
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

    const newProject: Project = {
      id: Date.now().toString(),
      studentEmail: userData.email,
      title: projectTitle,
      description: projectDescription,
      submittedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setProjectTitle('');
    setProjectDescription('');
    toast.success('Project submitted successfully!');
  };

  const handleZoomLinkUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('zoomLink', zoomLink);
    toast.success('Zoom link updated successfully!');
  };

  const handleGradeSubmit = (projectId: string, grade: number) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId ? { ...project, grade } : project
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    toast.success('Grade submitted successfully!');
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
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Welcome Card */}
          <Card className="col-span-full bg-white p-6 shadow-lg">
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

          {userData?.role === 'admin' ? (
            <>
              {/* Admin: Zoom Link Management */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Manage Zoom Link</h3>
                <form onSubmit={handleZoomLinkUpdate} className="space-y-4">
                  <Input
                    type="url"
                    placeholder="Enter Zoom Meeting Link"
                    value={zoomLink}
                    onChange={(e) => setZoomLink(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">
                    <Video className="w-4 h-4 mr-2" />
                    Update Zoom Link
                  </Button>
                </form>
              </Card>

              {/* Admin: Project Grading */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Student Projects</h3>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border p-4 rounded-lg">
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Grade (0-100)"
                          min="0"
                          max="100"
                          defaultValue={project.grade}
                          onChange={(e) => handleGradeSubmit(project.id, Number(e.target.value))}
                        />
                        <Button size="icon" variant="outline">
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <>
              {/* Student: Project Submission */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Submit Project</h3>
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <Input
                    placeholder="Project Title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    required
                  />
                  <textarea
                    className="w-full p-2 border rounded-md"
                    placeholder="Project Description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={4}
                    required
                  />
                  <Button type="submit" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Project
                  </Button>
                </form>
              </Card>

              {/* Student: Zoom Link */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Join Class</h3>
                {zoomLink ? (
                  <Button 
                    className="w-full"
                    onClick={() => window.open(zoomLink, '_blank')}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Zoom Meeting
                  </Button>
                ) : (
                  <p className="text-gray-600">No active Zoom link available</p>
                )}
              </Card>

              {/* Student: View Grades */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">My Projects & Grades</h3>
                <div className="space-y-4">
                  {projects
                    .filter(project => project.studentEmail === userData?.email)
                    .map((project) => (
                      <div key={project.id} className="border p-4 rounded-lg">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.description}</p>
                        <p className="mt-2 font-medium">
                          Grade: {project.grade !== undefined ? project.grade : 'Pending'}
                        </p>
                      </div>
                    ))
                  }
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
