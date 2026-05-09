// Mock Storage Service - In-memory database for demo
// This simulates a backend database with localStorage persistence

import { 
  InternshipApplication,
  ApplicationStatus,
  Milestone,
  MilestoneStatus,
  Evaluation,
  EvaluationStatus,
  LetterGrade,
  InternshipAssignment,
  AssignmentStatus
} from '../types';
import { mockStudents, mockSupervisors, universities, departments } from './mock-data.service';

// Storage keys
const STORAGE_KEYS = {
  APPLICATIONS: 'mint_ims_applications',
  MILESTONES: 'mint_ims_milestones',
  EVALUATIONS: 'mint_ims_evaluations',
  ASSIGNMENTS: 'mint_ims_assignments',
};

// Helper to get from localStorage with fallback
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Helper to save to localStorage
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Generate mock applications
function generateMockApplications(): InternshipApplication[] {
  const statuses: ApplicationStatus[] = [ApplicationStatus.PENDING, ApplicationStatus.APPROVED, ApplicationStatus.REJECTED];
  
  return mockStudents.slice(0, 20).map((student, i) => {
    const universityCode = student.email.split('@')[1].split('.')[0].toUpperCase();
    const university = universities.find(u => u.code === universityCode);
    const status = statuses[i % 3];
    const submittedDate = new Date(2026, 3, 1 + i);
    const department = departments[i % departments.length];
    
    return {
      application_id: `app_${i + 1}`,
      student_id: student.user_id,
      university_id: university?.id || 'aau',
      student_name: student.full_name,
      student_institutional_id: `STU-2026-${String(i + 1).padStart(3, '0')}`,
      department,
      gpa: 3.0 + Math.random() * 0.9,
      institutional_email: student.email,
      status,
      reviewed_at: status !== ApplicationStatus.PENDING ? new Date(submittedDate.getTime() + 86400000 * 2).toISOString() : undefined,
      reviewed_by: status !== ApplicationStatus.PENDING ? 'admin_1' : undefined,
      rejection_reason: status === ApplicationStatus.REJECTED ? 'GPA below minimum requirement' : undefined,
      created_at: submittedDate.toISOString(),
      updated_at: submittedDate.toISOString(),
    };
  });
}

// Generate mock assignments
function generateMockAssignments(): InternshipAssignment[] {
  const approvedApplications = getFromStorage<InternshipApplication[]>(
    STORAGE_KEYS.APPLICATIONS,
    generateMockApplications()
  ).filter(app => app.status === ApplicationStatus.APPROVED);
  
  return approvedApplications.slice(0, 10).map((app, i) => {
    const supervisor = mockSupervisors[i % mockSupervisors.length];
    const startDate = new Date(2026, 4, 1);
    const endDate = new Date(2026, 7, 31);
    
    return {
      assignment_id: `assign_${i + 1}`,
      student_id: app.student_id!,
      student_name: app.student_name,
      supervisor_id: supervisor.user_id,
      supervisor_name: supervisor.full_name,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: AssignmentStatus.ACTIVE,
      created_at: new Date(2026, 3, 25 + i).toISOString(),
    };
  });
}

// Generate mock milestones
// Generate mock milestones
function generateMockMilestones(): Milestone[] {
  const assignments = getFromStorage<InternshipAssignment[]>(
    STORAGE_KEYS.ASSIGNMENTS,
    generateMockAssignments()
  );
  
  const milestones: Milestone[] = [];
  const milestoneTemplates = [
    { phase: 1, title: 'System Analysis Report', description: 'Complete system requirements analysis' },
    { phase: 2, title: 'Database Design', description: 'Design and document database schema' },
    { phase: 3, title: 'Backend API Development', description: 'Implement REST API endpoints' },
    { phase: 4, title: 'Frontend Integration', description: 'Build user interface components' },
    { phase: 5, title: 'Testing & QA', description: 'Comprehensive testing and bug fixes' },
    { phase: 6, title: 'Final Presentation', description: 'Present completed project' },
  ];
  
  assignments.forEach((assignment, assignIdx) => {
    milestoneTemplates.forEach((template, milestoneIdx) => {
      const dueDate = new Date(2026, 4, 15 + (milestoneIdx * 14));
      const isSubmitted = milestoneIdx < 3; // First 3 milestones submitted
      const status = milestoneIdx === 0 ? MilestoneStatus.ACCEPTED :
                    milestoneIdx === 1 ? MilestoneStatus.ACCEPTED :
                    milestoneIdx === 2 ? MilestoneStatus.PENDING_REVIEW :
                    MilestoneStatus.PENDING_REVIEW;
      
      milestones.push({
        milestone_id: `milestone_${assignIdx}_${milestoneIdx + 1}`,
        assignment_id: assignment.assignment_id,
        student_id: assignment.student_id,
        title: template.title,
        description: isSubmitted ? `Completed ${template.title}. All requirements met.` : template.description,
        submission_date: isSubmitted ? new Date(dueDate.getTime() - 86400000).toISOString() : dueDate.toISOString(),
        status,
        feedback: status === MilestoneStatus.ACCEPTED ? 'Good work! Meets all requirements.' : undefined,
        locked: status === MilestoneStatus.ACCEPTED,
        reviewed_at: status === MilestoneStatus.ACCEPTED ? new Date(dueDate.getTime() + 86400000).toISOString() : undefined,
      });
    });
  });
  
  return milestones;
}

