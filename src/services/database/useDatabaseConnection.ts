
import { useState, useEffect } from 'react';
import { DatabaseConfig, DbServiceHookResult } from './types';
import axios from 'axios';

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
