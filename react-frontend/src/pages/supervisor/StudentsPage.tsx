// Supervisor - My Students Page (FR-SUP-005)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, EmptyState, Button } from '../../components/common';
import { InternshipAssignment } from '../../types';
import { assignmentService, milestoneService } from '../../services';
import { formatDate } from '../../utils/format';

export default function SupervisorStudentsPage() {
  const [students, setStudents] = useState<InternshipAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await assignmentService.getMyAssignedStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewProgress = async (studentId: string) => {
    try {
      const summary = await milestoneService.getStudentProgressSummary(studentId);
      alert(
        `Progress Summary:\nTotal: ${summary.total}\nAccepted: ${summary.accepted}\nPending Review: ${summary.pending_review}\nPending Revision: ${summary.pending_revision}\nRejected: ${summary.rejected}`
      );
    } catch (error) {
      alert('Failed to load progress summary');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Assigned Students</h1>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading students..." />
        ) : students.length === 0 ? (
          <EmptyState
            title="No assigned students"
            description="You don't have any students assigned to you yet."
          />
        ) : (
          <div className="grid gap-6">
            {students.map((assignment) => (
              <Card key={assignment.assignment_id}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{assignment.student_name}</h3>
                      <p className="text-sm text-gray-600">
                        Internship Period: {formatDate(assignment.start_date)} -{' '}
                        {formatDate(assignment.end_date)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        assignment.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => viewProgress(assignment.student_id)}
                    >
                      View Progress
                    </Button>
                    <Button variant="secondary" size="sm">
                      View Milestones
                    </Button>
                    <Button variant="secondary" size="sm">
                      Send Message
                    </Button>
                    {assignment.status === 'completed' && (
                      <Button variant="success" size="sm">
                        Submit Evaluation
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
