// Student - Dashboard Page (FR-STU-001 to FR-STU-004)
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button } from '../../components/common';
import { InternshipAssignment, Evaluation } from '../../types';
import { assignmentService, evaluationService, milestoneService } from '../../services';
import { formatDate } from '../../utils/format';

export default function StudentDashboardPage() {
  const [assignment, setAssignment] = useState<InternshipAssignment | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [progressSummary, setProgressSummary] = useState({
    total: 0,
    accepted: 0,
    pending_review: 0,
    pending_revision: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const assignmentData = await assignmentService.getMyAssignment();
      setAssignment(assignmentData);

      if (assignmentData) {
        const [evalData, progressData] = await Promise.all([
          evaluationService.getMyPublishedEvaluation(),
          milestoneService.getMyMilestones(),
        ]);
        setEvaluation(evalData);

        // Calculate progress summary
        const summary = {
          total: progressData.length,
          accepted: progressData.filter((m) => m.status === 'accepted').length,
          pending_review: progressData.filter((m) => m.status === 'pending_review').length,
          pending_revision: progressData.filter((m) => m.status === 'pending_revision').length,
          rejected: progressData.filter((m) => m.status === 'rejected').length,
        };
        setProgressSummary(summary);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (!assignment) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to MInT Internship System
            </h2>
            <p className="text-gray-600">
              Your internship assignment will appear here once it's been set up by the administrator.
            </p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Internship Dashboard</h1>

        {/* Internship Details */}
        <Card title="Internship Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Supervisor</p>
              <p className="text-lg font-semibold">{assignment.supervisor_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${
                  assignment.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {assignment.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="text-lg font-semibold">{formatDate(assignment.start_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date</p>
              <p className="text-lg font-semibold">{formatDate(assignment.end_date)}</p>
            </div>
          </div>
        </Card>

        {/* Progress Summary */}
        <Card title="Milestone Progress">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{progressSummary.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Submitted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{progressSummary.accepted}</p>
              <p className="text-sm text-gray-600 mt-1">Accepted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{progressSummary.pending_review}</p>
              <p className="text-sm text-gray-600 mt-1">Pending Review</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {progressSummary.pending_revision}
              </p>
              <p className="text-sm text-gray-600 mt-1">Needs Revision</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{progressSummary.rejected}</p>
              <p className="text-sm text-gray-600 mt-1">Rejected</p>
            </div>
          </div>
        </Card>

        {/* Evaluation */}
        {evaluation && (
          <Card title="Final Evaluation">
            <div className="space-y-4">
              <div className="text-center py-6 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Final Grade</p>
                <p className="text-6xl font-bold text-blue-600">{evaluation.final_grade}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{evaluation.attendance_rating}/5</p>
                  <p className="text-sm text-gray-600">Attendance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{evaluation.technical_rating}/5</p>
                  <p className="text-sm text-gray-600">Technical</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{evaluation.teamwork_rating}/5</p>
                  <p className="text-sm text-gray-600">Teamwork</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{evaluation.communication_rating}/5</p>
                  <p className="text-sm text-gray-600">Communication</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{evaluation.initiative_rating}/5</p>
                  <p className="text-sm text-gray-600">Initiative</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Supervisor Remarks:</p>
                <p className="text-sm text-gray-600">{evaluation.remarks}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" className="w-full">
              Submit New Milestone
            </Button>
            <Button variant="secondary" className="w-full">
              Message Supervisor
            </Button>
            <Button variant="secondary" className="w-full">
              View All Milestones
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
