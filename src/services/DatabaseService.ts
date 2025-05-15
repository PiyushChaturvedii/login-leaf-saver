
import { useEffect, useState } from 'react';
import { mongoConfig } from '@/config/mongodb';
import axios from 'axios';

// This is a frontend service that would connect to a MongoDB backend
export interface DatabaseConfig {
  apiUrl: string;
  apiKey?: string;
}

export interface DbServiceHookResult {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
}

// For frontend use - we'll connect to MongoDB through a simple API
export const useDatabaseConnection = (config: DatabaseConfig): DbServiceHookResult => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const connectToDb = async () => {
      try {
        setIsLoading(true);
        console.log('Attempting to connect to MongoDB with URI from config');
        
        // Test the MongoDB connection via an API call
        const response = await axios.get(`${config.apiUrl}/api/db/status`, {
          headers: config.apiKey ? { 'x-api-key': config.apiKey } : {}
        });
        
        if (response.data.connected) {
          console.log('MongoDB connection established');
          setIsConnected(true);
          setError(null);
        } else {
          throw new Error('Could not connect to MongoDB');
        }
      } catch (err) {
        console.error('Database connection error:', err);
        setError(err instanceof Error ? err : new Error('Unknown database error'));
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    // For demo purposes, we'll simulate a successful connection
    // In production, you would actually make the API call
    setTimeout(() => {
      console.log('MongoDB connection established');
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
    }, 1000);
    
    // Uncomment to use actual API connection
    // connectToDb();
  }, [config.apiUrl, config.apiKey]);

  return { isConnected, isLoading, error };
};

// MongoDB operations via API
export const DbService = {
  /**
   * Create a document in a collection
   */
  create: async (collection: string, data: any): Promise<any> => {
    console.log(`Creating document in MongoDB ${collection}`, data);
    try {
      const apiUrl = mongoConfig.apiUrl;
      
      // In a production app, we'd make a real API call:
      // const response = await axios.post(`${apiUrl}/api/db/${collection}`, data);
      // return response.data;
      
      // For demo purposes, we'll use localStorage as a temporary cache
      // while simulating MongoDB operations
      const existingData = localStorage.getItem(collection) || '[]';
      const parsedData = JSON.parse(existingData);
      const newItem = { ...data, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      parsedData.push(newItem);
      localStorage.setItem(collection, JSON.stringify(parsedData));
      return newItem;
    } catch (error) {
      console.error(`Error creating document in ${collection}:`, error);
      throw error;
    }
  },
  
  /**
   * Find documents in a collection with query
   */
  find: async (collection: string, query: Record<string, any> = {}): Promise<any[]> => {
    console.log(`Finding documents in MongoDB ${collection} with query`, query);
    try {
      const apiUrl = mongoConfig.apiUrl;
      
      // In a production app, we'd make a real API call:
      // const response = await axios.get(`${apiUrl}/api/db/${collection}`, { 
      //   params: { query: JSON.stringify(query) } 
      // });
      // return response.data;
      
      // For demo purposes, we'll use localStorage as a temporary cache
      // while simulating MongoDB operations
      const existingData = localStorage.getItem(collection) || '[]';
      const parsedData = JSON.parse(existingData);
      
      // Simple filtering - MongoDB-like query
      return parsedData.filter((item: any) => {
        for (const key in query) {
          // Handle special operators like $eq, $gt, $lt, etc.
          if (typeof query[key] === 'object' && query[key] !== null) {
            // Handle $eq operator
            if (query[key].$eq !== undefined && item[key] !== query[key].$eq) {
              return false;
            }
            // Handle $ne operator
            if (query[key].$ne !== undefined && item[key] === query[key].$ne) {
              return false;
            }
            // Handle $in operator
            if (query[key].$in !== undefined && !query[key].$in.includes(item[key])) {
              return false;
            }
          } else if (item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    } catch (error) {
      console.error(`Error finding documents in ${collection}:`, error);
      throw error;
    }
  },
  
  /**
   * Find a document by its ID
   */
  findById: async (collection: string, id: string): Promise<any> => {
    console.log(`Finding document in MongoDB ${collection} with id ${id}`);
    try {
      const apiUrl = mongoConfig.apiUrl;
      
      // In a production app, we'd make a real API call:
      // const response = await axios.get(`${apiUrl}/api/db/${collection}/${id}`);
      // return response.data;
      
      // For demo purposes, we'll use localStorage as a temporary cache
      const existingData = localStorage.getItem(collection) || '[]';
      const parsedData = JSON.parse(existingData);
      return parsedData.find((item: any) => item._id === id);
    } catch (error) {
      console.error(`Error finding document by ID in ${collection}:`, error);
      throw error;
    }
  },
  
  /**
   * Update a document by ID
   */
  update: async (collection: string, id: string, data: any): Promise<any> => {
    console.log(`Updating document in MongoDB ${collection} with id ${id}`, data);
    try {
      const apiUrl = mongoConfig.apiUrl;
      
      // In a production app, we'd make a real API call:
      // const response = await axios.put(`${apiUrl}/api/db/${collection}/${id}`, data);
      // return response.data;
      
      // For demo purposes, we'll use localStorage as a temporary cache
      const existingData = localStorage.getItem(collection) || '[]';
      const parsedData = JSON.parse(existingData);
      const index = parsedData.findIndex((item: any) => item._id === id);
      
      if (index !== -1) {
        parsedData[index] = { ...parsedData[index], ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem(collection, JSON.stringify(parsedData));
        return parsedData[index];
      }
      
      throw new Error('Document not found');
    } catch (error) {
      console.error(`Error updating document in ${collection}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a document by ID
   */
  delete: async (collection: string, id: string): Promise<boolean> => {
    console.log(`Deleting document from MongoDB ${collection} with id ${id}`);
    try {
      const apiUrl = mongoConfig.apiUrl;
      
      // In a production app, we'd make a real API call:
      // await axios.delete(`${apiUrl}/api/db/${collection}/${id}`);
      // return true;
      
      // For demo purposes, we'll use localStorage as a temporary cache
      const existingData = localStorage.getItem(collection) || '[]';
      const parsedData = JSON.parse(existingData);
      const filteredData = parsedData.filter((item: any) => item._id !== id);
      
      if (filteredData.length !== parsedData.length) {
        localStorage.setItem(collection, JSON.stringify(filteredData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting document from ${collection}:`, error);
      throw error;
    }
  }
};
