
import { mongoConfig } from '@/config/mongodb';

/**
 * Create a document in a collection
 */
export const create = async (collection: string, data: any): Promise<any> => {
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
};
