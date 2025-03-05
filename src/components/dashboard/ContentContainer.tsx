
import React from 'react';
import { ProjectManagement } from '@/components/ProjectManagement';
import { AdminFees } from '@/components/AdminFees';
import { AdminProfile } from '@/components/AdminProfile';
import { StudentProfile } from '@/components/StudentProfile';
import { AttendanceSystem } from '@/components/AttendanceSystem';
import { SystemReport } from '@/components/SystemReport';

interface ContentContainerProps {
  activeTab: string;
  userData: {
    role: string;
    email: string;
    name: string; // Added the required name property
    photo?: string;
    college?: string;
    course?: string;
    github?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  isAnimating: boolean;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  activeTab,
  userData,
  isAnimating
}) => {
  return (
    <div className={`animate-fade-in ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
      {activeTab === 'projects' && (
        <div className="mt-6">
          <ProjectManagement userRole={userData.role as 'admin' | 'instructor' | 'student'} userEmail={userData.email} />
        </div>
      )}

      {activeTab === 'fees' && userData.role === 'admin' && (
        <div className="mt-6">
          <AdminFees />
        </div>
      )}

      {activeTab === 'users' && userData.role === 'admin' && (
        <div className="mt-6">
          <AdminProfile />
        </div>
      )}

      {activeTab === 'profile' && userData.role === 'student' && (
        <div className="mt-6">
          <StudentProfile userData={userData} />
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="mt-6">
          <AttendanceSystem 
            isInstructor={userData.role === 'instructor' || userData.role === 'admin'} 
            userEmail={userData.email}
          />
        </div>
      )}

      {activeTab === 'report' && (userData.role === 'admin' || userData.role === 'instructor') && (
        <div className="mt-6">
          <SystemReport />
        </div>
      )}
    </div>
  );
};
