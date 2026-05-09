// Supervisor - Milestones Review Page (FR-MIL-006 to FR-MIL-009)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MilestoneReviewCard } from '../../components/supervisor';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { Milestone } from '../../types';
import { milestoneService } from '../../services';

export default function SupervisorMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending_review' | 'accepted' | 'pending_revision'>(
    'pending_review'
  );

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    setIsLoading(true);
    try {
      const data = await milestoneService.getMilestonesForMyStudents();
      setMilestones(data);
    } catch (error) {
      console.error('Failed to load milestones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMilestones = milestones.filter((milestone) => {
    if (filter === 'all') return true;
    return milestone.status === filter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Milestones</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending_review')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'pending_review' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'accepted' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setFilter('pending_revision')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'pending_revision'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Pending Revision
            </button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading milestones..." />
        ) : filteredMilestones.length === 0 ? (
          <EmptyState
            title="No milestones found"
            description={`There are no ${filter === 'all' ? '' : filter.replace('_', ' ')} milestones at this time.`}
          />
        ) : (
          <div className="grid gap-6">
            {filteredMilestones.map((milestone) => (
              <MilestoneReviewCard
                key={milestone.milestone_id}
                milestone={milestone}
                onUpdate={loadMilestones}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
