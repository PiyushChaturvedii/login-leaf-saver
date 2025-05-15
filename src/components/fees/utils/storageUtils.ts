
import { UserData } from '../FeesTypes';
import { DbService } from '@/services/DatabaseService';

/**
 * Get a user from MongoDB by email
 * @param email User's email address
 * @returns User data or undefined if not found
 */
export const getUserFromStorage = async (email: string): Promise<UserData | undefined> => {
  const users = await DbService.find('users', { email });
  return users.length > 0 ? users[0] : undefined;
};

/**
 * Update user data in MongoDB
 * @param email User's email to identify which record to update
 * @param updateFn Function that takes the user and returns updated user data
 * @returns Whether the update was successful
 */
export const updateUserInStorage = async (
  email: string, 
  updateFn: (user: UserData) => UserData
): Promise<boolean> => {
  const users = await DbService.find('users', { email });
  
  if (users.length === 0) return false;
  
  const user = users[0];
  const updatedUser = updateFn(user);
  
  await DbService.update('users', user._id, updatedUser);
  return true;
};

/**
 * Save users array to MongoDB
 * @param users Array of user data to save
 */
export const saveUsersToStorage = async (users: UserData[]): Promise<void> => {
  // First delete all existing users (in a real app we'd use a transaction)
  const existingUsers = await DbService.find('users');
  for (const user of existingUsers) {
    await DbService.delete('users', user._id);
  }
  
  // Then insert all new users
  for (const user of users) {
    await DbService.create('users', user);
  }
};
