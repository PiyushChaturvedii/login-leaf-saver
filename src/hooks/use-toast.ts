
import { toast as sonnerToast } from "sonner";

// Re-export the sonner toast function
export const toast = sonnerToast;

// Create a hook that returns the toast function for compatibility with existing code
export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};
