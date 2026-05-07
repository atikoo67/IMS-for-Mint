// University User - Applications Page (FR-APP-001 to FR-APP-008)
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ApplicationForm } from '../../components/university';
import { LoadingSpinner, Card, Button, StatusBadge, Modal } from '../../components/common';
import { InternshipApplication } from '../../types';
import { applicationService } from '../../services';
import { formatDate } from '../../utils/format';

export default function UniversityApplicationsPage() {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowNewForm(false);
    loadApplications();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Internship Applications</h1>
          <Button variant="primary" onClick={() => setShowNewForm(true)}>
            + New Application
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading applications..." />
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <Card key={application.application_id}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{application.student_name}</h3>
                      <p className="text-sm text-gray-600">{application.institutional_email}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Student ID:</span>
                      <p className="font-medium">{application.student_institutional_id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <p className="font-medium">{application.department}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">GPA:</span>
                      <p className="font-medium">{application.gpa.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <p className="font-medium">{formatDate(application.created_at)}</p>
                    </div>
                  </div>

                  {application.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{application.rejection_reason}</p>
                    </div>
                  )}

                  {application.hold_comment && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-orange-800 mb-1">
                        Additional Information Requested:
                      </p>
                      <p className="text-sm text-orange-700">{application.hold_comment}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* New Application Modal */}
        <Modal
          isOpen={showNewForm}
          onClose={() => setShowNewForm(false)}
          title="New Internship Application"
          size="xl"
        >
          <ApplicationForm onSuccess={handleSuccess} />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
