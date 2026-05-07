// Assignment service for Admins
import { apiService } from './api.service';
import { InternshipAssignment, Supervisor, AssignmentFormData } from '../types';

class AssignmentService {
  // Admin: Get available supervisors (FR-SUP-001, FR-SUP-002)
  async getAvailableSupervisors(): Promise<Supervisor[]> {
    const response = await apiService.get<Supervisor[]>('/supervisors/available');
    return response.data;
  }

  // Admin: Assign supervisor to student (FR-SUP-003, FR-SUP-004)
  async assignSupervisor(data: AssignmentFormData): Promise<InternshipAssignment> {
    const response = await apiService.post<InternshipAssignment>('/assignments', data);
    return response.data;
  }

  // Admin: Reassign supervisor (FR-SUP-006)
  async reassignSupervisor(
    assignmentId: string,
    newSupervisorId: string
  ): Promise<InternshipAssignment> {
    const response = await apiService.patch<InternshipAssignment>(
      `/assignments/${assignmentId}/reassign`,
      { supervisor_id: newSupervisorId }
    );
    return response.data;
  }

  // Admin: Mark assignment as completed manually
  async markAsCompleted(assignmentId: string): Promise<InternshipAssignment> {
    const response = await apiService.patch<InternshipAssignment>(
      `/assignments/${assignmentId}/complete`
    );
    return response.data;
  }

  // Get assignment by ID
  async getAssignmentById(assignmentId: string): Promise<InternshipAssignment> {
    const response = await apiService.get<InternshipAssignment>(`/assignments/${assignmentId}`);
    return response.data;
  }

  // Student: Get own assignment
  async getMyAssignment(): Promise<InternshipAssignment | null> {
    try {
      const response = await apiService.get<InternshipAssignment>('/assignments/my');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Supervisor: Get assigned students (FR-SUP-005)
  async getMyAssignedStudents(): Promise<InternshipAssignment[]> {
    const response = await apiService.get<InternshipAssignment[]>('/assignments/my-students');
    return response.data;
  }

  // Admin: Get all assignments
  async getAllAssignments(): Promise<InternshipAssignment[]> {
    const response = await apiService.get<InternshipAssignment[]>('/assignments');
    return response.data;
  }
}

export const assignmentService = new AssignmentService();
