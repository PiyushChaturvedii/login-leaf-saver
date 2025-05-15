
import { mongoConfig } from '@/config/mongodb';

/**
 * Delete a document by ID
 */
export const deleteDoc = async (collection: string, id: string): Promise<boolean> => {
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
};
