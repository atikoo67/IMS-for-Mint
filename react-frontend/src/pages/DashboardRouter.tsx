// Dashboard router - redirects based on user role
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { LoadingSpinner } from '../components/common';

const DashboardRouter: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect to role-specific dashboard
    if (user) {
      switch (user.role) {
        case UserRole.ADMIN:
          navigate('/admin/applications');
          break;
        case UserRole.UNIVERSITY:
          navigate('/university/applications');
          break;
        case UserRole.SUPERVISOR:
          navigate('/supervisor/students');
          break;
        case UserRole.STUDENT:
          navigate('/student/dashboard');
          break;
        default:
          navigate('/login');
      }
    }
  }, [user, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading dashboard..." />
    </div>
  );
};

export default DashboardRouter;
