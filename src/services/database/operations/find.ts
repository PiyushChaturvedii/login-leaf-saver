
import { mongoConfig } from '@/config/mongodb';

/**
 * Find documents in a collection with query
 */
export const find = async (collection: string, query: Record<string, any> = {}): Promise<any[]> => {
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
};