// Generate mock evaluations
function generateMockEvaluations(): Evaluation[] {
  const assignments = getFromStorage<InternshipAssignment[]>(
    STORAGE_KEYS.ASSIGNMENTS,
    generateMockAssignments()
  );
  
  return assignments.slice(0, 5).map((assignment, i) => {
    const grades: LetterGrade[] = [LetterGrade.A, LetterGrade.B, LetterGrade.C];
    const grade = grades[i % grades.length];
    
    return {
      evaluation_id: `eval_${i + 1}`,
      assignment_id: assignment.assignment_id,
      student_id: assignment.student_id,
      supervisor_id: assignment.supervisor_id,
      attendance_rating: 4 + Math.floor(Math.random() * 2),
      technical_rating: 3 + Math.floor(Math.random() * 3),
      teamwork_rating: 4 + Math.floor(Math.random() * 2),
      communication_rating: 3 + Math.floor(Math.random() * 3),
      initiative_rating: 3 + Math.floor(Math.random() * 3),
      final_grade: grade,
      remarks: 'Excellent performance throughout the internship period. Shows great potential.',
      status: i < 2 ? EvaluationStatus.PUBLISHED : EvaluationStatus.DRAFT,
      submitted_at: new Date(2026, 7, 20 + i).toISOString(),
      published_at: i < 2 ? new Date(2026, 7, 25 + i).toISOString() : undefined,
    };
  });
}

// Initialize storage with mock data if empty
function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    saveToStorage(STORAGE_KEYS.APPLICATIONS, generateMockApplications());
  }
  if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, generateMockAssignments());
  }
  if (!localStorage.getItem(STORAGE_KEYS.MILESTONES)) {
    saveToStorage(STORAGE_KEYS.MILESTONES, generateMockMilestones());
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVALUATIONS)) {
    saveToStorage(STORAGE_KEYS.EVALUATIONS, generateMockEvaluations());
  }
}

// Mock Storage Service
class MockStorageService {
  constructor() {
    initializeStorage();
  }
  
  // Applications
  getApplications(): InternshipApplication[] {
    return getFromStorage(STORAGE_KEYS.APPLICATIONS, []);
  }
  
  getApplicationById(id: string): InternshipApplication | undefined {
    return this.getApplications().find(app => app.application_id === id);
  }
  
  createApplication(application: Omit<InternshipApplication, 'application_id'>): InternshipApplication {
    const applications = this.getApplications();
    const newApp: InternshipApplication = {
      ...application,
      application_id: `app_${Date.now()}`,
    };
    applications.push(newApp);
    saveToStorage(STORAGE_KEYS.APPLICATIONS, applications);
    return newApp;
  }
  
  updateApplication(id: string, updates: Partial<InternshipApplication>): InternshipApplication {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.application_id === id);
    if (index === -1) throw new Error('Application not found');
    
    applications[index] = { ...applications[index], ...updates };
    saveToStorage(STORAGE_KEYS.APPLICATIONS, applications);
    return applications[index];
  }
  
  // Assignments
  getAssignments(): InternshipAssignment[] {
    return getFromStorage(STORAGE_KEYS.ASSIGNMENTS, []);
  }
  
  getAssignmentById(id: string): InternshipAssignment | undefined {
    return this.getAssignments().find(assign => assign.assignment_id === id);
  }
  
  createAssignment(assignment: Omit<InternshipAssignment, 'assignment_id'>): InternshipAssignment {
    const assignments = this.getAssignments();
    const newAssignment: InternshipAssignment = {
      ...assignment,
      assignment_id: `assign_${Date.now()}`,
    };
    assignments.push(newAssignment);
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return newAssignment;
  }
  
  // Milestones
  getMilestones(): Milestone[] {
    return getFromStorage(STORAGE_KEYS.MILESTONES, []);
  }
  
  getMilestoneById(id: string): Milestone | undefined {
    return this.getMilestones().find(m => m.milestone_id === id);
  }
  
  updateMilestone(id: string, updates: Partial<Milestone>): Milestone {
    const milestones = this.getMilestones();
    const index = milestones.findIndex(m => m.milestone_id === id);
    if (index === -1) throw new Error('Milestone not found');
    
    milestones[index] = { ...milestones[index], ...updates };
    saveToStorage(STORAGE_KEYS.MILESTONES, milestones);
    return milestones[index];
  }
  
  // Evaluations
  getEvaluations(): Evaluation[] {
    return getFromStorage(STORAGE_KEYS.EVALUATIONS, []);
  }
  
  getEvaluationById(id: string): Evaluation | undefined {
    return this.getEvaluations().find(evaluation => evaluation.evaluation_id === id);
  }
  
  createEvaluation(evaluation: Omit<Evaluation, 'evaluation_id'>): Evaluation {
    const evaluations = this.getEvaluations();
    const newEval: Evaluation = {
      ...evaluation,
      evaluation_id: `eval_${Date.now()}`,
    };
    evaluations.push(newEval);
    saveToStorage(STORAGE_KEYS.EVALUATIONS, evaluations);
    return newEval;
  }
  
  updateEvaluation(id: string, updates: Partial<Evaluation>): Evaluation {
    const evaluations = this.getEvaluations();
    const index = evaluations.findIndex(evaluation => evaluation.evaluation_id === id);
    if (index === -1) throw new Error('Evaluation not found');
    
    evaluations[index] = { ...evaluations[index], ...updates };
    saveToStorage(STORAGE_KEYS.EVALUATIONS, evaluations);
    return evaluations[index];
  }
  
  // Reset all data
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.MILESTONES);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
    initializeStorage();
  }
}

export const mockStorageService = new MockStorageService();
