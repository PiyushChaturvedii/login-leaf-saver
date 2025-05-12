
import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import UserDashboard from './pages/dashboard/UserDashboard';
import { AttendanceSystem } from './components/AttendanceSystem';
import { StudentProfile } from './components/StudentProfile';
import { AdminFees } from './components/AdminFees';
import { SystemReport } from './components/SystemReport';
import { ProjectManagement } from './components/ProjectManagement';
import { Toaster } from "@/components/ui/sonner";
import { Dashboard as DashboardComponent } from './components/Dashboard';
import { SalesCRMDashboard } from './components/crm/SalesCRMDashboard';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [loggedInUser]);

  const handleLogin = (user: any) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <LanguageProvider>
      <Router>
        <div className="relative">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={loggedInUser ? (
              loggedInUser.role === 'sales' ? 
                <Navigate to="/crm-dashboard" /> : 
                <Navigate to="/user-dashboard" />
            ) : <Index />} />
            
            <Route path="/dashboard" element={loggedInUser ? <DashboardComponent onLogout={handleLogout} user={loggedInUser} /> : <Navigate to="/" />} />
            <Route path="/profile-setup" element={loggedInUser ? <ProfileSetup /> : <Navigate to="/" />} />
            <Route path="/user-dashboard" element={
              loggedInUser ? (
                loggedInUser.role === 'sales' ? 
                  <Navigate to="/crm-dashboard" /> : 
                  <UserDashboard />
              ) : <Navigate to="/" />
            } />

            {/* CRM Dashboard Route for Sales Role */}
            <Route path="/crm-dashboard" element={
              loggedInUser && loggedInUser.role === 'sales' ? (
                <SalesCRMDashboard 
                  user={loggedInUser} 
                  onLogout={handleLogout} 
                />
              ) : <Navigate to="/" />
            } />

            <Route path="/attendance" element={
              loggedInUser && loggedInUser.role !== 'sales' ? (
                <AttendanceSystem 
                  isInstructor={loggedInUser.role === "instructor" || loggedInUser.role === "admin"} 
                  userEmail={loggedInUser.email} 
                />
              ) : <Navigate to="/" />
            } />

            <Route path="/course-materials" element={
              loggedInUser && loggedInUser.role !== 'sales' ? (
                <ProjectManagement 
                  userRole={loggedInUser.role === "accounting" ? "admin" : loggedInUser.role}
                  userEmail={loggedInUser.email}
                />
              ) : <Navigate to="/" />
            } />

            {loggedInUser && loggedInUser.role === "student" && (
              <Route path="/student-profile" element={<StudentProfile userData={loggedInUser} />} />
            )}

            {loggedInUser && (loggedInUser.role === "student" || loggedInUser.role === "admin" || loggedInUser.role === "accounting") && (
              <Route path="/fees" element={<AdminFees />} />
            )}

            {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "accounting") && (
              <Route path="/user-management" element={<SystemReport />} />
            )}
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
