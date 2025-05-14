
import { useEffect, useState } from 'react';

// This is a frontend service that would connect to a MongoDB backend
// In a real application, direct MongoDB connection should be done on the backend
export interface DatabaseConfig {
  apiUrl: string;
  apiKey?: string;
}

export interface DbServiceHookResult {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
}

// For frontend use only - actual MongoDB operations would happen on a server
export const useDatabaseConnection = (config: DatabaseConfig): DbServiceHookResult => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const connectToDb = async () => {
      try {
        setIsLoading(true);
        // Simulate API connection to MongoDB backend
        const response = await fetch(`${config.apiUrl}/api/status`, {
          headers: {
            'Authorization': `Bearer ${config.apiKey || ''}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Database connection failed');
        }
        
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error('Database connection error:', err);
        setError(err instanceof Error ? err : new Error('Unknown database error'));
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    // We're just simulating the connection in the frontend
    // In reality, we'd call an API endpoint that connects to MongoDB
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 1000);

    // connectToDb(); // Uncomment this when you have a real API endpoint
  }, [config.apiUrl, config.apiKey]);

  return { isConnected, isLoading, error };
};

// Mock service for demonstration purposes
// In a real app, these operations would be handled by API calls to a backend
export const DbService = {
  create: async (collection: string, data: any): Promise<any> => {
    // Store in localStorage for demonstration purposes
    const existingData = localStorage.getItem(collection) || '[]';
    const parsedData = JSON.parse(existingData);
    const newItem = { ...data, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    parsedData.push(newItem);
    localStorage.setItem(collection, JSON.stringify(parsedData));
    return newItem;
  },
  
  find: async (collection: string, query: Record<string, any> = {}): Promise<any[]> => {
    const existingData = localStorage.getItem(collection) || '[]';
    const parsedData = JSON.parse(existingData);
    
    // Simple filtering
    return parsedData.filter((item: any) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  },
  
  findById: async (collection: string, id: string): Promise<any> => {
    const existingData = localStorage.getItem(collection) || '[]';
    const parsedData = JSON.parse(existingData);
    return parsedData.find((item: any) => item._id === id);
  },
  
  update: async (collection: string, id: string, data: any): Promise<any> => {
    const existingData = localStorage.getItem(collection) || '[]';
    const parsedData = JSON.parse(existingData);
    const index = parsedData.findIndex((item: any) => item._id === id);
    
    if (index !== -1) {
      parsedData[index] = { ...parsedData[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(collection, JSON.stringify(parsedData));
      return parsedData[index];
    }
    
    throw new Error('Document not found');
  },
  
  delete: async (collection: string, id: string): Promise<boolean> => {
    const existingData = localStorage.getItem(collection) || '[]';
    const parsedData = JSON.parse(existingData);
    const filteredData = parsedData.filter((item: any) => item._id !== id);
    
    if (filteredData.length !== parsedData.length) {
      localStorage.setItem(collection, JSON.stringify(filteredData));
      return true;
    }
    
    return false;
  }
};
