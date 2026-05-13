// Assignment service for Admins
import { apiService } from './api.service';
import { InternshipAssignment, Supervisor, AssignmentFormData } from '../types';
import { mockStorageService } from './mock-storage.service';
import { mockSupervisors } from './mock-data.service';

const USE_MOCK_DATA = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK_DATA === 'true';

class AssignmentService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Admin: Get available supervisors (FR-SUP-001, FR-SUP-002)
  async getAvailableSupervisors(): Promise<Supervisor[]> {
    if (USE_MOCK_DATA) {
      await this.delay(400);
      // Convert mock users to supervisors
      const assignments = mockStorageService.getAssignments();
      return mockSupervisors.map(sup => ({
        supervisor_id: sup.user_id,
        user_id: sup.user_id,
        full_name: sup.full_name,
        email: sup.email,
        department: 'Software Engineering',
        position: 'Senior Supervisor',
        max_students: 5,
        current_students: assignments.filter(a => a.supervisor_id === sup.user_id).length,
      }));
    }
    
    const response = await apiService.get<Supervisor[]>('/supervisors/available');
    return response.data;
  }

  // Admin: Assign supervisor to student (FR-SUP-003, FR-SUP-004)
  async assignSupervisor(data: AssignmentFormData): Promise<InternshipAssignment> {
    if (USE_MOCK_DATA) {
      await this.delay(600);
      
      // Get student and supervisor names
      const students = mockStorageService.getApplications();
      const student = students.find(s => s.student_id === data.student_id);
      const supervisor = mockSupervisors.find(s => s.user_id === data.supervisor_id);
      
      const assignment = mockStorageService.createAssignment({
        student_id: data.student_id,
        student_name: student?.student_name || 'Student',
        supervisor_id: data.supervisor_id,
        supervisor_name: supervisor?.full_name || 'Supervisor',
        start_date: data.start_date || new Date().toISOString(),
        end_date: data.end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active' as any,
        created_at: new Date().toISOString(),
      });
      return assignment;
    }
    
    const response = await apiService.post<InternshipAssignment>('/assignments', data);
    return response.data;
  }

  // Admin: Reassign supervisor (FR-SUP-006)
  async reassignSupervisor(
    assignmentId: string,
    newSupervisorId: string
  ): Promise<InternshipAssignment> {
    if (USE_MOCK_DATA) {
      await this.delay(600);
      const supervisor = mockSupervisors.find(s => s.user_id === newSupervisorId);
      const assignment = mockStorageService.getAssignmentById(assignmentId);
      if (!assignment) throw new Error('Assignment not found');
      
      // In real implementation, would update the assignment
      return {
        ...assignment,
        supervisor_id: newSupervisorId,
        supervisor_name: supervisor?.full_name || 'Supervisor',
      };
    }
    
    const response = await apiService.patch<InternshipAssignment>(
      `/assignments/${assignmentId}/reassign`,
      { supervisor_id: newSupervisorId }
    );
    return response.data;
  }

  // Admin: Mark assignment as completed manually
  async markAsCompleted(assignmentId: string): Promise<InternshipAssignment> {
    if (USE_MOCK_DATA) {
      await this.delay(500);
      const assignment = mockStorageService.getAssignmentById(assignmentId);
      if (!assignment) throw new Error('Assignment not found');
      return { ...assignment, status: 'completed' as any };
    }
    
    const response = await apiService.patch<InternshipAssignment>(
      `/assignments/${assignmentId}/complete`
    );
    return response.data;
  }

  // Get assignment by ID
  async getAssignmentById(assignmentId: string): Promise<InternshipAssignment> {
    if (USE_MOCK_DATA) {
      await this.delay(300);
      const assignment = mockStorageService.getAssignmentById(assignmentId);
      if (!assignment) throw new Error('Assignment not found');
      return assignment;
    }
    
    const response = await apiService.get<InternshipAssignment>(`/assignments/${assignmentId}`);
    return response.data;
  }

  // Student: Get own assignment
  async getMyAssignment(): Promise<InternshipAssignment | null> {
    if (USE_MOCK_DATA) {
      await this.delay(400);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const assignments = mockStorageService.getAssignments();
      return assignments.find(a => a.student_id === currentUser.user_id) || null;
    }
    
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
    if (USE_MOCK_DATA) {
      await this.delay(500);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const assignments = mockStorageService.getAssignments();
      return assignments.filter(a => a.supervisor_id === currentUser.user_id);
    }
    
    const response = await apiService.get<InternshipAssignment[]>('/assignments/my-students');
    return response.data;
  }

  // Admin: Get all assignments
  async getAllAssignments(): Promise<InternshipAssignment[]> {
    if (USE_MOCK_DATA) {
      await this.delay(500);
      return mockStorageService.getAssignments();
    }
    
    const response = await apiService.get<InternshipAssignment[]>('/assignments');
    return response.data;
  }
}

export const assignmentService = new AssignmentService();
