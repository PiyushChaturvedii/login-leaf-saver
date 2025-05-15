
import { mongoConfig } from '@/config/mongodb';

/**
 * Update a document by ID
 */
export const update = async (collection: string, id: string, data: any): Promise<any> => {
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
};
