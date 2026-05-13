// Admin - Evaluation Publishing Page (FR-EVAL-004 to FR-EVAL-005)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button, EmptyState } from '../../components/common';
import { Evaluation } from '../../types';
import { evaluationService } from '../../services';
import { formatDateTime } from '../../utils/format';

export default function AdminEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    setIsLoading(true);
    try {
      const data = await evaluationService.getPendingEvaluations();
      setEvaluations(data);
    } catch (error) {
      console.error('Failed to load evaluations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (evaluationId: string) => {
    if (!window.confirm('Are you sure you want to publish this evaluation? This action cannot be undone.')) {
      return;
    }

    try {
      await evaluationService.publishEvaluation(evaluationId);
      alert('Evaluation published successfully');
      loadEvaluations();
    } catch (error) {
      alert('Failed to publish evaluation');
    }
  };

  const handleReturnForCorrection = async () => {
    if (!window.confirm('Return this evaluation to the supervisor for corrections?')) {
      return;
    }

    try {
      // In real app, would call API to return evaluation
      alert('Evaluation returned to supervisor for corrections');
      loadEvaluations();
    } catch (error) {
      alert('Failed to return evaluation');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Evaluations</h1>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading evaluations..." />
        ) : evaluations.length === 0 ? (
          <EmptyState
            title="No pending evaluations"
            description="There are no evaluations waiting for review and publication."
          />
        ) : (
          <div className="grid gap-6">
            {evaluations.map((evaluation) => (
              <Card key={evaluation.evaluation_id}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">Student Evaluation</h3>
                      <p className="text-sm text-gray-600">
                        Submitted: {formatDateTime(evaluation.submitted_at || '')}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Pending Review
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y">
                    <div>
                      <p className="text-sm text-gray-600">Attendance</p>
                      <p className="text-lg font-semibold">{evaluation.attendance_rating}/5</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Technical</p>
                      <p className="text-lg font-semibold">{evaluation.technical_rating}/5</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teamwork</p>
                      <p className="text-lg font-semibold">{evaluation.teamwork_rating}/5</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Communication</p>
                      <p className="text-lg font-semibold">{evaluation.communication_rating}/5</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Initiative</p>
                      <p className="text-lg font-semibold">{evaluation.initiative_rating}/5</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Final Grade</p>
                      <p className="text-2xl font-bold text-blue-600">{evaluation.final_grade}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Supervisor Remarks:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {evaluation.remarks}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="primary"
                      onClick={() => handlePublish(evaluation.evaluation_id)}
                    >
                      Publish Evaluation
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={handleReturnForCorrection}
                    >
                      Return for Correction
                    </Button>
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
