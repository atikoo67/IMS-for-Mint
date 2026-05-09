// Admin - Supervisor Assignment Page (FR-SUP-001 to FR-SUP-007)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button } from '../../components/common';
import { InternshipAssignment, Supervisor } from '../../types';
import { assignmentService } from '../../services';
import { formatDate } from '../../utils/format';

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<InternshipAssignment[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [assignmentsData, supervisorsData] = await Promise.all([
        assignmentService.getAllAssignments(),
        assignmentService.getAvailableSupervisors(),
      ]);
      setAssignments(assignmentsData);
      setSupervisors(supervisorsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading assignments..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Supervisor Assignments</h1>
          <Button variant="primary">Assign New Supervisor</Button>
        </div>

        {/* Supervisor Capacity Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supervisors.map((supervisor) => (
            <Card key={supervisor.supervisor_id}>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">{supervisor.full_name}</h3>
                <p className="text-sm text-gray-600">{supervisor.department}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">Students:</span>
                  <span className="font-medium">
                    {supervisor.current_students} / {supervisor.max_students}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(supervisor.current_students / supervisor.max_students) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Active Assignments */}
        <Card title="Active Assignments">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Supervisor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment.assignment_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assignment.student_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {assignment.supervisor_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(assignment.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(assignment.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          assignment.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button size="sm" variant="secondary">
                        Reassign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
