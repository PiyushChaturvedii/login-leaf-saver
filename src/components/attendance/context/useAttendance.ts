
import { useContext } from 'react';
import { AttendanceContext } from './AttendanceProvider';
import { AttendanceContextType } from './types';

export const useAttendance = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
