
import { operations } from './operations';
export { useDatabaseConnection } from './useDatabaseConnection';
export type { DatabaseConfig, DbServiceHookResult } from './types';

// Export the DbService object with all operations
export const DbService = {
  create: operations.create,
  find: operations.find,
  findById: operations.findById,
  update: operations.update,
  delete: operations.delete
};
