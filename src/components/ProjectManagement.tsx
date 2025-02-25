
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface ProjectProps {
  userRole: 'admin' | 'instructor' | 'student';
  userEmail: string;
}

export const ProjectManagement = ({ userRole, userEmail }: ProjectProps) => {
  const [projects, setProjects] = useState<Project[]>(
    JSON.parse(localStorage.getItem('projects') || '[]')
  );
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [deployLink, setDeployLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userRole === 'admin' || userRole === 'instructor') {
      const newProject: Project = {
        id: Date.now().toString(),
        title: newProjectTitle,
        submittedAt: new Date().toISOString(),
        startDate,
        endDate,
        createdBy: userEmail,
      };
      const updatedProjects = [...projects, newProject];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      setNewProjectTitle('');
      setStartDate('');
      setEndDate('');
      toast.success('Project created successfully!');
    } else {
      const project = projects.find(p => !p.deployLink);
      if (project) {
        const updatedProjects = projects.map(p => 
          p.id === project.id 
            ? { ...p, deployLink, studentEmail: userEmail }
            : p
        );
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        setDeployLink('');
        toast.success('Project link submitted successfully!');
      }
    }
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
    <div className="space-y-6">
      {(userRole === 'admin' || userRole === 'instructor') ? (
        <>
          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Project</h3>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <Input
                placeholder="Project Title"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Project
              </Button>
            </form>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Project Submissions</h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border p-4 rounded-lg">
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-gray-600">
                    Start: {new Date(project.startDate).toLocaleDateString()} |
                    End: {new Date(project.endDate).toLocaleDateString()}
                  </p>
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
                          onChange={(e) => handleGradeSubmit(project.id, Number(e.target.value))}
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
        </>
      ) : (
        <>
          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Submit Project</h3>
            {projects
              .filter(p => !p.deployLink)
              .map((project) => (
                <div key={project.id} className="space-y-4">
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-gray-600">
                    Due Date: {new Date(project.endDate).toLocaleDateString()}
                  </p>
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

          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">My Submissions</h3>
            <div className="space-y-4">
              {projects
                .filter(p => p.studentEmail === userEmail)
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
  );
};
