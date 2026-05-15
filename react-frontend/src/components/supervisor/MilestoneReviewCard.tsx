// Supervisor component for reviewing milestones (FR-MIL-006 to FR-MIL-009) - Enhanced
import React, { useState } from 'react';
import { Milestone, MilestoneStatus } from '../../types';
import { Card, Button, StatusBadge, Modal, Textarea, Select } from '../common';
import { formatDateTime } from '../../utils/format';
import { milestoneService } from '../../services';

interface MilestoneReviewCardProps {
  milestone: Milestone;
  onUpdate: (message?: string) => void;
}

export const MilestoneReviewCard: React.FC<MilestoneReviewCardProps> = ({
  milestone,
  onUpdate,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [status, setStatus] = useState<MilestoneStatus>(MilestoneStatus.ACCEPTED);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleReview = async () => {
    // Validation
    if ((status === MilestoneStatus.PENDING_REVISION || status === MilestoneStatus.REJECTED) && 
        feedback.trim().length < 10) {
      alert('⚠️ Feedback must be at least 10 characters for Pending Revision and Rejected statuses');
      return;
    }

    if (feedback.trim().length > 1000) {
      alert('⚠️ Feedback must not exceed 1000 characters');
      return;
    }

    setIsLoading(true);
    try {
      await milestoneService.reviewMilestone(milestone.milestone_id, { 
        status, 
        feedback: feedback.trim() || '' 
      });
      
      const messages: Record<MilestoneStatus, string> = {
        [MilestoneStatus.ACCEPTED]: `✅ Milestone "${milestone.title}" accepted successfully!`,
        [MilestoneStatus.PENDING_REVIEW]: ``,
        [MilestoneStatus.PENDING_REVISION]: `📝 Milestone "${milestone.title}" returned for revision`,
        [MilestoneStatus.REJECTED]: `❌ Milestone "${milestone.title}" rejected`,
      };
      
      setShowReviewModal(false);
      onUpdate(messages[status] || 'Milestone reviewed successfully!');
    } catch (error) {
      alert('❌ Failed to review milestone. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: MilestoneStatus.ACCEPTED, label: '✓ Accept - Milestone meets requirements' },
    { value: MilestoneStatus.PENDING_REVISION, label: '✎ Request Revision - Needs improvements' },
    { value: MilestoneStatus.REJECTED, label: '✗ Reject - Does not meet requirements' },
  ];

  const getFeedbackHelperText = () => {
    if (status === MilestoneStatus.ACCEPTED) {
      return `Optional positive feedback (${charCount}/1000 characters)`;
    }
    const remaining = 10 - charCount;
    if (charCount < 10) {
      return `Required: ${remaining} more character${remaining !== 1 ? 's' : ''} needed (minimum 10)`;
    }
    return `${charCount}/1000 characters`;
  };

  const isFeedbackValid = status === MilestoneStatus.ACCEPTED || charCount >= 10;

  return (
    <>
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  milestone.status === 'accepted' ? 'bg-green-500' :
                  milestone.status === 'pending_review' ? 'bg-blue-500' :
                  milestone.status === 'pending_revision' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  {milestone.status === 'accepted' ? '✓' :
                   milestone.status === 'pending_review' ? '⏱' :
                   milestone.status === 'pending_revision' ? '✎' : '✗'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">
                    Submitted: {formatDateTime(milestone.submission_date)}
                  </p>
                </div>
              </div>
            </div>
            <StatusBadge status={milestone.status} />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
            <p className="text-gray-700 whitespace-pre-wrap">{milestone.description}</p>
          </div>

          {milestone.attachment_name && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <span className="text-sm text-blue-800 font-medium">{milestone.attachment_name}</span>
              <Button size="sm" variant="secondary" className="ml-auto">
                Download
              </Button>
            </div>
          )}

          {milestone.feedback && (
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
              <p className="text-sm font-medium text-gray-700 mb-1">Your Previous Feedback:</p>
              <p className="text-sm text-gray-600">{milestone.feedback}</p>
            </div>
          )}

          {milestone.status === MilestoneStatus.PENDING_REVIEW && (
            <div className="pt-4 border-t flex gap-2">
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowReviewModal(true);
                  setStatus(MilestoneStatus.ACCEPTED);
                  setFeedback('');
                  setCharCount(0);
                }}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Review Milestone
              </Button>
              <div className="flex-1 bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-blue-800">
                  ⏱ This milestone is awaiting your review
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Review Milestone: ${milestone.title}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Milestone Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Submitted:</strong> {formatDateTime(milestone.submission_date)}
            </p>
            <p className="text-sm text-gray-700 line-clamp-3">{milestone.description}</p>
          </div>

          <Select
            label="Review Decision"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as MilestoneStatus);
              setFeedback('');
              setCharCount(0);
            }}
            options={statusOptions}
            required
          />

          <div className="space-y-2">
            <Textarea
              label="Feedback"
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                setCharCount(e.target.value.length);
              }}
              rows={6}
              required={status !== MilestoneStatus.ACCEPTED}
              helperText={getFeedbackHelperText()}
              maxLength={1000}
              placeholder={
                status === MilestoneStatus.ACCEPTED
                  ? "Optional: Provide positive feedback and encouragement..."
                  : status === MilestoneStatus.PENDING_REVISION
                  ? "Explain what needs to be improved:\n• Be specific about required changes\n• Provide constructive guidance\n• Set clear expectations"
                  : "Explain why this milestone is being rejected:\n• Identify major issues\n• Explain what was expected\n• Provide guidance for future submissions"
              }
            />
            
            {/* Visual feedback indicator */}
            {status !== MilestoneStatus.ACCEPTED && (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isFeedbackValid ? 'bg-green-500' : 
                      charCount > 0 ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min((charCount / 10) * 100, 100)}%` }}
                  />
                </div>
                {isFeedbackValid && (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* Review Guidelines */}
          <div className={`border-l-4 rounded-lg p-4 ${
            status === MilestoneStatus.ACCEPTED ? 'bg-green-50 border-green-500' :
            status === MilestoneStatus.PENDING_REVISION ? 'bg-yellow-50 border-yellow-500' :
            'bg-red-50 border-red-500'
          }`}>
            <h4 className={`text-sm font-medium mb-2 ${
              status === MilestoneStatus.ACCEPTED ? 'text-green-900' :
              status === MilestoneStatus.PENDING_REVISION ? 'text-yellow-900' :
              'text-red-900'
            }`}>
              {status === MilestoneStatus.ACCEPTED ? '✓ Accepting Milestone' :
               status === MilestoneStatus.PENDING_REVISION ? '✎ Requesting Revision' :
               '✗ Rejecting Milestone'}
            </h4>
            <ul className={`text-sm space-y-1 ${
              status === MilestoneStatus.ACCEPTED ? 'text-green-800' :
              status === MilestoneStatus.PENDING_REVISION ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              {status === MilestoneStatus.ACCEPTED ? (
                <>
                  <li>• Milestone will be marked as completed</li>
                  <li>• Student can proceed to next milestone</li>
                  <li>• Milestone will be locked from editing</li>
                </>
              ) : status === MilestoneStatus.PENDING_REVISION ? (
                <>
                  <li>• Student will be notified to make revisions</li>
                  <li>• Provide clear, actionable feedback</li>
                  <li>• Student can resubmit after addressing feedback</li>
                </>
              ) : (
                <>
                  <li>• Milestone will be marked as rejected</li>
                  <li>• Explain the reasons clearly</li>
                  <li>• Student may need to start over</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="secondary" 
              onClick={() => setShowReviewModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant={
                status === MilestoneStatus.ACCEPTED ? 'success' :
                status === MilestoneStatus.PENDING_REVISION ? 'primary' :
                'danger'
              }
              onClick={handleReview} 
              isLoading={isLoading}
              disabled={!isFeedbackValid}
            >
              {isLoading ? 'Submitting...' : 
               status === MilestoneStatus.ACCEPTED ? 'Accept Milestone' :
               status === MilestoneStatus.PENDING_REVISION ? 'Request Revision' :
               'Reject Milestone'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
