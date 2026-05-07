// Admin component for reviewing applications (FR-REV-001 to FR-REV-006)
import React, { useState } from 'react';
import { InternshipApplication } from '../../types';
import { Card, Button, StatusBadge, Modal, Textarea } from '../common';
import { formatDate } from '../../utils/format';
import { applicationService } from '../../services';

interface ApplicationReviewCardProps {
  application: InternshipApplication;
  onUpdate: () => void;
}

export const ApplicationReviewCard: React.FC<ApplicationReviewCardProps> = ({
  application,
  onUpdate,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [holdComment, setHoldComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this application? A student account will be created.')) {
      return;
    }

    setIsLoading(true);
    try {
      await applicationService.approveApplication(application.application_id);
      alert('Application approved successfully. Student account has been created.');
      onUpdate();
    } catch (error) {
      alert('Failed to approve application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (rejectionReason.trim().length < 20) {
      alert('Rejection reason must be at least 20 characters');
      return;
    }

    setIsLoading(true);
    try {
      await applicationService.rejectApplication(application.application_id, rejectionReason);
      alert('Application rejected');
      setShowRejectModal(false);
      onUpdate();
    } catch (error) {
      alert('Failed to reject application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHold = async () => {
    if (holdComment.trim().length < 10) {
      alert('Comment must be at least 10 characters');
      return;
    }

    setIsLoading(true);
    try {
      await applicationService.holdApplication(application.application_id, holdComment);
      alert('Application placed on hold');
      setShowHoldModal(false);
      onUpdate();
    } catch (error) {
      alert('Failed to place application on hold');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{application.student_name}</h3>
              <p className="text-sm text-gray-600">{application.institutional_email}</p>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Student ID:</span> {application.student_institutional_id}
            </div>
            <div>
              <span className="font-medium">Department:</span> {application.department}
            </div>
            <div>
              <span className="font-medium">GPA:</span> {application.gpa.toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Submitted:</span> {formatDate(application.created_at)}
            </div>
          </div>

          {application.status === 'pending' && (
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="success" onClick={handleApprove} isLoading={isLoading}>
                Approve
              </Button>
              <Button variant="danger" onClick={() => setShowRejectModal(true)}>
                Reject
              </Button>
              <Button variant="secondary" onClick={() => setShowHoldModal(true)}>
                Place on Hold
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Application"
      >
        <div className="space-y-4">
          <Textarea
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            required
            helperText="Minimum 20 characters required"
            showCharCount
            maxLength={500}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} isLoading={isLoading}>
              Reject Application
            </Button>
          </div>
        </div>
      </Modal>

      {/* Hold Modal */}
      <Modal isOpen={showHoldModal} onClose={() => setShowHoldModal(false)} title="Place on Hold">
        <div className="space-y-4">
          <Textarea
            label="Request Additional Information"
            value={holdComment}
            onChange={(e) => setHoldComment(e.target.value)}
            rows={4}
            required
            helperText="Explain what additional information is needed"
            maxLength={500}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowHoldModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleHold} isLoading={isLoading}>
              Place on Hold
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
