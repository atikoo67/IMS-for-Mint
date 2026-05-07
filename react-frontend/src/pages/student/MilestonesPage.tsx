// Student - Milestones Page (FR-MIL-001 to FR-MIL-005)
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MilestoneSubmissionForm } from '../../components/student';
import { LoadingSpinner, Card, StatusBadge, Button, Modal, EmptyState } from '../../components/common';
import { Milestone } from '../../types';
import { milestoneService } from '../../services';
import { formatDateTime } from '../../utils/format';

export default function StudentMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    setIsLoading(true);
    try {
      const data = await milestoneService.getMyMilestones();
      setMilestones(data);
    } catch (error) {
      console.error('Failed to load milestones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowNewForm(false);
    loadMilestones();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Milestones</h1>
          <Button variant="primary" onClick={() => setShowNewForm(true)}>
            + Submit New Milestone
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading milestones..." />
        ) : milestones.length === 0 ? (
          <EmptyState
            title="No milestones yet"
            description="You haven't submitted any milestones yet. Click the button above to submit your first milestone."
            action={
              <Button variant="primary" onClick={() => setShowNewForm(true)}>
                Submit First Milestone
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6">
            {milestones.map((milestone) => (
              <Card key={milestone.milestone_id}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">
                        Submitted: {formatDateTime(milestone.submission_date)}
                      </p>
                    </div>
                    <StatusBadge status={milestone.status} />
                  </div>

                  <p className="text-gray-700">{milestone.description}</p>

                  {milestone.attachment_name && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      {milestone.attachment_name}
                    </div>
                  )}

                  {milestone.feedback && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Supervisor Feedback:
                      </p>
                      <p className="text-sm text-blue-800">{milestone.feedback}</p>
                      {milestone.reviewed_at && (
                        <p className="text-xs text-blue-600 mt-2">
                          Reviewed: {formatDateTime(milestone.reviewed_at)}
                        </p>
                      )}
                    </div>
                  )}

                  {milestone.status === 'pending_revision' && !milestone.locked && (
                    <div className="pt-4 border-t">
                      <Button variant="primary" size="sm">
                        Edit and Resubmit
                      </Button>
                    </div>
                  )}

                  {milestone.locked && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        This milestone is locked and cannot be edited
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* New Milestone Modal */}
        <Modal
          isOpen={showNewForm}
          onClose={() => setShowNewForm(false)}
          title="Submit New Milestone"
          size="lg"
        >
          <MilestoneSubmissionForm onSuccess={handleSuccess} />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
