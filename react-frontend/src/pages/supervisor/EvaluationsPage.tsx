// Supervisor - Evaluations Page (FR-EVAL-001 to FR-EVAL-003)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button, EmptyState } from '../../components/common';
import { Evaluation, InternshipAssignment } from '../../types';
import { evaluationService, assignmentService } from '../../services';

export default function SupervisorEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [completedStudents, setCompletedStudents] = useState<InternshipAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [evaluationsData, studentsData] = await Promise.all([
        evaluationService.getMyEvaluations(),
        assignmentService.getMyAssignedStudents(),
      ]);
      setEvaluations(evaluationsData);
      setCompletedStudents(studentsData.filter((s) => s.status === 'completed'));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Evaluations</h1>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading evaluations..." />
        ) : (
          <>
            {/* Students Awaiting Evaluation */}
            {completedStudents.length > 0 && (
              <Card title="Students Awaiting Evaluation">
                <div className="space-y-4">
                  {completedStudents.map((student) => (
                    <div
                      key={student.assignment_id}
                      className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{student.student_name}</h3>
                        <p className="text-sm text-gray-600">
                          Internship completed - Evaluation required
                        </p>
                      </div>
                      <Button variant="primary">Submit Evaluation</Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Submitted Evaluations */}
            <Card title="Submitted Evaluations">
              {evaluations.length === 0 ? (
                <EmptyState
                  title="No evaluations yet"
                  description="You haven't submitted any evaluations yet."
                />
              ) : (
                <div className="space-y-4">
                  {evaluations.map((evaluation) => (
                    <div
                      key={evaluation.evaluation_id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Student Evaluation</h3>
                          <p className="text-sm text-gray-600">
                            Final Grade: <span className="font-bold">{evaluation.final_grade}</span>
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            evaluation.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : evaluation.status === 'submitted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {evaluation.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Attendance</p>
                          <p className="font-medium">{evaluation.attendance_rating}/5</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Technical</p>
                          <p className="font-medium">{evaluation.technical_rating}/5</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Teamwork</p>
                          <p className="font-medium">{evaluation.teamwork_rating}/5</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Communication</p>
                          <p className="font-medium">{evaluation.communication_rating}/5</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Initiative</p>
                          <p className="font-medium">{evaluation.initiative_rating}/5</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
