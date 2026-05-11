import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protects admin routes: unauthenticated → /login, students → /student
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isStudent } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Students don't belong in the admin dashboard
  if (isStudent) {
    return <Navigate to="/student" replace />;
  }

  return children;
};

export default ProtectedRoute;
