// Application types based on SRS state machine
export enum ApplicationStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ON_HOLD = 'on_hold'
}

export interface InternshipApplication {
  application_id: string;
  student_id?: string;
  university_id: string;
  student_name: string;
  student_institutional_id: string;
  department: string;
  gpa: number;
  institutional_email: string;
  status: ApplicationStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  hold_comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationDocument {
  document_id: string;
  application_id: string;
  document_type: 'transcript' | 'request_letter' | 'recommendation_letter';
  file_name: string;
  file_path: string;
  file_size_kb: number;
  uploaded_at: string;
}

export interface ApplicationFormData {
  student_name: string;
  student_institutional_id: string;
  department: string;
  gpa: number;
  institutional_email: string;
  transcript: File | null;
  request_letter: File | null;
  recommendation_letter: File | null;
}
