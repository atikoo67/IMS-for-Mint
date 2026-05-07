// Evaluation service for Supervisors and Admins
import { apiService } from './api.service';
import { Evaluation, EvaluationFormData } from '../types';

class EvaluationService {
  // Supervisor: Create evaluation draft (FR-EVAL-001, FR-EVAL-003)
  async saveDraft(studentId: string, formData: EvaluationFormData): Promise<Evaluation> {
    const response = await apiService.post<Evaluation>('/evaluations/draft', {
      student_id: studentId,
      ...formData,
    });
    return response.data;
  }

  // Supervisor: Submit evaluation (FR-EVAL-001, FR-EVAL-002)
  async submitEvaluation(studentId: string, formData: EvaluationFormData): Promise<Evaluation> {
    const response = await apiService.post<Evaluation>('/evaluations', {
      student_id: studentId,
      ...formData,
    });
    return response.data;
  }

  // Supervisor: Get own evaluations
  async getMyEvaluations(): Promise<Evaluation[]> {
    const response = await apiService.get<Evaluation[]>('/evaluations/my');
    return response.data;
  }

  // Supervisor: Get evaluation for specific student
  async getEvaluationByStudent(studentId: string): Promise<Evaluation | null> {
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
    const response = await apiService.get<Evaluation[]>('/evaluations/pending');
    return response.data;
  }

  // Admin: Publish evaluation (FR-EVAL-004, FR-EVAL-005)
  async publishEvaluation(evaluationId: string): Promise<Evaluation> {
    const response = await apiService.post<Evaluation>(
      `/evaluations/${evaluationId}/publish`
    );
    return response.data;
  }

  // Admin: Return evaluation to supervisor for correction
  async returnForCorrection(evaluationId: string, reason: string): Promise<Evaluation> {
    const response = await apiService.post<Evaluation>(
      `/evaluations/${evaluationId}/return`,
      { reason }
    );
    return response.data;
  }

  // Student/University: Get published evaluation
  async getMyPublishedEvaluation(): Promise<Evaluation | null> {
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
