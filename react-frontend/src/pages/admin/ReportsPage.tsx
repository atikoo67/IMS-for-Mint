// Admin - Reports Page (FR-RPT-001 to FR-RPT-004)
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, Button } from '../../components/common';
import { applicationService } from '../../services';

export default function AdminReportsPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    on_hold: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await applicationService.getApplicationStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>

        {/* Application Statistics */}
        <Card title="Application Statistics">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Applications</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-sm text-gray-600 mt-1">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-600 mt-1">Rejected</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.on_hold}</p>
              <p className="text-sm text-gray-600 mt-1">On Hold</p>
            </div>
          </div>
        </Card>

        {/* Report Generation */}
        <Card title="Generate Reports">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Application Status Report</h3>
                <p className="text-sm text-gray-600">
                  Detailed breakdown of all applications by status and university
                </p>
              </div>
              <Button variant="primary">Download PDF</Button>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Cohort Grade Report</h3>
                <p className="text-sm text-gray-600">
                  Consolidated grades for all students in a cohort
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary">Download PDF</Button>
                <Button variant="secondary">Download CSV</Button>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Supervisor Assignment Report</h3>
                <p className="text-sm text-gray-600">
                  Overview of supervisor workload and student assignments
                </p>
              </div>
              <Button variant="primary">Download PDF</Button>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">System Activity Report</h3>
                <p className="text-sm text-gray-600">
                  User activity and system usage statistics
                </p>
              </div>
              <Button variant="primary">Download PDF</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
