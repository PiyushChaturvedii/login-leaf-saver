
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Update local storage when loggedInUser changes
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
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={loggedInUser ? <Navigate to="/user-dashboard" /> : <Index />} />
        <Route path="/dashboard" element={loggedInUser ? <Dashboard onLogout={handleLogout} user={loggedInUser} /> : <Navigate to="/" />} />
        <Route path="/profile-setup" element={loggedInUser ? <ProfileSetup /> : <Navigate to="/" />} />
        <Route path="/user-dashboard" element={loggedInUser ? <UserDashboard /> : <Navigate to="/" />} />

        {/* Routes for all authenticated users */}
        <Route path="/attendance" element={
          loggedInUser ? (
            <AttendanceSystem 
              isInstructor={loggedInUser.role === "instructor" || loggedInUser.role === "admin"} 
              userEmail={loggedInUser.email} 
            />
          ) : <Navigate to="/" />
        } />

        <Route path="/course-materials" element={
          loggedInUser ? (
            <ProjectManagement 
              userRole={loggedInUser.role === "accounting" ? "admin" : loggedInUser.role}
              userEmail={loggedInUser.email}
            />
          ) : <Navigate to="/" />
        } />

        {/* Routes for students */}
        {loggedInUser && loggedInUser.role === "student" && (
          <Route path="/student-profile" element={<StudentProfile userData={loggedInUser} />} />
        )}

        {/* Routes for students and admin */}
        {loggedInUser && (loggedInUser.role === "student" || loggedInUser.role === "admin" || loggedInUser.role === "accounting") && (
          <Route path="/fees" element={<AdminFees />} />
        )}

        {/* Routes for admin and accounting */}
        {loggedInUser && (loggedInUser.role === "admin" || loggedInUser.role === "accounting") && (
          <Route path="/user-management" element={<SystemReport />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
