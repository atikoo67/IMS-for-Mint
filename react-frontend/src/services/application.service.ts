// Application service for University Users and Admins
import { apiService } from './api.service';
import { InternshipApplication, ApplicationFormData, ApplicationStatus } from '../types';

class ApplicationService {
  // University User: Submit new application (FR-APP-001 to FR-APP-008)
  async submitApplication(formData: ApplicationFormData): Promise<InternshipApplication> {
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
    const response = await apiService.post<InternshipApplication>('/applications/draft', formData);
    return response.data;
  }

  // University User: Get own applications
  async getMyApplications(): Promise<InternshipApplication[]> {
    const response = await apiService.get<InternshipApplication[]>('/applications/my');
    return response.data;
  }

  // Admin: Get all pending applications (FR-REV-001)
  async getPendingApplications(): Promise<InternshipApplication[]> {
    const response = await apiService.get<InternshipApplication[]>('/applications/pending');
    return response.data;
  }

  // Admin: Get application by ID
  async getApplicationById(applicationId: string): Promise<InternshipApplication> {
    const response = await apiService.get<InternshipApplication>(`/applications/${applicationId}`);
    return response.data;
  }

  // Admin: Approve application (FR-REV-002, FR-REV-003)
  async approveApplication(applicationId: string): Promise<InternshipApplication> {
    const response = await apiService.post<InternshipApplication>(
      `/applications/${applicationId}/approve`
    );
    return response.data;
  }

  // Admin: Reject application (FR-REV-004)
  async rejectApplication(applicationId: string, reason: string): Promise<InternshipApplication> {
    const response = await apiService.post<InternshipApplication>(
      `/applications/${applicationId}/reject`,
      { rejection_reason: reason }
    );
    return response.data;
  }

  // Admin: Place application on hold (FR-REV-005)
  async holdApplication(applicationId: string, comment: string): Promise<InternshipApplication> {
    const response = await apiService.post<InternshipApplication>(
      `/applications/${applicationId}/hold`,
      { hold_comment: comment }
    );
    return response.data;
  }

  // Download document
  async downloadDocument(documentId: string): Promise<Blob> {
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
    const response = await apiService.get('/applications/stats');
    return response.data as any;
  }
}

export const applicationService = new ApplicationService();
