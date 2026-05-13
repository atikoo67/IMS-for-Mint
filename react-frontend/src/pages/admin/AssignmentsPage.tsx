// Admin - Supervisor Assignment Page (FR-SUP-001 to FR-SUP-007)
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, Card, Button, Modal, Select, EmptyState } from '../../components/common';
import { InternshipAssignment, AssignmentStatus } from '../../types';
import { assignmentService } from '../../services';
import { formatDate } from '../../utils/format';
import { mockSupervisors, mockStudents } from '../../services/mock-data.service';
import { mockStorageService } from '../../services/mock-storage.service';

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<InternshipAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<InternshipAssignment | null>(null);
  
  // Form state - Support multiple students
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get unassigned students (approved applications without assignments)
  const unassignedStudents = mockStudents.filter(student => {
    const hasApplication = mockStorageService.getApplications().some(
      app => app.student_id === student.user_id && app.status === 'approved'
    );
    const hasAssignment = assignments.some(assign => assign.student_id === student.user_id);
    return hasApplication && !hasAssignment;
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const assignmentsData = await assignmentService.getAllAssignments();
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSupervisorStats = () => {
    return mockSupervisors.map(supervisor => {
      const assignedCount = assignments.filter(a => a.supervisor_id === supervisor.user_id).length;
      return {
        ...supervisor,
        current_students: assignedCount,
        max_students: 5, // Default max
      };
    });
  };

  const handleAssignSupervisor = async () => {
    if (selectedStudents.length === 0 || !selectedSupervisor) {
      alert('Please select at least one student and a supervisor');
      return;
    }

    // Check supervisor capacity
    const supervisor = mockSupervisors.find(s => s.user_id === selectedSupervisor);
    if (!supervisor) {
      alert('Supervisor not found');
      return;
    }

    const currentLoad = assignments.filter(a => a.supervisor_id === selectedSupervisor).length;
    const maxCapacity = 5;
    
    if (currentLoad + selectedStudents.length > maxCapacity) {
      alert(`Cannot assign ${selectedStudents.length} students. Supervisor has ${maxCapacity - currentLoad} slots available.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const successfulAssignments: string[] = [];
      
      for (const studentId of selectedStudents) {
        const student = mockStudents.find(s => s.user_id === studentId);
        
        if (!student) {
          console.error(`Student ${studentId} not found`);
          continue;
        }

        mockStorageService.createAssignment({
          student_id: student.user_id,
          student_name: student.full_name,
          supervisor_id: supervisor.user_id,
          supervisor_name: supervisor.full_name,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
          status: 'active' as any,
          created_at: new Date().toISOString(),
        });
        
        successfulAssignments.push(student.full_name);
      }

      alert(`Successfully assigned ${successfulAssignments.length} student(s) to ${supervisor.full_name}:\n${successfulAssignments.join('\n')}`);
      setShowAssignModal(false);
      setSelectedStudents([]);
      setSelectedSupervisor('');
      loadData();
    } catch (error) {
      alert('Failed to create assignments');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReassign = async () => {
    if (!selectedAssignment || !selectedSupervisor) {
      alert('Please select a supervisor');
      return;
    }

    setIsSubmitting(true);
    try {
      const supervisor = mockSupervisors.find(s => s.user_id === selectedSupervisor);
      if (!supervisor) {
        throw new Error('Supervisor not found');
      }

      // Update assignment (in real app, would call API)
      alert(`Would reassign ${selectedAssignment.student_name} to ${supervisor.full_name}`);
      setShowReassignModal(false);
      setSelectedAssignment(null);
      setSelectedSupervisor('');
      loadData();
    } catch (error) {
      alert('Failed to reassign supervisor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTerminateAssignment = (assignment: InternshipAssignment) => {
    if (window.confirm(`Are you sure you want to terminate the assignment for ${assignment.student_name}?`)) {
      // Update assignment status to completed
      setAssignments(assignments.map(a => 
        a.assignment_id === assignment.assignment_id 
          ? { ...a, status: AssignmentStatus.COMPLETED }
          : a
      ));
      
      alert(`✅ Assignment for ${assignment.student_name} terminated successfully!`);
    }
  };

  const supervisorStats = getSupervisorStats();

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supervisor Assignments</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage student-supervisor pairings and workload distribution
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setShowAssignModal(true)}
            disabled={unassignedStudents.length === 0}
          >
            + Assign Supervisor
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{assignments.length}</div>
              <div className="text-sm text-gray-600">Total Assignments</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {assignments.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{mockSupervisors.length}</div>
              <div className="text-sm text-gray-600">Supervisors</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{unassignedStudents.length}</div>
              <div className="text-sm text-gray-600">Unassigned Students</div>
            </div>
          </Card>
        </div>

        {/* Supervisor Capacity Overview */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Supervisor Capacity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supervisorStats.map((supervisor) => (
              <div key={supervisor.user_id} className="p-4 border border-gray-200 rounded-lg">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">{supervisor.full_name}</h3>
                  <p className="text-sm text-gray-600">{supervisor.email}</p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-600">Students:</span>
                    <span className="font-medium">
                      {supervisor.current_students} / {supervisor.max_students}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        supervisor.current_students >= supervisor.max_students
                          ? 'bg-red-600'
                          : supervisor.current_students >= supervisor.max_students * 0.8
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                      style={{
                        width: `${Math.min((supervisor.current_students / supervisor.max_students) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {supervisor.current_students >= supervisor.max_students
                      ? 'At capacity'
                      : `${supervisor.max_students - supervisor.current_students} slots available`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Assignments */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Assignments</h2>
          {assignments.length === 0 ? (
            <EmptyState
              title="No assignments yet"
              description="Start by assigning supervisors to approved students"
            />
          ) : (
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
                    <tr key={assignment.assignment_id} className="hover:bg-gray-50">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowReassignModal(true);
                          }}
                        >
                          Reassign
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => handleTerminateAssignment(assignment)}
                        >
                          Terminate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Assign Supervisor Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedStudents([]);
          setSelectedSupervisor('');
        }}
        title="Assign Supervisor to Students"
      >
        <div className="space-y-4">
          {/* Student Selection with Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Students <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto p-3 space-y-2">
              {unassignedStudents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No unassigned students available
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <input
                      type="checkbox"
                      id="select-all-students"
                      checked={selectedStudents.length === unassignedStudents.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(unassignedStudents.map(s => s.user_id));
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="select-all-students" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Select All ({unassignedStudents.length})
                    </label>
                  </div>
                  {unassignedStudents.map((student) => (
                    <div key={student.user_id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`student-${student.user_id}`}
                        checked={selectedStudents.includes(student.user_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.user_id]);
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== student.user_id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label 
                        htmlFor={`student-${student.user_id}`}
                        className="text-sm text-gray-700 cursor-pointer flex-1"
                      >
                        {student.full_name}
                        <span className="text-gray-500 ml-2">({student.email})</span>
                      </label>
                    </div>
                  ))}
                </>
              )}
            </div>
            {selectedStudents.length > 0 && (
              <p className="text-sm text-blue-600 mt-2">
                {selectedStudents.length} student(s) selected
              </p>
            )}
          </div>

          <Select
            label="Select Supervisor"
            value={selectedSupervisor}
            onChange={(e) => setSelectedSupervisor(e.target.value)}
            required
          >
            <option value="">-- Select Supervisor --</option>
            {supervisorStats.map((supervisor) => {
              const availableSlots = supervisor.max_students - supervisor.current_students;
              const canAccommodate = availableSlots >= selectedStudents.length;
              
              return (
                <option 
                  key={supervisor.user_id} 
                  value={supervisor.user_id}
                  disabled={!canAccommodate}
                >
                  {supervisor.full_name} ({supervisor.current_students}/{supervisor.max_students})
                  {!canAccommodate && selectedStudents.length > 0 
                    ? ` - Only ${availableSlots} slot(s) available` 
                    : supervisor.current_students >= supervisor.max_students 
                    ? ' - At Capacity' 
                    : ''}
                </option>
              );
            })}
          </Select>

          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The assignments will start immediately and last for 90 days by default.
              {selectedStudents.length > 0 && selectedSupervisor && (
                <>
                  <br />
                  <strong>Assigning {selectedStudents.length} student(s)</strong> to the selected supervisor.
                </>
              )}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowAssignModal(false);
                setSelectedStudents([]);
                setSelectedSupervisor('');
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAssignSupervisor}
              isLoading={isSubmitting}
              disabled={selectedStudents.length === 0 || !selectedSupervisor}
            >
              Assign {selectedStudents.length > 0 ? `${selectedStudents.length} Student(s)` : 'Students'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reassign Supervisor Modal */}
      <Modal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        title="Reassign Supervisor"
      >
        <div className="space-y-4">
          {selectedAssignment && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Student:</strong> {selectedAssignment.student_name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Current Supervisor:</strong> {selectedAssignment.supervisor_name}
              </p>
            </div>
          )}

          <Select
            label="New Supervisor"
            value={selectedSupervisor}
            onChange={(e) => setSelectedSupervisor(e.target.value)}
            required
          >
            <option value="">-- Select New Supervisor --</option>
            {supervisorStats
              .filter(s => s.user_id !== selectedAssignment?.supervisor_id)
              .map((supervisor) => (
                <option 
                  key={supervisor.user_id} 
                  value={supervisor.user_id}
                  disabled={supervisor.current_students >= supervisor.max_students}
                >
                  {supervisor.full_name} ({supervisor.current_students}/{supervisor.max_students})
                  {supervisor.current_students >= supervisor.max_students && ' - At Capacity'}
                </option>
              ))}
          </Select>

          <div className="p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Reassigning will notify both the current and new supervisor.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowReassignModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleReassign}
              isLoading={isSubmitting}
              disabled={!selectedSupervisor}
            >
              Reassign Supervisor
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
