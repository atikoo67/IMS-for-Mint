// Dashboard layout with navigation
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants';
import { UserRole } from '../../types';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = 'Dashboard',
  breadcrumb,
  actions 
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getNavigationLinks = () => {
    if (!user) return [];

    const icons = {
      applications: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      assignments: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      evaluations: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      reports: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      users: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      students: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      milestones: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      messages: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      dashboard: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      audit: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    };

    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { label: 'Applications', href: ROUTES.ADMIN_APPLICATIONS, icon: icons.applications },
          { label: 'Assignments', href: ROUTES.ADMIN_ASSIGNMENTS, icon: icons.assignments },
          { label: 'Evaluations', href: ROUTES.ADMIN_EVALUATIONS, icon: icons.evaluations },
          { label: 'Reports', href: ROUTES.ADMIN_REPORTS, icon: icons.reports },
          { label: 'Users', href: ROUTES.ADMIN_USERS, icon: icons.users },
          { label: 'Audit Log', href: ROUTES.ADMIN_AUDIT, icon: icons.audit },
        ];
      case UserRole.UNIVERSITY:
        return [
          { label: 'Applications', href: ROUTES.UNIVERSITY_APPLICATIONS, icon: icons.applications },
          { label: 'Students', href: ROUTES.UNIVERSITY_STUDENTS, icon: icons.students },
          { label: 'Reports', href: ROUTES.UNIVERSITY_REPORTS, icon: icons.reports },
        ];
      case UserRole.SUPERVISOR:
        return [
          { label: 'My Students', href: ROUTES.SUPERVISOR_STUDENTS, icon: icons.students },
          { label: 'Milestones', href: ROUTES.SUPERVISOR_MILESTONES, icon: icons.milestones },
          { label: 'Attendance', href: ROUTES.SUPERVISOR_ATTENDANCE, icon: icons.evaluations },
          { label: 'Monthly Reports', href: ROUTES.SUPERVISOR_MONTHLY_REPORTS, icon: icons.reports },
          { label: 'Evaluations', href: ROUTES.SUPERVISOR_EVALUATIONS, icon: icons.evaluations },
          { label: 'Messages', href: ROUTES.SUPERVISOR_MESSAGES, icon: icons.messages },
        ];
      case UserRole.STUDENT:
        return [
          { label: 'Dashboard', href: ROUTES.STUDENT_DASHBOARD, icon: icons.dashboard },
          { label: 'Milestones', href: ROUTES.STUDENT_MILESTONES, icon: icons.milestones },
          { label: 'Monthly Reports', href: ROUTES.STUDENT_MONTHLY_REPORTS, icon: icons.reports },
          { label: 'Messages', href: ROUTES.STUDENT_MESSAGES, icon: icons.messages },
          { label: 'Evaluation', href: ROUTES.STUDENT_EVALUATION, icon: icons.evaluations },
        ];
      default:
        return [];
    }
  };

  const navigationLinks = getNavigationLinks();

  if (!user) {
    return <div>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-surface-page flex">
      {/* Sidebar */}
      <Sidebar 
        user={user} 
        navigationLinks={navigationLinks} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-[220px]">
        {/* Top Bar */}
        <TopBar 
          title={title} 
          breadcrumb={breadcrumb}
          actions={actions}
          unreadCount={unreadCount} 
        />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
