// Mock Data Service - Comprehensive test data for MInT IMS
import { User, UserRole, UserStatus } from '../types';

// Ethiopian names for realistic data
const ethiopianFirstNames = [
  'Abebe', 'Almaz', 'Bekele', 'Chaltu', 'Dawit', 'Eleni', 'Fikadu', 'Genet',
  'Haile', 'Hiwot', 'Kidus', 'Liya', 'Meron', 'Nigist', 'Samuel', 'Sara',
  'Tadesse', 'Tigist', 'Yonas', 'Zewdu', 'Biruk', 'Meseret', 'Tesfaye', 'Rahel'
];

const ethiopianLastNames = [
  'Alemu', 'Bekele', 'Gemechu', 'Girma', 'Hailu', 'Kebede', 'Mekonnen', 'Mengistu',
  'Mulugeta', 'Tadesse', 'Tamiru', 'Tesfaye', 'Wolde', 'Yilma', 'Abera', 'Desta'
];

const universities = [
  { id: 'aau', name: 'Addis Ababa University', code: 'AAU' },
  { id: 'ju', name: 'Jimma University', code: 'JU' },
  { id: 'bdu', name: 'Bahir Dar University', code: 'BDU' },
  { id: 'hu', name: 'Hawassa University', code: 'HU' },
  { id: 'mu', name: 'Mekelle University', code: 'MU' },
  { id: 'astu', name: 'Adama Science and Technology University', code: 'ASTU' },
];

const departments = [
  'Software Engineering',
  'Information Technology',
  'Computer Science',
  'Management Information Systems',
  'Electrical Engineering',
  'Data Science',
  'Cyber Security',
  'Network Engineering'
];

// Generate mock students
export const mockStudents: User[] = Array.from({ length: 30 }, (_, i) => {
  const firstName = ethiopianFirstNames[i % ethiopianFirstNames.length];
  const lastName = ethiopianLastNames[Math.floor(i / ethiopianFirstNames.length) % ethiopianLastNames.length];
  const university = universities[i % universities.length];
  
  return {
    user_id: `student_${i + 1}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${university.code.toLowerCase()}.edu.et`,
    full_name: `${firstName} ${lastName}`,
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
    created_at: new Date(2024, 0, 1 + i).toISOString(),
  };
});

// Generate mock supervisors
export const mockSupervisors: User[] = Array.from({ length: 15 }, (_, i) => {
  const firstName = ethiopianFirstNames[(i + 10) % ethiopianFirstNames.length];
  const lastName = ethiopianLastNames[(i + 5) % ethiopianLastNames.length];
  
  return {
    user_id: `supervisor_${i + 1}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mint.gov.et`,
    full_name: `Dr. ${firstName} ${lastName}`,
    role: UserRole.SUPERVISOR,
    status: UserStatus.ACTIVE,
    created_at: new Date(2023, 6, 1 + i).toISOString(),
  };
});

// Generate mock university coordinators
export const mockUniversityUsers: User[] = universities.map((university, i) => {
  const firstName = ethiopianFirstNames[(i + 15) % ethiopianFirstNames.length];
  const lastName = ethiopianLastNames[(i + 8) % ethiopianLastNames.length];
  
  return {
    user_id: `university_${i + 1}`,
    email: `coordinator.${university.code.toLowerCase()}@${university.code.toLowerCase()}.edu.et`,
    full_name: `${firstName} ${lastName}`,
    role: UserRole.UNIVERSITY,
    status: UserStatus.ACTIVE,
    created_at: new Date(2023, 0, 1 + i).toISOString(),
  };
});

// Generate mock admin users
export const mockAdmins: User[] = [
  {
    user_id: 'admin_1',
    email: 'admin@mint.gov.et',
    full_name: 'Abebe Kebede',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    created_at: new Date(2023, 0, 1).toISOString(),
  },
  {
    user_id: 'admin_2',
    email: 'system.admin@mint.gov.et',
    full_name: 'Tigist Mengistu',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    created_at: new Date(2023, 0, 1).toISOString(),
  },
];

// All users combined
export const allMockUsers = [
  ...mockAdmins,
  ...mockStudents,
  ...mockSupervisors,
  ...mockUniversityUsers,
];

// Helper functions
export const getMockUserByEmail = (email: string): User | undefined => {
  return allMockUsers.find(user => user.email === email);
};

export const getMockUserById = (userId: string): User | undefined => {
  return allMockUsers.find(user => user.user_id === userId);
};

export const getMockUsersByRole = (role: UserRole): User[] => {
  return allMockUsers.filter(user => user.role === role);
};

export const getMockStudentsByUniversity = (universityId: string): User[] => {
  // Since we removed university_id from User, we'll use email domain matching
  const universityCode = universities.find(u => u.id === universityId)?.code.toLowerCase();
  if (!universityCode) return [];
  return mockStudents.filter(student => student.email.includes(`@${universityCode}.edu.et`));
};

export const getRandomMockStudent = (): User => {
  return mockStudents[Math.floor(Math.random() * mockStudents.length)];
};

export const getRandomMockSupervisor = (): User => {
  return mockSupervisors[Math.floor(Math.random() * mockSupervisors.length)];
};

// Mock credentials for all users (password is role name + "123")
export const getMockCredentials = () => {
  const credentials: Record<string, { email: string; password: string; role: string }> = {};
  
  // Admin credentials
  mockAdmins.forEach(admin => {
    credentials[admin.email] = {
      email: admin.email,
      password: 'admin123',
      role: 'Admin'
    };
  });
  
  // Student credentials
  mockStudents.forEach(student => {
    credentials[student.email] = {
      email: student.email,
      password: 'student123',
      role: 'Student'
    };
  });
  
  // Supervisor credentials
  mockSupervisors.forEach(supervisor => {
    credentials[supervisor.email] = {
      email: supervisor.email,
      password: 'super123',
      role: 'Supervisor'
    };
  });
  
  // University credentials
  mockUniversityUsers.forEach(uni => {
    credentials[uni.email] = {
      email: uni.email,
      password: 'uni123',
      role: 'University Coordinator'
    };
  });
  
  return credentials;
};

// Export universities and departments for use in forms
export { universities, departments };
