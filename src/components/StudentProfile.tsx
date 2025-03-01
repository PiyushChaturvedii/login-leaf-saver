
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { User, Camera, Book, Building, Github, Linkedin, Phone, BookOpen, Calendar, ChartBar, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AttendanceSystem } from "./AttendanceSystem";

interface ProfileProps {
  userData: {
    name: string;
    email: string;
    photo?: string;
    college?: string;
    course?: string;
    github?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

interface Course {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
  description: string;
}

export const StudentProfile = ({ userData }: ProfileProps) => {
  const [profilePhoto, setProfilePhoto] = useState<string>(userData.photo || '');
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  
  const fees = JSON.parse(localStorage.getItem('users') || '[]')
    .find((user: any) => user.email === userData.email)?.fees;

  useEffect(() => {
    // Load courses from localStorage or set demo courses if none exist
    const storedCourses = localStorage.getItem(`courses-${userData.email}`);
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      // Demo courses
      const demoCourses: Course[] = [
        {
          id: "course-1",
          name: "Introduction to React",
          instructor: "Jane Smith",
          progress: 75,
          completed: false,
          lastAccessed: new Date(Date.now() - 86400000).toISOString(),
          description: "Learn the fundamentals of React including components, props, state, and hooks."
        },
        {
          id: "course-2",
          name: "Advanced JavaScript",
          instructor: "John Doe",
          progress: 45,
          completed: false,
          lastAccessed: new Date(Date.now() - 172800000).toISOString(),
          description: "Master advanced JavaScript concepts including closures, promises, and async/await."
        },
        {
          id: "course-3",
          name: "UI/UX Fundamentals",
          instructor: "Alice Johnson",
          progress: 100,
          completed: true,
          lastAccessed: new Date(Date.now() - 259200000).toISOString(),
          description: "Learn the principles of good UI/UX design and how to implement them in your projects."
        }
      ];
      setCourses(demoCourses);
      localStorage.setItem(`courses-${userData.email}`, JSON.stringify(demoCourses));
    }
  }, [userData.email]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((user: any) =>
          user.email === userData.email ? { ...user, photo: base64String } : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify({ ...userData, photo: base64String }));
        toast.success("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const getOverallProgress = () => {
    if (courses.length === 0) return 0;
    
    const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0);
    return Math.round(totalProgress / courses.length);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-xl rounded-xl border-indigo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full -mt-20 -mr-20 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 rounded-full -mb-16 -ml-16 opacity-30"></div>
        
        <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <ChartBar className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center md:space-x-6">
              <div className="relative group mb-4 md:mb-0">
                {profilePhoto || userData.photo ? (
                  <img
                    src={profilePhoto || userData.photo}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-indigo-50 shadow-md">
                    <User className="w-14 h-14 text-indigo-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer border border-indigo-100 transform transition-transform duration-300 hover:scale-110">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <Camera className="w-4 h-4 text-indigo-600" />
                </label>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {userData.name}
                </h4>
                <p className="text-gray-600 mt-1">{userData.email}</p>
                
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                    Student
                  </Badge>
                  {courses.length > 0 && (
                    <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                      {courses.length} Course{courses.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                    {getOverallProgress()}% Progress
                  </Badge>
                </div>
              </div>
            </div>
  
            <Separator className="my-6" />
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 bg-indigo-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
                <Building className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <label className="text-sm font-medium text-gray-600">College</label>
                  <p className="mt-1 font-medium">{userData.college || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
                <Book className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Course</label>
                  <p className="mt-1 font-medium">{userData.course || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
                <Github className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="overflow-hidden">
                  <label className="text-sm font-medium text-gray-600">GitHub</label>
                  {userData.github ? (
                    <a
                      href={userData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:text-blue-800 hover:underline block font-medium truncate"
                    >
                      {userData.github.replace('https://github.com/', '@')}
                    </a>
                  ) : (
                    <p className="mt-1 font-medium">Not specified</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-pink-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
                <Linkedin className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <div className="overflow-hidden">
                  <label className="text-sm font-medium text-gray-600">LinkedIn</label>
                  {userData.linkedin ? (
                    <a
                      href={userData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-pink-600 hover:text-pink-800 hover:underline block font-medium truncate"
                    >
                      {userData.linkedin.replace('https://www.linkedin.com/in/', '@')}
                    </a>
                  ) : (
                    <p className="mt-1 font-medium">Not specified</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md">
                <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                  <p className="mt-1 font-medium">{userData.whatsapp || 'Not specified'}</p>
                </div>
              </div>
            </div>
  
            {fees && (
              <div className="mt-8">
                <h4 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Fee Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-inner">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <label className="text-sm font-medium text-gray-600">Base Amount</label>
                    <p className="mt-1 text-xl font-bold text-indigo-700">₹{fees.amount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <label className="text-sm font-medium text-gray-600">GST (18%)</label>
                    <p className="mt-1 text-xl font-bold text-purple-700">₹{fees.gstAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <label className="text-sm font-medium text-gray-600">Total Amount</label>
                    <p className="mt-1 text-xl font-bold text-blue-700">₹{fees.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <label className="text-sm font-medium text-gray-600">Amount Paid</label>
                    <p className="mt-1 text-xl font-bold text-green-700">₹{fees.paid.toLocaleString()}</p>
                  </div>
                  {fees.emiPlan && (
                    <>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <label className="text-sm font-medium text-gray-600">EMI Amount</label>
                        <p className="mt-1 text-xl font-bold text-pink-700">₹{fees.emiPlan.emiAmount.toLocaleString()}/month</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <label className="text-sm font-medium text-gray-600">EMIs Status</label>
                        <p className="mt-1 text-xl font-bold text-indigo-700">{fees.emiPlan.paidEmis} paid of {fees.emiPlan.totalEmis} total</p>
                      </div>
                    </>
                  )}
                  {fees.lastPaid && (
                    <div className="col-span-2 bg-white p-3 rounded-lg shadow-sm">
                      <label className="text-sm font-medium text-gray-600">Last Payment Date</label>
                      <p className="mt-1 text-xl font-bold text-gray-700">{new Date(fees.lastPaid).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-6 animate-fade-in">
            <h4 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Enrolled Courses
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden transform transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription>Instructor: {course.instructor}</CardDescription>
                      </div>
                      {course.completed ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> In Progress
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    >
                      Continue Learning
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {courses.length === 0 && (
                <div className="col-span-2 p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-600 mb-1">No Courses Enrolled</h3>
                  <p className="text-gray-500 text-sm mb-4">You haven't enrolled in any courses yet.</p>
                  <Button>Browse Courses</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="animate-fade-in">
            <AttendanceSystem isInstructor={false} userEmail={userData.email} />
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6 animate-fade-in">
            <h4 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Overall Progress
            </h4>
            
            <Card className="p-6 border-indigo-100">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <h3 className="text-lg font-medium">Course Completion</h3>
                    <span className="text-2xl font-bold text-indigo-600">{getOverallProgress()}%</span>
                  </div>
                  <Progress value={getOverallProgress()} className="h-3 bg-indigo-100" />
                  <p className="text-sm text-gray-500">
                    {courses.filter(c => c.completed).length} of {courses.length} courses completed
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Course Progress Breakdown</h3>
                  
                  {courses.length > 0 ? (
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm truncate max-w-[70%]">{course.name}</span>
                            <span className="text-sm text-gray-600">{course.progress}%</span>
                          </div>
                          <div className="flex items-center">
                            <Progress value={course.progress} className="h-2 flex-grow" />
                            {course.progress >= 90 ? (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                            ) : course.progress <= 25 ? (
                              <AlertCircle className="w-4 h-4 text-red-500 ml-2 flex-shrink-0" />
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 italic">
                      No course data available
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  {courses.length > 0 ? (
                    <div className="space-y-3">
                      {courses
                        .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
                        .slice(0, 3)
                        .map((course) => (
                          <div key={course.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                            <div className="bg-indigo-100 rounded-full p-2 mr-3">
                              <BookOpen className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{course.name}</p>
                              <p className="text-xs text-gray-500">
                                Last accessed on {new Date(course.lastAccessed).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 italic">
                      No activity data available
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
