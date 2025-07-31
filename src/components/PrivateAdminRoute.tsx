import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';

interface PrivateAdminRouteProps {
  children: React.ReactNode;
}

export const PrivateAdminRoute: React.FC<PrivateAdminRouteProps> = ({ children }) => {
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (!isAdmin) {
      alert('Access denied. Admins only.');
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};