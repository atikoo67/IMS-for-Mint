// Evaluation service for Supervisors and Admins
import { apiService } from './api.service';
import { Evaluation, EvaluationFormData, EvaluationStatus } from '../types';
import { mockStorageService } from './mock-storage.service';

// Check if we're in development mode (no backend)
const USE_MOCK_DATA = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK_DATA === 'true';

class EvaluationService {
  // Supervisor: Create evaluation draft (FR-EVAL-001, FR-EVAL-003)
  async saveDraft(studentId: string, formData: EvaluationFormData): Promise<Evaluation> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      const evaluation = mockStorageService.createEvaluation({
        student_id: studentId,
        supervisor_id: 'current_supervisor', // Would come from auth context
        assignment_id: 'assignment_id', // Would be looked up
        ...formData,
        status: EvaluationStatus.DRAFT,
        submitted_at: new Date().toISOString(),
      });
      return evaluation;
    }
    
    const response = await apiService.post<Evaluation>('/evaluations/draft', {
      student_id: studentId,
      ...formData,
    });
    return response.data;
  }

  // Supervisor: Submit evaluation (FR-EVAL-001, FR-EVAL-002)
  async submitEvaluation(studentId: string, formData: EvaluationFormData): Promise<Evaluation> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      const evaluation = mockStorageService.createEvaluation({
        student_id: studentId,
        supervisor_id: 'current_supervisor',
        assignment_id: 'assignment_id',
        ...formData,
        status: EvaluationStatus.SUBMITTED,
        submitted_at: new Date().toISOString(),
      });
      return evaluation;
    }
    
    const response = await apiService.post<Evaluation>('/evaluations', {
      student_id: studentId,
      ...formData,
    });
    return response.data;
  }

  // Supervisor: Get own evaluations
  async getMyEvaluations(): Promise<Evaluation[]> {
    if (USE_MOCK_DATA) {
      // Mock implementation - return all evaluations for demo
      return mockStorageService.getEvaluations();
    }
    
    const response = await apiService.get<Evaluation[]>('/evaluations/my');
    return response.data;
  }

  // Supervisor: Get evaluation for specific student
  async getEvaluationByStudent(studentId: string): Promise<Evaluation | null> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      const evaluations = mockStorageService.getEvaluations();
      return evaluations.find(e => e.student_id === studentId) || null;
    }
    
    try {
      const response = await apiService.get<Evaluation>(`/evaluations/student/${studentId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Admin: Get pending evaluations (FR-EVAL-004)
  async getPendingEvaluations(): Promise<Evaluation[]> {
    if (USE_MOCK_DATA) {
      // Mock implementation - return draft evaluations
      const evaluations = mockStorageService.getEvaluations();
      return evaluations.filter(e => e.status === EvaluationStatus.DRAFT);
    }
    
    const response = await apiService.get<Evaluation[]>('/evaluations/pending');
    return response.data;
  }

  // Admin: Publish evaluation (FR-EVAL-004, FR-EVAL-005)
  async publishEvaluation(evaluationId: string): Promise<Evaluation> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      const evaluation = mockStorageService.updateEvaluation(evaluationId, {
        status: EvaluationStatus.PUBLISHED,
        published_at: new Date().toISOString(),
        published_by: 'admin_1',
      });
      return evaluation;
    }
    
    const response = await apiService.post<Evaluation>(
      `/evaluations/${evaluationId}/publish`
    );
    return response.data;
  }

  // Admin: Return evaluation to supervisor for correction
  async returnForCorrection(evaluationId: string, reason: string): Promise<Evaluation> {
    if (USE_MOCK_DATA) {
      // Mock implementation - just update status back to draft
      const evaluation = mockStorageService.updateEvaluation(evaluationId, {
        status: EvaluationStatus.DRAFT,
      });
      return evaluation;
    }
    
    const response = await apiService.post<Evaluation>(
      `/evaluations/${evaluationId}/return`,
      { reason }
    );
    return response.data;
  }

  // Student/University: Get published evaluation
  async getMyPublishedEvaluation(): Promise<Evaluation | null> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      const evaluations = mockStorageService.getEvaluations();
      return evaluations.find(e => e.status === EvaluationStatus.PUBLISHED) || null;
    }
    
    try {
      const response = await apiService.get<Evaluation>('/evaluations/published/my');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // University: Download grade report (FR-EVAL-006)
  async downloadGradeReport(studentId: string): Promise<Blob> {
    const response = await apiService.get(`/evaluations/student/${studentId}/report`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  }

  // Admin: Generate consolidated grade report (FR-EVAL-007)
  async downloadConsolidatedReport(cohort: string, format: 'pdf' | 'csv'): Promise<Blob> {
    const response = await apiService.get(`/evaluations/cohort/${cohort}/report`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data as Blob;
  }
}

export const evaluationService = new EvaluationService();
