// Mock Authentication Service for Testing
// This simulates a backend API without requiring a real server

import { User, UserRole, UserStatus, AuthResponse } from '../types';

// Mock user database
const MOCK_USERS: Array<User & { password: string }> = [
  {
    user_id: 'admin-001',
    email: 'admin@mint.gov.et',
    password: 'admin123', // In production, this would be hashed
    full_name: 'System Administrator',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 'uni-001',
    email: 'university@example.edu.et',
    password: 'uni123',
    full_name: 'University Coordinator - Addis Ababa University',
    role: UserRole.UNIVERSITY,
    status: UserStatus.ACTIVE,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 'super-001',
    email: 'supervisor@mint.gov.et',
    password: 'super123',
    full_name: 'John Supervisor - Software Development',
    role: UserRole.SUPERVISOR,
    status: UserStatus.ACTIVE,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 'student-001',
    email: 'student@example.edu.et',
    password: 'student123',
    full_name: 'Jane Student (STU-2024-001)',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
    created_at: '2024-01-01T00:00:00Z',
  },
];

class MockAuthService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate network delay
    await this.delay(800);

    // Find user by email
    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status === UserStatus.LOCKED) {
      throw new Error('Account is locked. Please contact administrator.');
    }

    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Generate mock JWT token
    const token = `mock-jwt-token-${user.user_id}-${Date.now()}`;

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Store token in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    return {
      token,
      user: userWithoutPassword,
      expiresIn: 3600, // 1 hour in seconds
    };
  }

  async logout(): Promise<void> {
    await this.delay(300);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.delay(500);
    // Mock implementation - in real app, this would validate and update password
    console.log('Password change simulated');
  }
}

export const mockAuthService = new MockAuthService();

// Export mock credentials for reference
export const MOCK_CREDENTIALS = {
  admin: {
    email: 'admin@mint.gov.et',
    password: 'admin123',
    role: 'Admin',
  },
  university: {
    email: 'university@example.edu.et',
    password: 'uni123',
    role: 'University Coordinator',
  },
  supervisor: {
    email: 'supervisor@mint.gov.et',
    password: 'super123',
    role: 'Supervisor',
  },
  student: {
    email: 'student@example.edu.et',
    password: 'student123',
    role: 'Student',
  },
};
