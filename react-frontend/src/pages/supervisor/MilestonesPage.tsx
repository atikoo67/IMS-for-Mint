// Supervisor - Milestones Review Page (FR-MIL-006 to FR-MIL-009) - Enhanced
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MilestoneReviewCard } from '../../components/supervisor';
import { LoadingSpinner, EmptyState, ToastContainer } from '../../components/common';
import { Milestone } from '../../types';
import { milestoneService } from '../../services';
import { useToast } from '../../hooks/useToast';

export default function SupervisorMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending_review' | 'accepted' | 'pending_revision'>(
    'pending_review'
  );

  const { toasts, removeToast, success, error, info } = useToast();

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    setIsLoading(true);
    try {
      const data = await milestoneService.getMilestonesForMyStudents();
      setMilestones(data);
      
      // Show info about pending reviews
      const pendingCount = data.filter(m => m.status === 'pending_review').length;
      if (pendingCount > 0) {
        info(`You have ${pendingCount} milestone(s) pending your review`);
      }
    } catch (err) {
      console.error('Failed to load milestones:', err);
      error('Failed to load milestones. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSuccess = (message?: string) => {
    success(message || 'Milestone reviewed successfully!');
    loadMilestones();
  };

  const filteredMilestones = milestones.filter((milestone) => {
    if (filter === 'all') return true;
    return milestone.status === filter;
  });

  const getFilterCount = (status: string) => {
    if (status === 'all') return milestones.length;
    return milestones.filter(m => m.status === status).length;
  };

  const getFilterButtonClass = (currentFilter: string) => {
    return `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      filter === currentFilter
        ? 'bg-mint-navy text-white shadow-md'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
    }`;
  };

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Milestones</h1>
            <p className="text-sm text-gray-600 mt-1">
              Review and provide feedback on your students' milestone submissions
            </p>
          </div>
        </div>

        {/* Summary Statistics */}
        {milestones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{milestones.length}</div>
                <div className="text-sm text-gray-600">Total Milestones</div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {getFilterCount('pending_review')}
                </div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {getFilterCount('accepted')}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {getFilterCount('pending_revision')}
                </div>
                <div className="text-sm text-gray-600">Needs Revision</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={getFilterButtonClass('all')}
          >
            All ({getFilterCount('all')})
          </button>
          <button
            onClick={() => setFilter('pending_review')}
            className={getFilterButtonClass('pending_review')}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Pending Review ({getFilterCount('pending_review')})
            </span>
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={getFilterButtonClass('accepted')}
          >
            Accepted ({getFilterCount('accepted')})
          </button>
          <button
            onClick={() => setFilter('pending_revision')}
            className={getFilterButtonClass('pending_revision')}
          >
            Pending Revision ({getFilterCount('pending_revision')})
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading milestones..." />
          </div>
        ) : filteredMilestones.length === 0 ? (
          <EmptyState
            title="No milestones found"
            description={`There are no ${filter === 'all' ? '' : filter.replace('_', ' ')} milestones at this time.`}
          />
        ) : (
          <div className="grid gap-4">
            {filteredMilestones.map((milestone) => (
              <MilestoneReviewCard
                key={milestone.milestone_id}
                milestone={milestone}
                onUpdate={handleReviewSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
