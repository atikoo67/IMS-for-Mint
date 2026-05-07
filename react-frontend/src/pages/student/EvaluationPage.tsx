// Student - Evaluation Page (FR-EVAL-005, FR-EVAL-006)
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, EmptyState } from '../../components/common';
import { Evaluation } from '../../types';
import { evaluationService } from '../../services';
import { formatDateTime } from '../../utils/format';

export default function StudentEvaluationPage() {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvaluation();
  }, []);

  const loadEvaluation = async () => {
    setIsLoading(true);
    try {
      const data = await evaluationService.getMyPublishedEvaluation();
      setEvaluation(data);
    } catch (error) {
      console.error('Failed to load evaluation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Evaluation</h1>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading evaluation..." />
        ) : !evaluation ? (
          <EmptyState
            title="No evaluation yet"
            description="Your final evaluation will appear here once your supervisor submits it and the admin publishes it."
          />
        ) : (
          <>
            {/* Final Grade */}
            <Card>
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 mb-2">Final Grade</p>
                <p className="text-8xl font-bold text-blue-600 mb-4">{evaluation.final_grade}</p>
                <p className="text-sm text-gray-600">
                  Published: {formatDateTime(evaluation.published_at || '')}
                </p>
              </div>
            </Card>

            {/* Rating Breakdown */}
            <Card title="Performance Ratings">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    {evaluation.attendance_rating}/5
                  </p>
                  <p className="text-sm text-gray-700 mt-2">Attendance & Punctuality</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {evaluation.technical_rating}/5
                  </p>
                  <p className="text-sm text-gray-700 mt-2">Technical Performance</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">
                    {evaluation.teamwork_rating}/5
                  </p>
                  <p className="text-sm text-gray-700 mt-2">Teamwork & Collaboration</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">
                    {evaluation.communication_rating}/5
                  </p>
                  <p className="text-sm text-gray-700 mt-2">Communication Skills</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-3xl font-bold text-orange-600">
                    {evaluation.initiative_rating}/5
                  </p>
                  <p className="text-sm text-gray-700 mt-2">Initiative & Conduct</p>
                </div>
              </div>
            </Card>

            {/* Supervisor Remarks */}
            <Card title="Supervisor Remarks">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{evaluation.remarks}</p>
              </div>
            </Card>

            {/* Average Rating */}
            <Card title="Overall Performance">
              <div className="text-center py-6">
                <p className="text-sm text-gray-600 mb-2">Average Rating</p>
                <p className="text-5xl font-bold text-blue-600">
                  {(
                    (evaluation.attendance_rating +
                      evaluation.technical_rating +
                      evaluation.teamwork_rating +
                      evaluation.communication_rating +
                      evaluation.initiative_rating) /
                    5
                  ).toFixed(2)}
                  /5
                </p>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
