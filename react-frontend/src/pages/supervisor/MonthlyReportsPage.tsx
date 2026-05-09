// Supervisor - Monthly Reports Review Page (SDD §5.3.5)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button, Textarea, EmptyState, StatusBadge, Modal } from '../../components/common';
import { MonthlyReport, MonthlyReportStatus } from '../../types/monthly-report.types';
import { monthlyReportService } from '../../services/monthly-report.service';
import { useAuthStore } from '../../store/auth.store';

export default function SupervisorMonthlyReportsPage() {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MonthlyReport | null>(null);
  const [feedback, setFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState<MonthlyReportStatus>(MonthlyReportStatus.REVIEWED);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      if (user?.user_id) {
        const data = await monthlyReportService.getSupervisorReports(user.user_id);
        setReports(data.sort((a, b) => {
          // Sort by status (submitted first), then by date
          const statusOrder = { submitted: 0, reviewed: 1, approved: 2, returned: 3 };
          const statusDiff = statusOrder[a.status] - statusOrder[b.status];
          if (statusDiff !== 0) return statusDiff;
          return b.year - a.year || b.month - a.month;
        }));
      }
    } catch (error) {
      setError('Failed to load monthly reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = (report: MonthlyReport) => {
    setSelectedReport(report);
    setFeedback(report.feedback || '');
    setReviewStatus(MonthlyReportStatus.REVIEWED);
    setShowReviewModal(true);
    setError('');
    setSuccess('');
  };

  const handleSubmitReview = async () => {
    if (!selectedReport) return;

    if (reviewStatus === MonthlyReportStatus.RETURNED && !feedback.trim()) {
      setError('Feedback is required when returning a report');
      return;
    }

    try {
      setIsSubmitting(true);
      await monthlyReportService.reviewReport({
        report_id: selectedReport.report_id,
        status: reviewStatus,
        feedback: feedback.trim() || undefined,
      });
      setSuccess('Report reviewed successfully');
      setShowReviewModal(false);
      setSelectedReport(null);
      setFeedback('');
      loadReports();
    } catch (error) {
      setError('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMonthName = (month: number): string => {
    return new Date(2000, month - 1).toLocaleString('default', { month: 'long' });
  };

  const pendingCount = reports.filter(r => r.status === MonthlyReportStatus.SUBMITTED).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Monthly Reports Review</h1>
            <p className="text-gray-600 mt-1">Review and provide feedback on student monthly reports</p>
          </div>
          {pendingCount > 0 && (
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md font-medium">
              {pendingCount} Pending Review
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {reports.length === 0 ? (
          <EmptyState
            title="No Reports to Review"
            description="No monthly reports have been submitted by your students yet."
          />
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.report_id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.student_name}</h3>
                    <p className="text-sm text-gray-600">
                      {getMonthName(report.month)} {report.year}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(report.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={report.status} />
                    {report.status === MonthlyReportStatus.SUBMITTED && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReview(report)}
                      >
                        Review
                      </Button>
                    )}
                    {report.status !== MonthlyReportStatus.SUBMITTED && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReview(report)}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Progress Summary:</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">
                    {report.summary}
                  </p>
                </div>

                {report.feedback && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-green-900">Your Feedback:</p>
                    <p className="text-sm text-green-800 mt-1">{report.feedback}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        {reports.length > 0 && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Review Summary</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {reports.filter(r => r.status === MonthlyReportStatus.SUBMITTED).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === MonthlyReportStatus.APPROVED).length}
                </div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.status === MonthlyReportStatus.RETURNED).length}
                </div>
                <div className="text-sm text-gray-600">Returned</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Review Monthly Report - ${selectedReport?.student_name}`}
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {getMonthName(selectedReport.month)} {selectedReport.year}
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {selectedReport.summary}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Status <span className="text-red-500">*</span>
              </label>
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value as MonthlyReportStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={selectedReport.status !== MonthlyReportStatus.SUBMITTED}
              >
                <option value={MonthlyReportStatus.REVIEWED}>Reviewed</option>
                <option value={MonthlyReportStatus.APPROVED}>Approved</option>
                <option value={MonthlyReportStatus.RETURNED}>Return for Revision</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback {reviewStatus === MonthlyReportStatus.RETURNED && <span className="text-red-500">*</span>}
              </label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide constructive feedback on the student's progress..."
                rows={6}
                disabled={selectedReport.status !== MonthlyReportStatus.SUBMITTED}
              />
            </div>

            {selectedReport.status === MonthlyReportStatus.SUBMITTED && (
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowReviewModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || (reviewStatus === MonthlyReportStatus.RETURNED && !feedback.trim())}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
