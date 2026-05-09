// Supervisor - Attendance Tracking Page (SDD §6.6)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button, EmptyState } from '../../components/common';
import { Attendance } from '../../types/attendance.types';
import { attendanceService } from '../../services/attendance.service';
import { useAuthStore } from '../../store/auth.store';

export default function SupervisorAttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    loadAttendance();
  }, [user]);

  const loadAttendance = async () => {
    try {
      setIsLoading(true);
      const data = await attendanceService.getAllAttendance(user?.user_id);
      setAttendance(data);
    } catch (error) {
      setError('Failed to load attendance records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (record: Attendance) => {
    setEditingId(record.attendance_id);
    setEditValue(record.percentage);
    setError('');
    setSuccess('');
  };

  const handleSave = async (attendanceId: number) => {
    try {
      if (editValue < 0 || editValue > 100) {
        setError('Attendance percentage must be between 0 and 100');
        return;
      }

      await attendanceService.updateAttendance(attendanceId, editValue);
      setSuccess('Attendance updated successfully');
      setEditingId(null);
      loadAttendance();
    } catch (error) {
      setError('Failed to update attendance');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue(0);
  };

  const getAttendanceColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceStatus = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Fair';
    return 'Poor';
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
            <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
            <p className="text-gray-600 mt-1">Record and manage student attendance percentages</p>
          </div>
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

        {attendance.length === 0 ? (
          <EmptyState
            title="No Attendance Records"
            description="No students assigned yet or attendance not recorded."
          />
        ) : (
          <div className="grid gap-4">
            {attendance.map((record) => (
              <Card key={record.attendance_id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{record.student_name}</h3>
                    <p className="text-sm text-gray-600">Internship ID: {record.internship_id}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date(record.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    {editingId === record.attendance_id ? (
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <label className="text-xs text-gray-600 mb-1">Percentage</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editValue}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex gap-2 mt-5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSave(record.attendance_id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getAttendanceColor(record.percentage)}`}>
                            {record.percentage}%
                          </div>
                          <div className="text-sm text-gray-600">
                            {getAttendanceStatus(record.percentage)}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(record)}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Attendance Guidelines */}
                {editingId === record.attendance_id && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800 font-medium">Attendance Guidelines:</p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1">
                      <li>• 90-100%: Excellent attendance</li>
                      <li>• 75-89%: Good attendance</li>
                      <li>• 60-74%: Fair attendance</li>
                      <li>• Below 60%: Poor attendance</li>
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        {attendance.length > 0 && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Attendance Summary</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{attendance.length}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {attendance.filter(a => a.percentage >= 90).length}
                </div>
                <div className="text-sm text-gray-600">Excellent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {attendance.filter(a => a.percentage >= 75 && a.percentage < 90).length}
                </div>
                <div className="text-sm text-gray-600">Good</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {attendance.filter(a => a.percentage < 75).length}
                </div>
                <div className="text-sm text-gray-600">Needs Attention</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
