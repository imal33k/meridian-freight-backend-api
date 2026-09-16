import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import Spinner from './Spinner';

export default function ProtectedRoute({ role, children }: { role: UserRole; children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-dim">
        <Spinner label="Checking your session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/portal'} replace />;
  }

  return <>{children}</>;
}
