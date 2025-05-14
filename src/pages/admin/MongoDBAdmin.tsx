
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { MongoDBStatus } from '@/components/mongodb/MongoDBStatus';

const MongoDBAdmin: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full">
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">MongoDB Administration</h1>
      </div>

      <div className="grid gap-6 max-w-3xl mx-auto">
        <MongoDBStatus />
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-700">
          <h3 className="font-medium mb-2">Using MongoDB in this application</h3>
          <p className="mb-2">
            This application uses a MongoDB-compatible interface with localStorage for demonstration purposes. 
            In a production environment, you would connect to a real MongoDB database through a secure backend.
          </p>
          <p>
            Set your MongoDB URI using the VITE_MONGODB_URI environment variable or update it in the configuration above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MongoDBAdmin;
