// Application service for University Users and Admins
import { apiService } from './api.service';
import { InternshipApplication, ApplicationFormData, ApplicationStatus } from '../types';
import { mockStorageService } from './mock-storage.service';

// Check if we're in mock mode (no real backend)
const USE_MOCK = true; // Set to false when backend is available

class ApplicationService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // University User: Submit new application (FR-APP-001 to FR-APP-008)
  async submitApplication(formData: ApplicationFormData): Promise<InternshipApplication> {
    if (USE_MOCK) {
      await this.delay(800);
      
      const newApplication = mockStorageService.createApplication({
        student_id: `student_${Date.now()}`,
        university_id: 'aau',
        student_name: formData.student_name,
        student_institutional_id: formData.student_institutional_id,
        department: formData.department,
        gpa: formData.gpa,
        institutional_email: formData.institutional_email,
        status: ApplicationStatus.PENDING,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      return newApplication;
    }
    
    const data = new FormData();
    data.append('student_name', formData.student_name);
    data.append('student_institutional_id', formData.student_institutional_id);
    data.append('department', formData.department);
    data.append('gpa', formData.gpa.toString());
    data.append('institutional_email', formData.institutional_email);
    
    if (formData.transcript) data.append('transcript', formData.transcript);
    if (formData.request_letter) data.append('request_letter', formData.request_letter);
    if (formData.recommendation_letter) data.append('recommendation_letter', formData.recommendation_letter);

    const response = await apiService.postFormData<InternshipApplication>(
      '/applications',
      data
    );
    return response.data;
  }

  // University User: Save application as draft
  async saveDraft(formData: Partial<ApplicationFormData>): Promise<InternshipApplication> {
    if (USE_MOCK) {
      await this.delay(500);
      // Mock implementation
      throw new Error('Draft functionality not yet implemented in mock mode');
    }
    
    const response = await apiService.post<InternshipApplication>('/applications/draft', formData);
    return response.data;
  }

  // University User: Get own applications
  async getMyApplications(): Promise<InternshipApplication[]> {
    if (USE_MOCK) {
      await this.delay(600);
      return mockStorageService.getApplications();
    }
    
    const response = await apiService.get<InternshipApplication[]>('/applications/my');
    return response.data;
  }

  // Admin: Get all pending applications (FR-REV-001)
  async getPendingApplications(): Promise<InternshipApplication[]> {
    if (USE_MOCK) {
      await this.delay(600);
      return mockStorageService.getApplications();
    }
    
    const response = await apiService.get<InternshipApplication[]>('/applications/pending');
    return response.data;
  }

  // Admin: Get application by ID
  async getApplicationById(applicationId: string): Promise<InternshipApplication> {
    if (USE_MOCK) {
      await this.delay(400);
      const app = mockStorageService.getApplicationById(applicationId);
      if (!app) throw new Error('Application not found');
      return app;
    }
    
    const response = await apiService.get<InternshipApplication>(`/applications/${applicationId}`);
    return response.data;
  }

  // Admin: Approve application (FR-REV-002, FR-REV-003)
  async approveApplication(applicationId: string): Promise<InternshipApplication> {
    if (USE_MOCK) {
      await this.delay(800);
      return mockStorageService.updateApplication(applicationId, {
        status: ApplicationStatus.APPROVED,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin_1',
        updated_at: new Date().toISOString(),
      });
    }
    
    const response = await apiService.post<InternshipApplication>(
      `/applications/${applicationId}/approve`
    );
    return response.data;
  }

  // Admin: Reject application (FR-REV-004)
  async rejectApplication(applicationId: string, reason: string): Promise<InternshipApplication> {
    if (USE_MOCK) {
      await this.delay(800);
      return mockStorageService.updateApplication(applicationId, {
        status: ApplicationStatus.REJECTED,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin_1',
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      });
    }
    
    const response = await apiService.post<InternshipApplication>(
      `/applications/${applicationId}/reject`,
      { rejection_reason: reason }
    );
    return response.data;
  }

  // Admin: Place application on hold (FR-REV-005)
  async holdApplication(applicationId: string, comment: string): Promise<InternshipApplication> {
    if (USE_MOCK) {
      await this.delay(800);
      return mockStorageService.updateApplication(applicationId, {
        status: ApplicationStatus.ON_HOLD,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin_1',
        hold_comment: comment,
        updated_at: new Date().toISOString(),
      });
    }
    
    const response = await apiService.post<InternshipApplication>(
      `/applications/${applicationId}/hold`,
      { hold_comment: comment }
    );
    return response.data;
  }

  // Download document
  async downloadDocument(documentId: string): Promise<Blob> {
    if (USE_MOCK) {
      await this.delay(500);
      // Return a mock blob
      return new Blob(['Mock document content'], { type: 'application/pdf' });
    }
    
    const response = await apiService.get(`/documents/${documentId}/download`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  }

  // Admin: Get application statistics
  async getApplicationStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    on_hold: number;
  }> {
    if (USE_MOCK) {
      await this.delay(400);
      const applications = mockStorageService.getApplications();
      return {
        total: applications.length,
        pending: applications.filter(a => a.status === ApplicationStatus.PENDING).length,
        approved: applications.filter(a => a.status === ApplicationStatus.APPROVED).length,
        rejected: applications.filter(a => a.status === ApplicationStatus.REJECTED).length,
        on_hold: applications.filter(a => a.status === ApplicationStatus.ON_HOLD).length,
      };
    }
    
    const response = await apiService.get('/applications/stats');
    return response.data as any;
  }
}

export const applicationService = new ApplicationService();
