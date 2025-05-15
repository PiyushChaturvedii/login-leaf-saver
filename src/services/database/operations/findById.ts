
import { mongoConfig } from '@/config/mongodb';

/**
 * Find a document by its ID
 */
export const findById = async (collection: string, id: string): Promise<any> => {
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
};
