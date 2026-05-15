// Student - Milestones Page (FR-MIL-001 to FR-MIL-005) - Enhanced
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MilestoneSubmissionForm } from '../../components/student';
import { LoadingSpinner, Card, StatusBadge, Button, Modal, EmptyState, ToastContainer } from '../../components/common';
import { Milestone } from '../../types';
import { milestoneService } from '../../services';
import { formatDateTime } from '../../utils/format';
import { useToast } from '../../hooks/useToast';

export default function StudentMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  
  const { toasts, removeToast, success, error, info } = useToast();

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    setIsLoading(true);
    try {
      const data = await milestoneService.getMyMilestones();
      setMilestones(data);
      
      // Show info about pending milestones
      const pendingCount = data.filter(m => m.status === 'pending_review').length;
      const revisionCount = data.filter(m => m.status === 'pending_revision').length;
      
      if (pendingCount > 0) {
        info(`You have ${pendingCount} milestone(s) pending supervisor review`);
      }
      if (revisionCount > 0) {
        info(`You have ${revisionCount} milestone(s) that need revision`);
      }
    } catch (err) {
      console.error('Failed to load milestones:', err);
      error('Failed to load milestones. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (message?: string) => {
    setShowNewForm(false);
    setShowEditForm(false);
    setSelectedMilestone(null);
    success(message || 'Milestone submitted successfully!');
    loadMilestones();
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowEditForm(true);
  };

  const getProgressStats = () => {
    const total = milestones.length;
    const accepted = milestones.filter(m => m.status === 'accepted').length;
    const pending = milestones.filter(m => m.status === 'pending_review').length;
    const revision = milestones.filter(m => m.status === 'pending_revision').length;
    const rejected = milestones.filter(m => m.status === 'rejected').length;
    
    return { total, accepted, pending, revision, rejected };
  };

  const stats = getProgressStats();
  const progressPercentage = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Milestones</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track your internship progress through milestone submissions
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setShowNewForm(true)}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Submit New Milestone
          </Button>
        </div>

        {/* Progress Summary */}
        {milestones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Submitted</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.revision}</div>
                <div className="text-sm text-gray-600">Needs Revision</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{progressPercentage}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </Card>
          </div>
        )}

        {/* Progress Bar */}
        {milestones.length > 0 && (
          <Card>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-mint-navy">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-mint-navy h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">
                {stats.accepted} of {stats.total} milestones accepted
              </p>
            </div>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading milestones..." />
          </div>
        ) : milestones.length === 0 ? (
          <EmptyState
            title="No milestones yet"
            description="You haven't submitted any milestones yet. Start your internship journey by submitting your first milestone."
            action={
              <Button variant="primary" onClick={() => setShowNewForm(true)}>
                Submit First Milestone
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {milestones.map((milestone) => (
              <Card key={milestone.milestone_id}>
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

                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{milestone.description}</p>

                  {milestone.attachment_name && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      <span className="text-sm text-blue-800 font-medium">{milestone.attachment_name}</span>
                    </div>
                  )}

                  {milestone.feedback && (
                    <div className={`border-l-4 rounded-lg p-4 ${
                      milestone.status === 'accepted' ? 'bg-green-50 border-green-500' :
                      milestone.status === 'pending_revision' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-red-50 border-red-500'
                    }`}>
                      <p className={`text-sm font-medium mb-1 ${
                        milestone.status === 'accepted' ? 'text-green-900' :
                        milestone.status === 'pending_revision' ? 'text-yellow-900' :
                        'text-red-900'
                      }`}>
                        Supervisor Feedback:
                      </p>
                      <p className={`text-sm ${
                        milestone.status === 'accepted' ? 'text-green-800' :
                        milestone.status === 'pending_revision' ? 'text-yellow-800' :
                        'text-red-800'
                      }`}>
                        {milestone.feedback}
                      </p>
                      {milestone.reviewed_at && (
                        <p className={`text-xs mt-2 ${
                          milestone.status === 'accepted' ? 'text-green-600' :
                          milestone.status === 'pending_revision' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          Reviewed: {formatDateTime(milestone.reviewed_at)}
                        </p>
                      )}
                    </div>
                  )}

                  {milestone.status === 'pending_revision' && !milestone.locked && (
                    <div className="pt-4 border-t flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleEditMilestone(milestone)}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit and Resubmit
                      </Button>
                      <div className="flex-1 bg-yellow-50 p-2 rounded-lg">
                        <p className="text-xs text-yellow-800">
                          ⚠️ Please address the supervisor's feedback and resubmit
                        </p>
                      </div>
                    </div>
                  )}

                  {milestone.locked && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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

        {/* Edit Milestone Modal */}
        <Modal
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setSelectedMilestone(null);
          }}
          title="Edit and Resubmit Milestone"
          size="lg"
        >
          {selectedMilestone && (
            <MilestoneSubmissionForm 
              milestone={selectedMilestone}
              onSuccess={handleSuccess}
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
