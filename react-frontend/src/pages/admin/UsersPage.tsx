// Admin - User Management Page (FR-ACCT)
import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, Button } from '../../components/common';

export default function AdminUsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <Button variant="primary">+ Add New User</Button>
        </div>

        <Card title="System Users">
          <p className="text-gray-600">User management interface will be implemented here.</p>
          <p className="text-sm text-gray-500 mt-2">
            Features: Create users, manage roles, activate/deactivate accounts, reset passwords
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
