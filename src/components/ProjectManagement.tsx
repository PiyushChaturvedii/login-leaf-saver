
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

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
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: {days: number, hours: number, minutes: number, seconds: number}}>({});

  useEffect(() => {
    // Calculate time remaining for each project
    const timer = setInterval(() => {
      const updatedTimeRemaining: {[key: string]: {days: number, hours: number, minutes: number, seconds: number}} = {};
      
      projects.forEach(project => {
        const now = new Date();
        const deadline = new Date(project.endDate);
        const timeLeft = deadline.getTime() - now.getTime();
        
        if (timeLeft > 0) {
          // Calculate days, hours, minutes, and seconds
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          
          updatedTimeRemaining[project.id] = { days, hours, minutes, seconds };
        } else {
          updatedTimeRemaining[project.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
      
      setTimeRemaining(updatedTimeRemaining);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [projects]);

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userRole === 'admin' || userRole === 'instructor') {
      if (!startDate || !endDate || !newProjectTitle) {
        toast.error("Please fill all the required fields!");
        return;
      }

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
      if (project && deployLink) {
        const updatedProjects = projects.map(p => 
          p.id === project.id 
            ? { ...p, deployLink, studentEmail: userEmail }
            : p
        );
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        setDeployLink('');
        toast.success('Project link submitted successfully!');
      } else {
        toast.error("Please provide a deployment link!");
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

  const handleEditProject = (projectId: string, field: string, value: string) => {
    if (userRole !== 'admin' && userRole !== 'instructor') return;

    const updatedProjects = projects.map(project => 
      project.id === projectId ? { ...project, [field]: value } : project
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    toast.success('Project updated successfully!');
  };

  const handleDeleteProject = (projectId: string) => {
    if (userRole !== 'admin') return;

    const updatedProjects = projects.filter(project => project.id !== projectId);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    toast.success('Project deleted successfully!');
  };

  const renderTimeRemaining = (projectId: string) => {
    const time = timeRemaining[projectId];
    if (!time) return null;

    return (
      <div className="flex items-center mt-2 space-x-1 text-xs">
        <Clock className="w-3 h-3 text-indigo-500" />
        <span className="font-mono">
          {time.days > 0 && <span className="text-indigo-600">{time.days}d </span>}
          <span className="text-purple-600">{String(time.hours).padStart(2, '0')}:</span>
          <span className="text-blue-600">{String(time.minutes).padStart(2, '0')}:</span>
          <span className="text-pink-600">{String(time.seconds).padStart(2, '0')}</span>
        </span>
      </div>
    );
  };

  // Function to check if a project is past due date
  const isPastDue = (endDate: string) => {
    return new Date(endDate) < new Date();
  };
  
  // Function to calculate and format project status
  const getProjectStatus = (project: Project) => {
    const now = new Date();
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    
    if (now < startDate) {
      return <span className="text-blue-600 font-medium">Upcoming</span>;
    } else if (now > endDate) {
      return project.deployLink 
        ? <span className="text-green-600 font-medium">Completed</span>
        : <span className="text-red-600 font-medium flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" /> Overdue
          </span>;
    } else {
      return project.deployLink 
        ? <span className="text-green-600 font-medium">Completed</span>
        : <span className="text-amber-600 font-medium">In Progress</span>;
    }
  };

  return (
    <div className="space-y-6">
      {(userRole === 'admin' || userRole === 'instructor') ? (
        <>
          <Card className="p-6 bg-white shadow-lg rounded-xl border-indigo-100 animate-fade-in">
            <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Create New Project</h3>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <Input
                placeholder="Project Title"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
                className="border-indigo-100 focus:border-indigo-300"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-indigo-500" /> Start Date
                  </label>
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="border-indigo-100 focus:border-indigo-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-purple-500" /> Due Date
                  </label>
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="border-indigo-100 focus:border-indigo-300"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all">
                Create Project
              </Button>
            </form>
          </Card>

          <Card className="p-6 bg-white shadow-lg rounded-xl border-indigo-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Project Submissions</h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-indigo-100 p-4 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-white to-indigo-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        {userRole === 'admin' ? (
                          <Input 
                            value={project.title}
                            onChange={(e) => handleEditProject(project.id, 'title', e.target.value)}
                            className="font-medium border-transparent hover:border-indigo-100 focus:border-indigo-300 bg-transparent"
                          />
                        ) : (
                          <h4 className="font-medium">{project.title}</h4>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-indigo-500" /> 
                            Start: 
                            {userRole === 'admin' ? (
                              <Input 
                                type="date"
                                value={project.startDate}
                                onChange={(e) => handleEditProject(project.id, 'startDate', e.target.value)}
                                className="border-transparent hover:border-indigo-100 focus:border-indigo-300 bg-transparent w-32 ml-1 px-1"
                              />
                            ) : (
                              <span className="ml-1">{new Date(project.startDate).toLocaleDateString()}</span>
                            )}
                          </span>
                          
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-purple-500" /> 
                            Due: 
                            {userRole === 'admin' ? (
                              <Input 
                                type="date"
                                value={project.endDate}
                                onChange={(e) => handleEditProject(project.id, 'endDate', e.target.value)}
                                className="border-transparent hover:border-indigo-100 focus:border-indigo-300 bg-transparent w-32 ml-1 px-1"
                              />
                            ) : (
                              <span className="ml-1">{new Date(project.endDate).toLocaleDateString()}</span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-1">
                        {getProjectStatus(project)}
                        {!project.deployLink && !isPastDue(project.endDate) && renderTimeRemaining(project.id)}
                      </div>
                    </div>
                    
                    {userRole === 'admin' && (
                      <Button 
                        variant="outline" 
                        className="text-red-500 h-8 hover:bg-red-50 hover:text-red-600 border-red-200"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>

                  {project.deployLink ? (
                    <>
                      <p className="text-sm text-gray-600 mt-3">
                        Submitted by: {project.studentEmail}
                      </p>
                      <a
                        href={project.deployLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-1 inline-block"
                      >
                        View Deployment
                      </a>
                      <div className="mt-2">
                        <div className="flex items-center">
                          <label className="text-sm text-gray-600 mr-2">Grade (0-100):</label>
                          <Input
                            type="number"
                            placeholder="Grade"
                            min="0"
                            max="100"
                            defaultValue={project.grade}
                            onChange={(e) => handleGradeSubmit(project.id, Number(e.target.value))}
                            className="w-24 border-indigo-100"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600 mt-2 italic">Waiting for submission...</p>
                  )}
                </div>
              ))}
              
              {projects.length === 0 && (
                <div className="text-center py-8 text-gray-500 italic">
                  No projects created yet. Create your first project above.
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <>
          <Card className="p-6 bg-white shadow-lg rounded-xl border-indigo-100 animate-fade-in">
            <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Submit Project</h3>
            {projects
              .filter(p => !p.deployLink && p.studentEmail === undefined)
              .map((project) => (
                <div key={project.id} className="space-y-4 border border-indigo-100 p-4 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-white to-indigo-50">
                  <h4 className="font-medium">{project.title}</h4>
                  
                  <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-indigo-500" />
                      <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-purple-500" />
                      <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-50 px-2 py-1 rounded text-blue-700 text-sm font-medium">
                      {getProjectStatus(project)}
                    </div>
                    {!isPastDue(project.endDate) && (
                      <div className="bg-indigo-50 px-2 py-1 rounded font-mono text-indigo-700 text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {renderTimeRemaining(project.id)}
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleProjectSubmit}>
                    <Input
                      type="url"
                      placeholder="GitHub Deploy Link"
                      value={deployLink}
                      onChange={(e) => setDeployLink(e.target.value)}
                      required
                      className="border-indigo-100 focus:border-indigo-300 mb-2"
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      disabled={isPastDue(project.endDate)}
                    >
                      Submit Project
                    </Button>
                    {isPastDue(project.endDate) && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Due date has passed. Contact your instructor.
                      </p>
                    )}
                  </form>
                </div>
              ))}
              
            {projects.filter(p => !p.deployLink && p.studentEmail === undefined).length === 0 && (
              <div className="text-center py-8 text-gray-500 italic">
                No projects available for submission at the moment.
              </div>
            )}
          </Card>

          <Card className="p-6 bg-white shadow-lg rounded-xl border-indigo-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">My Submissions</h3>
            <div className="space-y-4">
              {projects
                .filter(p => p.studentEmail === userEmail)
                .map((project) => (
                  <div key={project.id} className="border border-indigo-100 p-4 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-white to-indigo-50">
                    <h4 className="font-medium">{project.title}</h4>
                    
                    <div className="text-sm text-gray-600 grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-indigo-500" />
                        <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-purple-500" />
                        <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="bg-green-50 px-2 py-1 rounded text-green-700 text-sm font-medium inline-block">
                        Submitted
                      </div>
                    </div>
                    
                    <a
                      href={project.deployLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 inline-block"
                    >
                      View Deployment
                    </a>
                    
                    <div className="mt-2 flex items-center">
                      <span className="text-gray-600 mr-2">Grade:</span>
                      {project.grade !== undefined ? (
                        <div className={`font-bold ${
                          project.grade >= 80 ? 'text-green-600' : 
                          project.grade >= 60 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {project.grade}/100
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
                
              {projects.filter(p => p.studentEmail === userEmail).length === 0 && (
                <div className="text-center py-8 text-gray-500 italic">
                  You haven't submitted any projects yet.
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
