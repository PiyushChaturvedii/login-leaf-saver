
import { DbService } from './database';

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student' | 'sales' | 'accounting';
  password?: string;
  profileCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export const UserService = {
  /**
   * Get all users
   */
  getAllUsers: async (): Promise<User[]> => {
    try {
      return await DbService.find('users');
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User | null> => {
    try {
      return await DbService.findById('users', id);
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Get user by email
   */
  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const users = await DbService.find('users', { email });
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      return null;
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData: User): Promise<User | null> => {
    try {
      // Check if user already exists
      const existingUsers = await DbService.find('users', { email: userData.email });
      if (existingUsers.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = await DbService.create('users', {
        ...userData,
        profileCompleted: userData.profileCompleted || false,
      });
      
      // Don't return the password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },

  /**
   * Update user
   */
  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    try {
      const updatedUser = await DbService.update('users', id, userData);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      return await DbService.delete('users', id);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      return false;
    }
  },

  /**
   * Authenticate user
   */
  authenticateUser: async (email: string, password: string): Promise<User | null> => {
    try {
      const users = await DbService.find('users', { email });
      
      if (users.length === 0) {
        return null;
      }
      
      const user = users[0];
      
      // In a real application, you'd use proper password hashing/comparison
      // This is just for demonstration purposes
      if (user.password === password) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }
};

// Initialize with some sample users if none exist
(async () => {
  const users = await DbService.find('users');
  
  if (users.length === 0) {
    // Add some sample users
    await DbService.create('users', {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      profileCompleted: true
    });
    
    await DbService.create('users', {
      name: 'Teacher User',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'instructor',
      profileCompleted: true
    });
    
    await DbService.create('users', {
      name: 'Student User',
      email: 'student@example.com',
      password: 'password123',
      role: 'student',
      profileCompleted: false
    });
    
    await DbService.create('users', {
      name: 'Sales User',
      email: 'sales@example.com',
      password: 'password123',
      role: 'sales',
      profileCompleted: true
    });
    
    await DbService.create('users', {
      name: 'Accounting User',
      email: 'accounting@example.com',
      password: 'password123',
      role: 'accounting',
      profileCompleted: true
    });

    // Add the specific student user we saw in logs for testing
    await DbService.create('users', {
      name: 'ram',
      email: 'student@aeeron.in',
      password: '12345',
      role: 'student',
      profileCompleted: false
    });
  }
})();
