// Student - Monthly Reports Page (SDD §5.3.5)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button, Textarea, EmptyState, StatusBadge, Modal } from '../../components/common';
import { MonthlyReport } from '../../types/monthly-report.types';
import { monthlyReportService } from '../../services/monthly-report.service';
import { useAuthStore } from '../../store/auth.store';

export default function StudentMonthlyReportsPage() {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState('');
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
        const data = await monthlyReportService.getStudentReports(user.user_id);
        setReports(data.sort((a, b) => b.year - a.year || b.month - a.month));
      }
    } catch (error) {
      setError('Failed to load monthly reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    if (!summary.trim() || summary.length < 100) {
      setError('Summary must be at least 100 characters');
      return;
    }

    // Check if report already exists for this month/year
    const exists = reports.some(r => r.month === selectedMonth && r.year === selectedYear);
    if (exists) {
      setError('Report already submitted for this period');
      return;
    }

    try {
      setIsSubmitting(true);
      await monthlyReportService.submitReport({
        internship_id: 1, // TODO: Get from actual internship assignment
        student_id: user!.user_id,
        month: selectedMonth,
        year: selectedYear,
        summary,
      });
      setSuccess('Monthly report submitted successfully');
      setShowSubmitModal(false);
      setSummary('');
      loadReports();
    } catch (error: any) {
      setError(error.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMonthName = (month: number): string => {
    return new Date(2000, month - 1).toLocaleString('default', { month: 'long' });
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Monthly Progress Reports</h1>
            <p className="text-gray-600 mt-1">Submit and track your monthly internship progress</p>
          </div>
          <Button variant="primary" onClick={() => setShowSubmitModal(true)}>
            Submit New Report
          </Button>
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
            title="No Reports Submitted"
            description="You haven't submitted any monthly reports yet. Click 'Submit New Report' to get started."
          />
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.report_id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getMonthName(report.month)} {report.year}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Submitted: {new Date(report.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.summary}</p>
                </div>

                {report.feedback && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900">Supervisor Feedback:</p>
                    <p className="text-sm text-blue-800 mt-1">{report.feedback}</p>
                    {report.reviewer_name && (
                      <p className="text-xs text-blue-600 mt-2">— {report.reviewer_name}</p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Submit Report Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Monthly Report"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {[2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progress Summary <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe your progress, completed tasks, challenges faced, and learnings from this month... (minimum 100 characters)"
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              {summary.length} / 100 characters minimum
            </p>
          </div>

          <div className="p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Once submitted, you cannot edit the report. Make sure all information is accurate.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowSubmitModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || summary.length < 100}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
