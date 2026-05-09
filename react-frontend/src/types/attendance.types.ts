// Attendance Types - SDD §6.6
export interface Attendance {
  attendance_id: number;
  internship_id: number;
  student_id: string;
  percentage: number; // 0-100
  marked_by: string; // supervisor user_id
  updated_at: string;
  student_name?: string;
  supervisor_name?: string;
}

export interface AttendanceInput {
  internship_id: number;
  student_id: string;
  percentage: number;
}
