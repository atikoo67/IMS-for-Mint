// Milestone service for Students and Supervisors
import { apiService } from './api.service';
import { Milestone, MilestoneFormData, MilestoneReviewData } from '../types';

class MilestoneService {
  // Student: Submit new milestone (FR-MIL-001 to FR-MIL-003)
  async submitMilestone(formData: MilestoneFormData): Promise<Milestone> {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.attachment) {
      data.append('attachment', formData.attachment);
    }

    const response = await apiService.postFormData<Milestone>('/milestones', data);
    return response.data;
  }

  // Student: Update milestone (FR-MIL-004 - only if Pending Review or Pending Revision)
  async updateMilestone(milestoneId: string, formData: MilestoneFormData): Promise<Milestone> {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.attachment) {
      data.append('attachment', formData.attachment);
    }

    const response = await apiService.postFormData<Milestone>(
      `/milestones/${milestoneId}`,
      data
    );
    return response.data;
  }

  // Student: Get own milestones (FR-MIL-005)
  async getMyMilestones(): Promise<Milestone[]> {
    const response = await apiService.get<Milestone[]>('/milestones/my');
    return response.data;
  }

  // Supervisor: Get milestones for assigned students (FR-MIL-006)
  async getMilestonesForMyStudents(): Promise<Milestone[]> {
    const response = await apiService.get<Milestone[]>('/milestones/students');
    return response.data;
  }

  // Supervisor: Get milestones for specific student
  async getMilestonesByStudent(studentId: string): Promise<Milestone[]> {
    const response = await apiService.get<Milestone[]>(`/milestones/student/${studentId}`);
    return response.data;
  }

  // Supervisor: Review milestone (FR-MIL-007, FR-MIL-008)
  async reviewMilestone(milestoneId: string, reviewData: MilestoneReviewData): Promise<Milestone> {
    const response = await apiService.post<Milestone>(
      `/milestones/${milestoneId}/review`,
      reviewData
    );
    return response.data;
  }

  // Get milestone by ID
  async getMilestoneById(milestoneId: string): Promise<Milestone> {
    const response = await apiService.get<Milestone>(`/milestones/${milestoneId}`);
    return response.data;
  }

  // Download milestone attachment
  async downloadAttachment(milestoneId: string): Promise<Blob> {
    const response = await apiService.get(`/milestones/${milestoneId}/attachment`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  }

  // Supervisor: Get progress summary for student (FR-MIL-009)
  async getStudentProgressSummary(studentId: string): Promise<{
    total: number;
    accepted: number;
    pending_review: number;
    pending_revision: number;
    rejected: number;
  }> {
    const response = await apiService.get(`/milestones/student/${studentId}/summary`);
    return response.data as any;
  }
}

export const milestoneService = new MilestoneService();
