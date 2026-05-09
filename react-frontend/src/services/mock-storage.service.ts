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
import { Attendance, AttendanceInput } from '../types/attendance.types';
import { MonthlyReport, MonthlyReportInput, MonthlyReportReview, MonthlyReportStatus } from '../types/monthly-report.types';
import { mockStudents, mockSupervisors, universities, departments } from './mock-data.service';

// Storage keys
const STORAGE_KEYS = {
  APPLICATIONS: 'mint_ims_applications',
  MILESTONES: 'mint_ims_milestones',
  EVALUATIONS: 'mint_ims_evaluations',
  ASSIGNMENTS: 'mint_ims_assignments',
  ATTENDANCE: 'mint_ims_attendance',
  MONTHLY_REPORTS: 'mint_ims_monthly_reports',
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

// Generate mock applications - ALL 30 students
function generateMockApplications(): InternshipApplication[] {
  const statuses: ApplicationStatus[] = [
    ApplicationStatus.APPROVED,
    ApplicationStatus.APPROVED,
    ApplicationStatus.APPROVED,
    ApplicationStatus.APPROVED,
    ApplicationStatus.APPROVED,
    ApplicationStatus.PENDING,
    ApplicationStatus.PENDING,
    ApplicationStatus.REJECTED,
  ];
  
  const rejectionReasons = [
    'GPA below minimum requirement of 3.0',
    'Incomplete application documents',
    'Failed to meet technical prerequisites',
    'Insufficient recommendation letters',
  ];
  
  return mockStudents.map((student, i) => {
    const universityCode = student.email.split('@')[1].split('.')[0].toUpperCase();
    const university = universities.find(u => u.code === universityCode);
    const status = statuses[i % statuses.length];
    const submittedDate = new Date(2026, 2, 1 + Math.floor(i / 2)); // Spread over March
    const department = departments[i % departments.length];
    
    return {
      application_id: `app_${i + 1}`,
      student_id: student.user_id,
      university_id: university?.id || 'aau',
      student_name: student.full_name,
      student_institutional_id: `STU-2026-${String(i + 1).padStart(3, '0')}`,
      department,
      gpa: status === ApplicationStatus.REJECTED ? 2.5 + Math.random() * 0.4 : 3.0 + Math.random() * 0.9,
      institutional_email: student.email,
      status,
      reviewed_at: status !== ApplicationStatus.PENDING ? new Date(submittedDate.getTime() + 86400000 * (2 + Math.floor(Math.random() * 3))).toISOString() : undefined,
      reviewed_by: status !== ApplicationStatus.PENDING ? (i % 2 === 0 ? 'admin_1' : 'admin_2') : undefined,
      rejection_reason: status === ApplicationStatus.REJECTED ? rejectionReasons[i % rejectionReasons.length] : undefined,
      created_at: submittedDate.toISOString(),
      updated_at: new Date(submittedDate.getTime() + 86400000 * 3).toISOString(),
    };
  });
}

// Generate mock assignments - All approved applications get assignments
function generateMockAssignments(): InternshipAssignment[] {
  const approvedApplications = getFromStorage<InternshipApplication[]>(
    STORAGE_KEYS.APPLICATIONS,
    generateMockApplications()
  ).filter(app => app.status === ApplicationStatus.APPROVED);
  
  return approvedApplications.map((app, i) => {
    const supervisor = mockSupervisors[i % mockSupervisors.length];
    const startDate = new Date(2026, 4, 1); // May 1, 2026
    const endDate = new Date(2026, 7, 31); // August 31, 2026
    
    return {
      assignment_id: `assign_${i + 1}`,
      student_id: app.student_id!,
      student_name: app.student_name,
      supervisor_id: supervisor.user_id,
      supervisor_name: supervisor.full_name,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: AssignmentStatus.ACTIVE,
      created_at: new Date(2026, 3, 25 + Math.floor(i / 2)).toISOString(),
    };
  });
}

// Generate mock milestones - All assignments get full milestone sets
function generateMockMilestones(): Milestone[] {
  const assignments = getFromStorage<InternshipAssignment[]>(
    STORAGE_KEYS.ASSIGNMENTS,
    generateMockAssignments()
  );
  
  const milestones: Milestone[] = [];
  const milestoneTemplates = [
    { phase: 1, title: 'Orientation & Setup', description: 'Complete orientation and development environment setup' },
    { phase: 2, title: 'System Analysis Report', description: 'Complete system requirements analysis and documentation' },
    { phase: 3, title: 'Database Design', description: 'Design and document database schema with ER diagrams' },
    { phase: 4, title: 'Backend API Development', description: 'Implement REST API endpoints and business logic' },
    { phase: 5, title: 'Frontend Integration', description: 'Build user interface components and integrate with API' },
    { phase: 6, title: 'Testing & QA', description: 'Comprehensive testing, bug fixes, and quality assurance' },
    { phase: 7, title: 'Documentation', description: 'Complete technical and user documentation' },
    { phase: 8, title: 'Final Presentation', description: 'Present completed project to stakeholders' },
  ];
  
  assignments.forEach((assignment, assignIdx) => {
    milestoneTemplates.forEach((template, milestoneIdx) => {
      const dueDate = new Date(2026, 4, 8 + (milestoneIdx * 10)); // Every 10 days
      
      // Vary milestone status based on assignment progress
      let status: MilestoneStatus;
      let isSubmitted: boolean;
      let feedback: string | undefined;
      
      if (assignIdx < 3) {
        // First 3 assignments: Advanced progress
        if (milestoneIdx < 5) {
          status = MilestoneStatus.ACCEPTED;
          isSubmitted = true;
          feedback = 'Excellent work! All requirements met with high quality.';
        } else if (milestoneIdx === 5) {
          status = MilestoneStatus.PENDING_REVIEW;
          isSubmitted = true;
        } else {
          // Don't create milestones that haven't been submitted yet
          return;
        }
      } else if (assignIdx < 8) {
        // Next 5 assignments: Medium progress
        if (milestoneIdx < 3) {
          status = MilestoneStatus.ACCEPTED;
          isSubmitted = true;
          feedback = 'Good work! Meets all requirements.';
        } else if (milestoneIdx === 3) {
          status = MilestoneStatus.PENDING_REVIEW;
          isSubmitted = true;
        } else if (milestoneIdx === 4) {
          status = MilestoneStatus.PENDING_REVISION;
          isSubmitted = true;
          feedback = 'Please address the following: Add more detailed error handling and improve code documentation.';
        } else {
          // Don't create milestones that haven't been submitted yet
          return;
        }
      } else {
        // Remaining assignments: Early progress
        if (milestoneIdx < 2) {
          status = MilestoneStatus.ACCEPTED;
          isSubmitted = true;
          feedback = 'Good start! Keep up the momentum.';
        } else if (milestoneIdx === 2) {
          status = MilestoneStatus.PENDING_REVIEW;
          isSubmitted = true;
        } else {
          // Don't create milestones that haven't been submitted yet
          return;
        }
      }
      
      milestones.push({
        milestone_id: `milestone_${assignIdx + 1}_${milestoneIdx + 1}`,
        assignment_id: assignment.assignment_id,
        student_id: assignment.student_id,
        title: template.title,
        description: isSubmitted 
          ? `Completed ${template.title}. ${template.description}` 
          : template.description,
        submission_date: isSubmitted 
          ? new Date(dueDate.getTime() - 86400000 * Math.floor(Math.random() * 3)).toISOString() 
          : dueDate.toISOString(),
        status,
        feedback,
        locked: status === MilestoneStatus.ACCEPTED,
        reviewed_at: [MilestoneStatus.ACCEPTED, MilestoneStatus.PENDING_REVISION].includes(status) 
          ? new Date(dueDate.getTime() + 86400000 * 2).toISOString() 
          : undefined,
      });
    });
  });
  
  return milestones;
}

// Generate mock evaluations - More evaluations with varied data
function generateMockEvaluations(): Evaluation[] {
  const assignments = getFromStorage<InternshipAssignment[]>(
    STORAGE_KEYS.ASSIGNMENTS,
    generateMockAssignments()
  );
  
  const grades: LetterGrade[] = [LetterGrade.A, LetterGrade.A, LetterGrade.B, LetterGrade.B, LetterGrade.C];
  const remarks = [
    'Excellent performance throughout the internship period. Shows great potential and initiative.',
    'Very good work ethic and technical skills. Consistently met deadlines and quality standards.',
    'Good performance with room for improvement in communication and teamwork.',
    'Satisfactory performance. Completed assigned tasks but could show more initiative.',
    'Adequate performance. Needs improvement in technical skills and time management.',
  ];
  
  return assignments.slice(0, 12).map((assignment, i) => {
    const grade = grades[i % grades.length];
    const isDraft = i >= 8; // Last 4 are drafts
    
    return {
      evaluation_id: `eval_${i + 1}`,
      assignment_id: assignment.assignment_id,
      student_id: assignment.student_id,
      supervisor_id: assignment.supervisor_id,
      attendance_rating: 3 + Math.floor(Math.random() * 3), // 3-5
      technical_rating: 3 + Math.floor(Math.random() * 3), // 3-5
      teamwork_rating: 3 + Math.floor(Math.random() * 3), // 3-5
      communication_rating: 3 + Math.floor(Math.random() * 3), // 3-5
      initiative_rating: 3 + Math.floor(Math.random() * 3), // 3-5
      final_grade: grade,
      remarks: remarks[i % remarks.length],
      status: isDraft ? EvaluationStatus.DRAFT : EvaluationStatus.PUBLISHED,
      submitted_at: new Date(2026, 7, 15 + i).toISOString(),
      published_at: isDraft ? undefined : new Date(2026, 7, 20 + i).toISOString(),
    };
  });
}

// Generate mock attendance records - All assignments get attendance
function generateMockAttendance(): Attendance[] {
  const assignments = getFromStorage<InternshipAssignment[]>(
    STORAGE_KEYS.ASSIGNMENTS,
    generateMockAssignments()
  );
  
  return assignments.map((assignment, i) => {
    const student = mockStudents.find(s => s.user_id === assignment.student_id);
    const supervisor = mockSupervisors.find(s => s.user_id === assignment.supervisor_id);
    
    // Vary attendance percentages realistically
    let percentage: number;
    if (i < 5) {
      percentage = 90 + Math.floor(Math.random() * 11); // 90-100% (Excellent)
    } else if (i < 12) {
      percentage = 75 + Math.floor(Math.random() * 15); // 75-89% (Good)
    } else if (i < 16) {
      percentage = 60 + Math.floor(Math.random() * 15); // 60-74% (Fair)
    } else {
      percentage = 50 + Math.floor(Math.random() * 10); // 50-59% (Poor)
    }
    
    return {
      attendance_id: i + 1,
      internship_id: i + 1,
      student_id: assignment.student_id,
      percentage,
      marked_by: assignment.supervisor_id,
      updated_at: new Date(2026, 7, 10 + Math.floor(i / 3)).toISOString(),
      student_name: student?.full_name || assignment.student_name,
      supervisor_name: supervisor?.full_name || assignment.supervisor_name,
    };
  });
}

// Generate mock monthly reports - All assignments get monthly reports
function generateMockMonthlyReports(): MonthlyReport[] {
  const assignments = getFromStorage<InternshipAssignment[]>(
    STORAGE_KEYS.ASSIGNMENTS,
    generateMockAssignments()
  );
  
  const reports: MonthlyReport[] = [];
  const months = [5, 6, 7]; // May, June, July 2026
  
  const summaryTemplates = [
    'Completed orientation and initial project setup. Familiarized with codebase and development tools. Met with team members and established communication channels.',
    'Made significant progress on assigned tasks. Completed database schema design and began API development. Attended weekly team meetings and code reviews.',
    'Successfully implemented core features and resolved several technical challenges. Improved code quality based on supervisor feedback. Prepared for mid-term presentation.',
  ];
  
  const feedbackTemplates = [
    'Good start! Keep up the momentum and don\'t hesitate to ask questions.',
    'Excellent progress. Your technical skills are developing well. Continue focusing on code quality.',
    'Outstanding work this month. You\'re exceeding expectations. Keep it up!',
    'Good effort, but please improve documentation and code comments.',
    'Satisfactory progress. Need to see more initiative and proactive communication.',
  ];
  
  assignments.forEach((assignment, assignIdx) => {
    const student = mockStudents.find(s => s.user_id === assignment.student_id);
    const supervisor = mockSupervisors.find(s => s.user_id === assignment.supervisor_id);
    
    months.forEach((month, monthIdx) => {
      // Vary status based on assignment and month
      let status: MonthlyReportStatus;
      if (assignIdx < 8) {
        // First 8 assignments: All months submitted and reviewed
        if (monthIdx === 0) {
          status = MonthlyReportStatus.APPROVED;
        } else if (monthIdx === 1) {
          status = MonthlyReportStatus.APPROVED;
        } else {
          status = assignIdx < 4 ? MonthlyReportStatus.APPROVED : MonthlyReportStatus.REVIEWED;
        }
      } else if (assignIdx < 14) {
        // Next 6 assignments: Some pending
        if (monthIdx === 0) {
          status = MonthlyReportStatus.APPROVED;
        } else if (monthIdx === 1) {
          status = MonthlyReportStatus.REVIEWED;
        } else {
          status = MonthlyReportStatus.SUBMITTED;
        }
      } else {
        // Remaining: Early stage
        if (monthIdx === 0) {
          status = MonthlyReportStatus.APPROVED;
        } else if (monthIdx === 1) {
          status = assignIdx % 2 === 0 ? MonthlyReportStatus.SUBMITTED : MonthlyReportStatus.RETURNED;
        } else {
          status = MonthlyReportStatus.SUBMITTED;
        }
      }
      
      const hasReview = status !== MonthlyReportStatus.SUBMITTED;
      
      reports.push({
        report_id: assignIdx * 3 + monthIdx + 1,
        internship_id: assignIdx + 1,
        student_id: assignment.student_id,
        month,
        year: 2026,
        summary: summaryTemplates[monthIdx] + ` Worked on ${departments[assignIdx % departments.length]} related tasks and gained valuable hands-on experience.`,
        submitted_at: new Date(2026, month - 1, 25 + Math.floor(Math.random() * 4)).toISOString(),
        reviewed_by: hasReview ? assignment.supervisor_id : undefined,
        reviewer_name: hasReview ? supervisor?.full_name : undefined,
        status,
        feedback: hasReview ? feedbackTemplates[assignIdx % feedbackTemplates.length] : undefined,
        student_name: student?.full_name || assignment.student_name,
      });
    });
  });
  
  return reports;
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
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    saveToStorage(STORAGE_KEYS.ATTENDANCE, generateMockAttendance());
  }
  if (!localStorage.getItem(STORAGE_KEYS.MONTHLY_REPORTS)) {
    saveToStorage(STORAGE_KEYS.MONTHLY_REPORTS, generateMockMonthlyReports());
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
  
  // Attendance
  getAttendance(internshipId: number): Attendance | null {
    const allAttendance = getFromStorage<Attendance[]>(STORAGE_KEYS.ATTENDANCE, []);
    return allAttendance.find(a => a.internship_id === internshipId) || null;
  }
  
  getAllAttendance(supervisorId?: string): Attendance[] {
    const allAttendance = getFromStorage<Attendance[]>(STORAGE_KEYS.ATTENDANCE, []);
    if (supervisorId) {
      return allAttendance.filter(a => a.marked_by === supervisorId);
    }
    return allAttendance;
  }
  
  recordAttendance(data: AttendanceInput): Attendance {
    const allAttendance = getFromStorage<Attendance[]>(STORAGE_KEYS.ATTENDANCE, []);
    const existing = allAttendance.find(a => a.internship_id === data.internship_id);
    
    if (existing) {
      // Update existing
      return this.updateAttendance(existing.attendance_id, data.percentage);
    }
    
    // Create new
    const student = mockStudents.find(s => s.user_id === data.student_id);
    const assignments = this.getAssignments();
    const assignment = assignments.find(a => a.student_id === data.student_id);
    const supervisor = mockSupervisors.find(s => s.user_id === assignment?.supervisor_id);
    
    const newAttendance: Attendance = {
      attendance_id: allAttendance.length + 1,
      internship_id: data.internship_id,
      student_id: data.student_id,
      percentage: Math.max(0, Math.min(100, data.percentage)), // Clamp 0-100
      marked_by: assignment?.supervisor_id || '',
      updated_at: new Date().toISOString(),
      student_name: student?.full_name,
      supervisor_name: supervisor?.full_name,
    };
    
    allAttendance.push(newAttendance);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, allAttendance);
    return newAttendance;
  }
  
  updateAttendance(attendanceId: number, percentage: number): Attendance {
    const allAttendance = getFromStorage<Attendance[]>(STORAGE_KEYS.ATTENDANCE, []);
    const index = allAttendance.findIndex(a => a.attendance_id === attendanceId);
    if (index === -1) throw new Error('Attendance record not found');
    
    allAttendance[index] = {
      ...allAttendance[index],
      percentage: Math.max(0, Math.min(100, percentage)), // Clamp 0-100
      updated_at: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.ATTENDANCE, allAttendance);
    return allAttendance[index];
  }
  
  // Monthly Reports
  getStudentMonthlyReports(studentId: string): MonthlyReport[] {
    const allReports = getFromStorage<MonthlyReport[]>(STORAGE_KEYS.MONTHLY_REPORTS, []);
    return allReports.filter(r => r.student_id === studentId);
  }
  
  getInternshipMonthlyReports(internshipId: number): MonthlyReport[] {
    const allReports = getFromStorage<MonthlyReport[]>(STORAGE_KEYS.MONTHLY_REPORTS, []);
    return allReports.filter(r => r.internship_id === internshipId);
  }
  
  getSupervisorMonthlyReports(supervisorId: string): MonthlyReport[] {
    const allReports = getFromStorage<MonthlyReport[]>(STORAGE_KEYS.MONTHLY_REPORTS, []);
    const assignments = this.getAssignments().filter(a => a.supervisor_id === supervisorId);
    const studentIds = assignments.map(a => a.student_id);
    return allReports.filter(r => studentIds.includes(r.student_id));
  }
  
  submitMonthlyReport(data: MonthlyReportInput): MonthlyReport {
    const allReports = getFromStorage<MonthlyReport[]>(STORAGE_KEYS.MONTHLY_REPORTS, []);
    
    // Check for duplicate (unique: internship_id, month, year)
    const existing = allReports.find(
      r => r.internship_id === data.internship_id && r.month === data.month && r.year === data.year
    );
    if (existing) {
      throw new Error('Monthly report already exists for this period');
    }
    
    const student = mockStudents.find(s => s.user_id === data.student_id);
    
    const newReport: MonthlyReport = {
      report_id: allReports.length + 1,
      internship_id: data.internship_id,
      student_id: data.student_id,
      month: data.month,
      year: data.year,
      summary: data.summary,
      submitted_at: new Date().toISOString(),
      status: MonthlyReportStatus.SUBMITTED,
      student_name: student?.full_name,
    };
    
    allReports.push(newReport);
    saveToStorage(STORAGE_KEYS.MONTHLY_REPORTS, allReports);
    return newReport;
  }
  
  reviewMonthlyReport(data: MonthlyReportReview): MonthlyReport {
    const allReports = getFromStorage<MonthlyReport[]>(STORAGE_KEYS.MONTHLY_REPORTS, []);
    const index = allReports.findIndex(r => r.report_id === data.report_id);
    if (index === -1) throw new Error('Monthly report not found');
    
    const assignments = this.getAssignments();
    const assignment = assignments.find(a => a.student_id === allReports[index].student_id);
    const supervisor = mockSupervisors.find(s => s.user_id === assignment?.supervisor_id);
    
    allReports[index] = {
      ...allReports[index],
      status: data.status,
      feedback: data.feedback,
      reviewed_by: assignment?.supervisor_id,
      reviewer_name: supervisor?.full_name,
    };
    
    saveToStorage(STORAGE_KEYS.MONTHLY_REPORTS, allReports);
    return allReports[index];
  }
  
  // Reset all data
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.MILESTONES);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.MONTHLY_REPORTS);
    initializeStorage();
  }
}

export const mockStorageService = new MockStorageService();
