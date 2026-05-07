// Dashboard layout with navigation
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { APP_NAME, ROUTES } from '../../constants';
import { UserRole } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getNavigationLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { label: 'Applications', href: ROUTES.ADMIN_APPLICATIONS },
          { label: 'Assignments', href: ROUTES.ADMIN_ASSIGNMENTS },
          { label: 'Evaluations', href: ROUTES.ADMIN_EVALUATIONS },
          { label: 'Reports', href: ROUTES.ADMIN_REPORTS },
          { label: 'Users', href: ROUTES.ADMIN_USERS },
        ];
      case UserRole.UNIVERSITY:
        return [
          { label: 'Applications', href: ROUTES.UNIVERSITY_APPLICATIONS },
          { label: 'Students', href: ROUTES.UNIVERSITY_STUDENTS },
          { label: 'Reports', href: ROUTES.UNIVERSITY_REPORTS },
        ];
      case UserRole.SUPERVISOR:
        return [
          { label: 'My Students', href: ROUTES.SUPERVISOR_STUDENTS },
          { label: 'Milestones', href: ROUTES.SUPERVISOR_MILESTONES },
          { label: 'Evaluations', href: ROUTES.SUPERVISOR_EVALUATIONS },
          { label: 'Messages', href: ROUTES.SUPERVISOR_MESSAGES },
        ];
      case UserRole.STUDENT:
        return [
          { label: 'Dashboard', href: ROUTES.STUDENT_DASHBOARD },
          { label: 'Milestones', href: ROUTES.STUDENT_MILESTONES },
          { label: 'Messages', href: ROUTES.STUDENT_MESSAGES },
          { label: 'Evaluation', href: ROUTES.STUDENT_EVALUATION },
        ];
      default:
        return [];
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">{APP_NAME}</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user?.full_name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {navigationLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className="py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-600"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};
