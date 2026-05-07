// Supervisor component for reviewing milestones (FR-MIL-006 to FR-MIL-009)
import React, { useState } from 'react';
import { Milestone, MilestoneStatus } from '../../types';
import { Card, Button, StatusBadge, Modal, Textarea, Select } from '../common';
import { formatDateTime } from '../../utils/format';
import { milestoneService } from '../../services';

interface MilestoneReviewCardProps {
  milestone: Milestone;
  onUpdate: () => void;
}

export const MilestoneReviewCard: React.FC<MilestoneReviewCardProps> = ({
  milestone,
  onUpdate,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [status, setStatus] = useState<MilestoneStatus>(MilestoneStatus.ACCEPTED);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReview = async () => {
    if ((status === MilestoneStatus.PENDING_REVISION || status === MilestoneStatus.REJECTED) && 
        feedback.trim().length < 10) {
      alert('Feedback is required for Pending Revision and Rejected statuses');
      return;
    }

    setIsLoading(true);
    try {
      await milestoneService.reviewMilestone(milestone.milestone_id, { status, feedback });
      alert('Milestone reviewed successfully');
      setShowReviewModal(false);
      onUpdate();
    } catch (error) {
      alert('Failed to review milestone');
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: MilestoneStatus.ACCEPTED, label: 'Accepted' },
    { value: MilestoneStatus.PENDING_REVISION, label: 'Pending Revision' },
    { value: MilestoneStatus.REJECTED, label: 'Rejected' },
  ];

  return (
    <>
      <Card>
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
              <p className="text-sm text-gray-600">{milestone.feedback}</p>
            </div>
          )}

          {milestone.status === MilestoneStatus.PENDING_REVIEW && (
            <div className="pt-4 border-t">
              <Button variant="primary" onClick={() => setShowReviewModal(true)}>
                Review Milestone
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Review Milestone"
      >
        <div className="space-y-4">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
            options={statusOptions}
            required
          />

          <Textarea
            label="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            required={status !== MilestoneStatus.ACCEPTED}
            helperText={
              status === MilestoneStatus.ACCEPTED
                ? 'Optional for accepted milestones'
                : 'Required for revision or rejection'
            }
            maxLength={1000}
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleReview} isLoading={isLoading}>
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
