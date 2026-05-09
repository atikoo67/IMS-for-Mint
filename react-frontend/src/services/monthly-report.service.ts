// Monthly Report Service - SDD §5.3.5
import { apiService } from './api.service';
import { mockStorageService } from './mock-storage.service';
import { MonthlyReport, MonthlyReportInput, MonthlyReportReview } from '../types/monthly-report.types';

const USE_MOCK = true;

class MonthlyReportService {
  // Get all reports for a student
  async getStudentReports(studentId: string): Promise<MonthlyReport[]> {
    if (USE_MOCK) {
      return mockStorageService.getStudentMonthlyReports(studentId);
    }
    const response = await apiService.get<MonthlyReport[]>(`/monthly-reports/student/${studentId}`);
    return response.data;
  }

  // Get all reports for an internship
  async getInternshipReports(internshipId: number): Promise<MonthlyReport[]> {
    if (USE_MOCK) {
      return mockStorageService.getInternshipMonthlyReports(internshipId);
    }
    const response = await apiService.get<MonthlyReport[]>(`/monthly-reports/internship/${internshipId}`);
    return response.data;
  }

  // Get all reports for supervisor review
  async getSupervisorReports(supervisorId: string): Promise<MonthlyReport[]> {
    if (USE_MOCK) {
      return mockStorageService.getSupervisorMonthlyReports(supervisorId);
    }
    const response = await apiService.get<MonthlyReport[]>(`/monthly-reports/supervisor/${supervisorId}`);
    return response.data;
  }

  // Submit monthly report (student)
  async submitReport(data: MonthlyReportInput): Promise<MonthlyReport> {
    if (USE_MOCK) {
      return mockStorageService.submitMonthlyReport(data);
    }
    const response = await apiService.post<MonthlyReport>('/monthly-reports', data);
    return response.data;
  }

  // Review monthly report (supervisor)
  async reviewReport(data: MonthlyReportReview): Promise<MonthlyReport> {
    if (USE_MOCK) {
      return mockStorageService.reviewMonthlyReport(data);
    }
    const response = await apiService.patch<MonthlyReport>(`/monthly-reports/${data.report_id}/review`, data);
    return response.data;
  }
}

export const monthlyReportService = new MonthlyReportService();
