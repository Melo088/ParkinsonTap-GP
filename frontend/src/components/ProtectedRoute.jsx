import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ requiredRole = null }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isTokenExpired = authService.isTokenExpired();
  const userRole = authService.getUserRole();

  if (!isAuthenticated || isTokenExpired) {
    authService.logout();
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
