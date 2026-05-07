import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardRouter from './pages/DashboardRouter';

// Admin Pages
import AdminApplicationsPage from './pages/admin/ApplicationsPage';
import AdminAssignmentsPage from './pages/admin/AssignmentsPage';
import AdminEvaluationsPage from './pages/admin/EvaluationsPage';
import AdminReportsPage from './pages/admin/ReportsPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminAuditPage from './pages/admin/AuditPage';

// University Pages
import UniversityApplicationsPage from './pages/university/ApplicationsPage';
import UniversityStudentsPage from './pages/university/StudentsPage';
import UniversityReportsPage from './pages/university/ReportsPage';

// Supervisor Pages
import SupervisorStudentsPage from './pages/supervisor/StudentsPage';
import SupervisorMilestonesPage from './pages/supervisor/MilestonesPage';
import SupervisorEvaluationsPage from './pages/supervisor/EvaluationsPage';
import SupervisorMessagesPage from './pages/supervisor/MessagesPage';

// Student Pages
import StudentDashboardPage from './pages/student/DashboardPage';
import StudentMilestonesPage from './pages/student/MilestonesPage';
import StudentMessagesPage from './pages/student/MessagesPage';
import StudentEvaluationPage from './pages/student/EvaluationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        
        {/* Admin Routes */}
        <Route path="/admin/applications" element={<AdminApplicationsPage />} />
        <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
        <Route path="/admin/evaluations" element={<AdminEvaluationsPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/audit" element={<AdminAuditPage />} />
        
        {/* University Routes */}
        <Route path="/university/applications" element={<UniversityApplicationsPage />} />
        <Route path="/university/students" element={<UniversityStudentsPage />} />
        <Route path="/university/reports" element={<UniversityReportsPage />} />
        
        {/* Supervisor Routes */}
        <Route path="/supervisor/students" element={<SupervisorStudentsPage />} />
        <Route path="/supervisor/milestones" element={<SupervisorMilestonesPage />} />
        <Route path="/supervisor/evaluations" element={<SupervisorEvaluationsPage />} />
        <Route path="/supervisor/messages" element={<SupervisorMessagesPage />} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/milestones" element={<StudentMilestonesPage />} />
        <Route path="/student/messages" element={<StudentMessagesPage />} />
        <Route path="/student/evaluation" element={<StudentEvaluationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
