// Admin - Audit Logs Page (FR-RPT-003, FR-RPT-004)
import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common';

export default function AdminAuditPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>

        <Card title="System Audit Trail">
          <p className="text-gray-600">Audit log viewer will be implemented here.</p>
          <p className="text-sm text-gray-500 mt-2">
            Features: View all system actions, filter by user/date/action type, export logs
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
