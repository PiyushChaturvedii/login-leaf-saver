
import { UserData } from '../FeesTypes';

/**
 * Get a user from localStorage by email
 * @param email User's email address
 * @returns User data or undefined if not found
 */
export const getUserFromStorage = (email: string): UserData | undefined => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find((u: UserData) => u.email === email);
};

/**
 * Update user data in localStorage
 * @param email User's email to identify which record to update
 * @param updateFn Function that takes the user and returns updated user data
 * @returns Whether the update was successful
 */
export const updateUserInStorage = (
  email: string, 
  updateFn: (user: UserData) => UserData
): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u: UserData) => u.email === email);
  
  if (userIndex === -1) return false;
  
  const updatedUsers = [
    ...users.slice(0, userIndex),
    updateFn(users[userIndex]),
    ...users.slice(userIndex + 1)
  ];
  
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  return true;
};

/**
 * Save users array to localStorage
 * @param users Array of user data to save
 */
export const saveUsersToStorage = (users: UserData[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};
