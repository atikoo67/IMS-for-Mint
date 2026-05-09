// Admin - Application Review Page (FR-REV-001 to FR-REV-006) - MInT IMS Design System
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ApplicationReviewCard } from '../../components/admin';
import { LoadingSpinner, EmptyState, Button } from '../../components/common';
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

  const getFilterCount = (status: string) => {
    if (status === 'all') return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  return (
    <DashboardLayout 
      title="Application Review"
      actions={
        <Button 
          variant="primary"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          New Application
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`
              px-4 py-2 rounded-lg text-body-sm font-medium transition-all
              ${filter === 'all' 
                ? 'bg-mint-navy text-white' 
                : 'bg-surface-white text-text-muted border border-border-default hover:bg-surface-page'
              }
            `}
          >
            All ({getFilterCount('all')})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`
              px-4 py-2 rounded-lg text-body-sm font-medium transition-all
              ${filter === 'pending' 
                ? 'bg-mint-navy text-white' 
                : 'bg-surface-white text-text-muted border border-border-default hover:bg-surface-page'
              }
            `}
          >
            Pending ({getFilterCount('pending')})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`
              px-4 py-2 rounded-lg text-body-sm font-medium transition-all
              ${filter === 'approved' 
                ? 'bg-mint-navy text-white' 
                : 'bg-surface-white text-text-muted border border-border-default hover:bg-surface-page'
              }
            `}
          >
            Approved ({getFilterCount('approved')})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`
              px-4 py-2 rounded-lg text-body-sm font-medium transition-all
              ${filter === 'rejected' 
                ? 'bg-mint-navy text-white' 
                : 'bg-surface-white text-text-muted border border-border-default hover:bg-surface-page'
              }
            `}
          >
            Rejected ({getFilterCount('rejected')})
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading applications..." />
          </div>
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            title="No applications found"
            description={`There are no ${filter === 'all' ? '' : filter} applications at this time.`}
          />
        ) : (
          <div className="grid gap-4">
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
