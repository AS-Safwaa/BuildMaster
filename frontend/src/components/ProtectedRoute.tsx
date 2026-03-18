import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { SkeletonDashboard } from './ui/Skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

/**
 * Route Guard — ensures user is authenticated and has correct role
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  if (!isAuthenticated) {
    // Redirect to login but keep current location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user?.role !== role) {
    // If user has wrong role, send them to their own dashboard or home
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/developer'} replace />;
  }

  return <>{children}</>;
};
