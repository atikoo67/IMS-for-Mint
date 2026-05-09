// Attendance Service - SDD §6.6
import { apiService } from './api.service';
import { mockStorageService } from './mock-storage.service';
import { Attendance, AttendanceInput } from '../types/attendance.types';

const USE_MOCK = true;

class AttendanceService {
  // Get attendance for an internship
  async getAttendance(internshipId: number): Promise<Attendance | null> {
    if (USE_MOCK) {
      return mockStorageService.getAttendance(internshipId);
    }
    const response = await apiService.get<Attendance>(`/attendance/internship/${internshipId}`);
    return response.data;
  }

  // Get all attendance records (supervisor or admin)
  async getAllAttendance(supervisorId?: string): Promise<Attendance[]> {
    if (USE_MOCK) {
      return mockStorageService.getAllAttendance(supervisorId);
    }
    const url = supervisorId ? `/attendance?supervisor_id=${supervisorId}` : '/attendance';
    const response = await apiService.get<Attendance[]>(url);
    return response.data;
  }

  // Record or update attendance (supervisor only)
  async recordAttendance(data: AttendanceInput): Promise<Attendance> {
    if (USE_MOCK) {
      return mockStorageService.recordAttendance(data);
    }
    const response = await apiService.post<Attendance>('/attendance', data);
    return response.data;
  }

  // Update attendance percentage
  async updateAttendance(attendanceId: number, percentage: number): Promise<Attendance> {
    if (USE_MOCK) {
      return mockStorageService.updateAttendance(attendanceId, percentage);
    }
    const response = await apiService.patch<Attendance>(`/attendance/${attendanceId}`, { percentage });
    return response.data;
  }
}

export const attendanceService = new AttendanceService();
