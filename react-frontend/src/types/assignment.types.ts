// Internship assignment types based on SRS
export enum AssignmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

export interface InternshipAssignment {
  assignment_id: string;
  student_id: string;
  student_name: string;
  supervisor_id: string;
  supervisor_name: string;
  start_date: string;
  end_date: string;
  status: AssignmentStatus;
  created_at: string;
}

export interface Supervisor {
  supervisor_id: string;
  user_id: string;
  full_name: string;
  email: string;
  department: string;
  position: string;
  max_students: number;
  current_students: number;
}

export interface AssignmentFormData {
  student_id: string;
  supervisor_id: string;
  start_date: string;
  end_date: string;
}
