
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
import { Toaster } from "sonner";
import { Dashboard as DashboardComponent } from './components/Dashboard';
import { SalesCRMDashboard } from './components/crm/SalesCRMDashboard';
import SalesRoutes from './pages/sales';
import MongoDBAdmin from './pages/admin/MongoDBAdmin';
// Location tracking imports are commented out
// import LocationTracking from './pages/admin/LocationTracking';
// import { LocationTracker } from './components/location/LocationTracker';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // Commented out location tracking state
  // const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

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

  console.log("Current logged in user:", loggedInUser);

  return (
    <LanguageProvider>
      <Router>
        <div className="relative">
          <Toaster position="top-right" />
          
          {/* Location Tracker commented out
          {loggedInUser && !locationPermissionGranted && (
            <LocationTracker 
              userEmail={loggedInUser.email}
              userRole={loggedInUser.role}
              onPermissionGranted={() => setLocationPermissionGranted(true)}
            />
          )}
          */}
          
          <Routes>
            <Route path="/" element={loggedInUser ? (
              !loggedInUser.profileCompleted ? 
                <Navigate to="/profile-setup" replace /> :
                loggedInUser.role === 'sales' ? 
                  <Navigate to="/sales" replace /> : 
                  <Navigate to="/user-dashboard" replace />
            ) : <Index />} />
            
            <Route path="/dashboard" element={loggedInUser ? <DashboardComponent onLogout={handleLogout} user={loggedInUser} /> : <Navigate to="/" replace />} />
            <Route path="/profile-setup" element={loggedInUser ? <ProfileSetup /> : <Navigate to="/" replace />} />
            <Route path="/user-dashboard" element={
              loggedInUser ? (
                loggedInUser.role === 'sales' ? 
                  <Navigate to="/sales" replace /> : 
                  <UserDashboard />
              ) : <Navigate to="/" replace />
            } />

            {/* MongoDB Admin Route */}
            <Route path="/mongodb-admin" element={
              loggedInUser && loggedInUser.role === 'admin' ? (
                <MongoDBAdmin />
              ) : <Navigate to="/" replace />
            } />

            {/* Sales Module Routes */}
            <Route 
              path="/sales/*" 
              element={
                loggedInUser ? (
                  <SalesRoutes 
                    user={loggedInUser} 
                    onLogout={handleLogout} 
                  />
                ) : <Navigate to="/" replace />
              } 
            />

            {/* CRM Dashboard Route for Sales Role - Legacy support */}
            <Route path="/crm-dashboard" element={
              loggedInUser && loggedInUser.role === 'sales' ? (
                <SalesCRMDashboard 
                  user={loggedInUser} 
                  onLogout={handleLogout} 
                />
              ) : <Navigate to="/" replace />
            } />

            <Route path="/attendance" element={
              loggedInUser && loggedInUser.role !== 'sales' ? (
                <AttendanceSystem 
                  isInstructor={loggedInUser.role === "instructor" || loggedInUser.role === "admin"} 
                  userEmail={loggedInUser.email} 
                />
              ) : <Navigate to="/" replace />
            } />

            <Route path="/course-materials" element={
              loggedInUser && loggedInUser.role !== 'sales' ? (
                <ProjectManagement 
                  userRole={loggedInUser.role === "accounting" ? "admin" : loggedInUser.role}
                  userEmail={loggedInUser.email}
                />
              ) : <Navigate to="/" replace />
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
