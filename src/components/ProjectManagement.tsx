
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, FolderPlus, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectManagementProps {
  userRole: 'admin' | 'instructor' | 'student';
  userEmail: string;
}

export const ProjectManagement = ({ userRole, userEmail }: ProjectManagementProps) => {
  const [activeMaterials, setActiveMaterials] = useState<any[]>([]);

  useEffect(() => {
    // Get materials from localStorage or use default data
    const storedMaterials = localStorage.getItem('courseMaterials');
    if (storedMaterials) {
      setActiveMaterials(JSON.parse(storedMaterials));
    } else {
      // Default materials for demonstration
      const defaultMaterials = [
        {
          id: 1,
          title: 'Introduction to React',
          description: 'Learn the basics of React and component-based architecture.',
          date: '2023-05-10',
          uploadedBy: 'instructor@example.com',
          type: 'document',
          filename: 'react_intro.pdf'
        },
        {
          id: 2,
          title: 'Advanced JavaScript Concepts',
          description: 'Deep dive into closures, prototypes, and async patterns.',
          date: '2023-06-15',
          uploadedBy: 'instructor@example.com',
          type: 'presentation',
          filename: 'advanced_js.pptx'
        }
      ];
      setActiveMaterials(defaultMaterials);
      localStorage.setItem('courseMaterials', JSON.stringify(defaultMaterials));
    }
  }, []);

  // Material viewer implementation would go here
  const renderMaterialView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{material.title}</CardTitle>
              <CardDescription>{material.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Uploaded: {new Date(material.date).toLocaleDateString()}
                </div>
                <Button size="sm">
                  <FileText className="mr-2 h-4 w-4" /> View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Material uploader implementation would go here
  const renderMaterialUploader = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upload New Material</CardTitle>
          <CardDescription>
            Share documents, presentations, or code examples with your students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Button>
                <FolderPlus className="mr-2 h-4 w-4" />
                Select Files
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Support for PDF, PPTX, DOCX, and code files up to 50MB.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full">
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Course Materials</h1>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Materials</TabsTrigger>
          {(userRole === 'admin' || userRole === 'instructor') && (
            <TabsTrigger value="upload">Upload Materials</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="browse" className="mt-6">
          {renderMaterialView()}
        </TabsContent>
        {(userRole === 'admin' || userRole === 'instructor') && (
          <TabsContent value="upload" className="mt-6">
            {renderMaterialUploader()}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
