import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AttendanceSystem } from './components/AttendanceSystem';
import { StudentProfile } from './components/StudentProfile';

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

        {loggedInUser && loggedInUser.role === "instructor" && (
          <Route path="/attendance" element={<AttendanceSystem isInstructor={true} />} />
        )}

        {loggedInUser && loggedInUser.role === "student" && (
          <Route path="/attendance" element={<AttendanceSystem isInstructor={false} userEmail={loggedInUser.email} />} />
        )}

        {loggedInUser && loggedInUser.role === "student" && (
          <Route path="/student-profile" element={
            <StudentProfile userData={loggedInUser} />
          } />
        )}
      </Routes>
    </Router>
  );
}

export default App;
