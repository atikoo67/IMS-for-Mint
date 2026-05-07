// Evaluation types based on SRS
export enum EvaluationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PUBLISHED = 'published'
}

export enum LetterGrade {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F'
}

export interface Evaluation {
  evaluation_id: string;
  student_id: string;
  supervisor_id: string;
  assignment_id: string;
  attendance_rating: number; // 1-5
  technical_rating: number; // 1-5
  teamwork_rating: number; // 1-5
  communication_rating: number; // 1-5
  initiative_rating: number; // 1-5
  final_grade: LetterGrade;
  remarks: string;
  status: EvaluationStatus;
  submitted_at?: string;
  published_at?: string;
  published_by?: string;
}

export interface EvaluationFormData {
  attendance_rating: number;
  technical_rating: number;
  teamwork_rating: number;
  communication_rating: number;
  initiative_rating: number;
  final_grade: LetterGrade;
  remarks: string;
}
