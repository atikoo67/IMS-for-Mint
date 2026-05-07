// Admin - Application Review Page (FR-REV-001 to FR-REV-006)
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ApplicationReviewCard } from '../../components/admin';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { InternshipApplication } from '../../types';
import { applicationService } from '../../services';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.getPendingApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading applications..." />
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            title="No applications found"
            description={`There are no ${filter === 'all' ? '' : filter} applications at this time.`}
          />
        ) : (
          <div className="grid gap-6">
            {filteredApplications.map((application) => (
              <ApplicationReviewCard
                key={application.application_id}
                application={application}
                onUpdate={loadApplications}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
