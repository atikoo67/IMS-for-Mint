// Supervisor - My Students Page (FR-SUP-005) - Enhanced with Modern UI
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, EmptyState, Button, Modal, ToastContainer } from '../../components/common';
import { InternshipAssignment } from '../../types';
import { assignmentService, milestoneService } from '../../services';
import { formatDate } from '../../utils/format';
import { useToast } from '../../hooks/useToast';

export default function SupervisorStudentsPage() {
  const [students, setStudents] = useState<InternshipAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<InternshipAssignment | null>(null);
  const [progressSummary, setProgressSummary] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  
  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await assignmentService.getMyAssignedStudents();
      setStudents(data);
      if (data.length > 0) {
        success(`Loaded ${data.length} assigned student(s)`);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const viewProgress = async (assignment: InternshipAssignment) => {
    setSelectedStudent(assignment);
    setShowProgressModal(true);
    setLoadingProgress(true);
    
    try {
      const summary = await milestoneService.getStudentProgressSummary(assignment.student_id);
      setProgressSummary(summary);
    } catch (err) {
      error('Failed to load progress summary');
      setProgressSummary(null);
    } finally {
      setLoadingProgress(false);
    }
  };

  const getProgressPercentage = () => {
    if (!progressSummary) return 0;
    if (progressSummary.total === 0) return 0;
    return Math.round((progressSummary.accepted / progressSummary.total) * 100);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Assigned Students</h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor and guide your assigned students through their internship journey
            </p>
          </div>
          {students.length > 0 && (
            <div className="text-right">
              <div className="text-3xl font-bold text-mint-navy">{students.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading students..." />
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            title="No assigned students"
            description="You don't have any students assigned to you yet. Students will appear here once the admin assigns them to you."
          />
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {students.filter(s => s.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Internships</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {students.filter(s => s.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {students.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Assigned</div>
                </div>
              </Card>
            </div>

            {/* Students List */}
            <div className="grid gap-4">
              {students.map((assignment) => (
                <Card key={assignment.assignment_id}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-mint-navy text-white flex items-center justify-center text-lg font-bold">
                            {assignment.student_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {assignment.student_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Student ID: {assignment.student_id}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Start Date</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatDate(assignment.start_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">End Date</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatDate(assignment.end_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => viewProgress(assignment)}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Progress
                      </Button>
                      <Button variant="secondary" size="sm">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View Milestones
                      </Button>
                      <Button variant="secondary" size="sm">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Send Message
                      </Button>
                      {assignment.status === 'completed' && (
                        <Button variant="success" size="sm">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Submit Evaluation
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Progress Modal */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setSelectedStudent(null);
          setProgressSummary(null);
        }}
        title={`Progress Summary - ${selectedStudent?.student_name}`}
        size="md"
      >
        {loadingProgress ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Loading progress..." />
          </div>
        ) : progressSummary ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-mint-navy">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-mint-navy h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            {/* Milestone Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{progressSummary.total}</div>
                <div className="text-sm text-gray-600">Total Milestones</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{progressSummary.accepted}</div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{progressSummary.pending_review}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{progressSummary.pending_revision}</div>
                <div className="text-sm text-gray-600">Needs Revision</div>
              </div>
            </div>

            {progressSummary.rejected > 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-red-900">
                      {progressSummary.rejected} Rejected Milestone(s)
                    </div>
                    <div className="text-xs text-red-700">Requires attention and resubmission</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowProgressModal(false);
                  setSelectedStudent(null);
                  setProgressSummary(null);
                }}
              >
                Close
              </Button>
              <Button variant="primary">
                View Detailed Milestones
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No progress data available
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
