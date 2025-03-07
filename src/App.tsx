
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AttendanceSystem } from './components/AttendanceSystem';
import { StudentProfile } from './components/StudentProfile';
import { AdminFees } from './components/AdminFees';
import { SystemReport } from './components/SystemReport';
import { ProjectManagement } from './components/ProjectManagement';

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
      <Routes>
        <Route path="/login" element={loggedInUser ? <Navigate to="/dashboard" /> : <LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={loggedInUser ? <Navigate to="/dashboard" /> : <RegisterForm onRegister={handleLogin} />} />
        <Route path="/dashboard" element={loggedInUser ? <Dashboard onLogout={handleLogout} user={loggedInUser} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Routes for all authenticated users */}
        <Route path="/attendance" element={
          loggedInUser ? (
            <AttendanceSystem 
              isInstructor={loggedInUser.role === "instructor" || loggedInUser.role === "admin"} 
              userEmail={loggedInUser.email} 
            />
          ) : <Navigate to="/login" />
        } />

        <Route path="/course-materials" element={
          loggedInUser ? (
            <ProjectManagement 
              userRole={loggedInUser.role as 'admin' | 'instructor' | 'student' | 'accounting'}
              userEmail={loggedInUser.email}
            />
          ) : <Navigate to="/login" />
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
