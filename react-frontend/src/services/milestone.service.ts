// Milestone service for Students and Supervisors
import { apiService } from './api.service';
import { Milestone, MilestoneFormData, MilestoneReviewData, MilestoneStatus } from '../types';
import { mockStorageService } from './mock-storage.service';

// Check if we're in mock mode
const USE_MOCK = true;

class MilestoneService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Student: Submit new milestone (FR-MIL-001 to FR-MIL-003)
  async submitMilestone(formData: MilestoneFormData): Promise<Milestone> {
    if (USE_MOCK) {
      await this.delay(800);
      
      // Find the milestone to update
      const milestones = mockStorageService.getMilestones();
      const milestone = milestones.find(m => 
        m.title === formData.title && m.status === 'pending_review' && !m.locked
      );
      
      if (!milestone) {
        throw new Error('Milestone not found or already submitted');
      }
      
      const updated = mockStorageService.updateMilestone(milestone.milestone_id, {
        status: MilestoneStatus.PENDING_REVIEW,
        submission_date: new Date().toISOString(),
        description: formData.description,
      });
      
      return updated;
    }
    
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
    if (USE_MOCK) {
      await this.delay(800);
      
      const updated = mockStorageService.updateMilestone(milestoneId, {
        description: formData.description,
        submission_date: new Date().toISOString(),
      });
      
      return updated;
    }
    
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
    if (USE_MOCK) {
      await this.delay(600);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const milestones = mockStorageService.getMilestones()
        .filter(m => m.student_id === currentUser.user_id);
      return milestones;
    }
    
    const response = await apiService.get<Milestone[]>('/milestones/my');
    return response.data;
  }

  // Supervisor: Get milestones for assigned students (FR-MIL-006)
  async getMilestonesForMyStudents(): Promise<Milestone[]> {
    if (USE_MOCK) {
      await this.delay(600);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const assignments = mockStorageService.getAssignments()
        .filter(a => a.supervisor_id === currentUser.user_id);
      const studentIds = assignments.map(a => a.student_id);
      const milestones = mockStorageService.getMilestones()
        .filter(m => studentIds.includes(m.student_id));
      return milestones;
    }
    
    const response = await apiService.get<Milestone[]>('/milestones/students');
    return response.data;
  }

  // Supervisor: Get milestones for specific student
  async getMilestonesByStudent(studentId: string): Promise<Milestone[]> {
    if (USE_MOCK) {
      await this.delay(500);
      const milestones = mockStorageService.getMilestones()
        .filter(m => m.student_id === studentId);
      return milestones;
    }
    
    const response = await apiService.get<Milestone[]>(`/milestones/student/${studentId}`);
    return response.data;
  }

  // Supervisor: Review milestone (FR-MIL-007, FR-MIL-008)
  async reviewMilestone(milestoneId: string, reviewData: MilestoneReviewData): Promise<Milestone> {
    if (USE_MOCK) {
      await this.delay(800);
      
      const updated = mockStorageService.updateMilestone(milestoneId, {
        status: reviewData.status,
        feedback: reviewData.feedback,
        locked: reviewData.status === 'accepted',
        reviewed_at: new Date().toISOString(),
      });
      
      return updated;
    }
    
    const response = await apiService.post<Milestone>(
      `/milestones/${milestoneId}/review`,
      reviewData
    );
    return response.data;
  }

  // Get milestone by ID
  async getMilestoneById(milestoneId: string): Promise<Milestone> {
    if (USE_MOCK) {
      await this.delay(400);
      const milestone = mockStorageService.getMilestoneById(milestoneId);
      if (!milestone) throw new Error('Milestone not found');
      return milestone;
    }
    
    const response = await apiService.get<Milestone>(`/milestones/${milestoneId}`);
    return response.data;
  }

  // Download milestone attachment
  async downloadAttachment(milestoneId: string): Promise<Blob> {
    if (USE_MOCK) {
      await this.delay(500);
      return new Blob(['Mock milestone attachment'], { type: 'application/pdf' });
    }
    
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
    if (USE_MOCK) {
      await this.delay(400);
      const milestones = mockStorageService.getMilestones()
        .filter(m => m.student_id === studentId);
      
      return {
        total: milestones.length,
        accepted: milestones.filter(m => m.status === MilestoneStatus.ACCEPTED).length,
        pending_review: milestones.filter(m => m.status === MilestoneStatus.PENDING_REVIEW).length,
        pending_revision: milestones.filter(m => m.status === MilestoneStatus.PENDING_REVISION).length,
        rejected: milestones.filter(m => m.status === MilestoneStatus.REJECTED).length,
      };
    }
    
    const response = await apiService.get(`/milestones/student/${studentId}/summary`);
    return response.data as any;
  }
}

export const milestoneService = new MilestoneService();
