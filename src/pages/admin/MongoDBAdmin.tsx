
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
            Your MongoDB connection string has been saved. In a production environment, you should secure this connection
            through a backend server rather than exposing it in the frontend.
          </p>
          <p>
            The current implementation uses localStorage to simulate MongoDB operations for demonstration purposes.
            In a real application, you would make API calls to a secure backend that connects to MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MongoDBAdmin;
