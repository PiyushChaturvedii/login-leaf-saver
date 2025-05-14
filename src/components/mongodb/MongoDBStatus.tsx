
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Database, Check, AlertCircle } from 'lucide-react';
import { mongoConfig } from '@/config/mongodb';
import { useDatabaseConnection } from '@/services/DatabaseService';

export const MongoDBStatus: React.FC = () => {
  const [mongoUri, setMongoUri] = useState(mongoConfig.uri);
  const [apiUrl, setApiUrl] = useState(mongoConfig.apiUrl);
  const [showUri, setShowUri] = useState(false);
  
  // Use our hook to check connection status
  const { isConnected, isLoading, error } = useDatabaseConnection({
    apiUrl: mongoConfig.apiUrl
  });

  const handleSaveConfig = () => {
    // In a real app, this would update env variables or call an API
    // For now, we'll just store in localStorage for demo purposes
    localStorage.setItem('mongo_uri', mongoUri);
    localStorage.setItem('api_url', apiUrl);
    toast.success("MongoDB configuration updated!");
    
    // Force page reload to apply new settings
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-600" />
            <CardTitle>MongoDB Configuration</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {isLoading ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <CardDescription>
          Configure your MongoDB connection settings
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm mb-4">
            Connection Error: {error.message}
          </div>
        )}

        {isConnected && !error && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm mb-4 flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Successfully connected to MongoDB cluster: {mongoUri.split('@')[1]?.split('/')[0] || 'MongoDB'}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="mongo-uri">MongoDB URI</Label>
          <div className="flex">
            <Input
              id="mongo-uri"
              type={showUri ? 'text' : 'password'}
              value={mongoUri}
              onChange={(e) => setMongoUri(e.target.value)}
              placeholder="mongodb+srv://username:password@cluster.mongodb.net/dbname"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => setShowUri(!showUri)} 
              className="ml-2"
            >
              {showUri ? 'Hide' : 'Show'}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Your MongoDB connection string. In production, this should be set as an environment variable.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-url">API URL</Label>
          <Input
            id="api-url"
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.yourbackend.com"
          />
          <p className="text-sm text-gray-500">
            The URL of your backend API that connects to MongoDB
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-slate-50 p-4">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Status:</span> {isConnected ? 'Connected to MongoDB' : 'Not connected'}
        </div>
        <Button onClick={handleSaveConfig}>Save Configuration</Button>
      </CardFooter>
    </Card>
  );
};
