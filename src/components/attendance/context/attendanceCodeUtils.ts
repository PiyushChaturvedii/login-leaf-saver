
import { AttendanceCode } from '../types';
import { removeAttendanceCode, loadAttendanceCode } from './attendanceUtils';

/**
 * Handles the attendance code timer and updates the timeLeft state
 */
export const setupCodeTimer = (
  attendanceCode: AttendanceCode | null,
  setTimeLeft: React.Dispatch<React.SetStateAction<{minutes: number, seconds: number} | null>>,
  setAttendanceCode: React.Dispatch<React.SetStateAction<AttendanceCode | null>>
) => {
  if (attendanceCode && Date.now() < attendanceCode.expiresAt) {
    const timer = setInterval(() => {
      const now = Date.now();
      if (now < attendanceCode.expiresAt) {
        const remaining = attendanceCode.expiresAt - now;
        const minutes = Math.floor(remaining / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeLeft({ minutes, seconds });
      } else {
        setTimeLeft(null);
        setAttendanceCode(null);
        removeAttendanceCode();
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }
  return undefined;
};

/**
 * Loads and validates the attendance code from localStorage
 */
export const loadAndValidateAttendanceCode = async (
  setAttendanceCode: React.Dispatch<React.SetStateAction<AttendanceCode | null>>
) => {
  try {
    // Load attendance code from localStorage
    const parsedCode = await loadAttendanceCode();
    if (parsedCode && Date.now() < parsedCode.expiresAt) {
      setAttendanceCode(parsedCode);
    } else if (parsedCode) {
      removeAttendanceCode();
    }
  } catch (error) {
    console.error("Error loading attendance code:", error);
    // In case of error, ensure we don't have invalid data
    removeAttendanceCode();
  }
};
