
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SalesDashboard } from '@/components/sales/SalesDashboard';
import { StudentRecords } from '@/components/sales/StudentRecords';
import { SalaryManagement } from '@/components/sales/SalaryManagement';
import { SalesProfile } from '@/components/sales/SalesProfile';
import { MessagesBoard } from '@/components/sales/MessagesBoard';
import { useNavigate } from 'react-router-dom';

interface SalesRoutesProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

const SalesRoutes: React.FC<SalesRoutesProps> = ({ user, onLogout }) => {
  // Only allow access if user role is sales
  if (user.role !== 'sales') {
    return <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="/" element={<SalesDashboard userData={user} onLogout={onLogout} />} />
      <Route path="/records" element={<StudentRecords />} />
      <Route path="/salary" element={<SalaryManagement />} />
      <Route path="/profile" element={<SalesProfile />} />
      <Route path="/messages" element={<MessagesBoard />} />
      <Route path="*" element={<Navigate to="/sales" />} />
    </Routes>
  );
};

export default SalesRoutes;
