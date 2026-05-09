// Mock Authentication Service for Testing
// This simulates a backend API without requiring a real server

import { User, UserRole, UserStatus, AuthResponse } from '../types';
import { allMockUsers } from './mock-data.service';

// Mock user database with passwords
const MOCK_USERS: Array<User & { password: string }> = allMockUsers.map(user => ({
  ...user,
  status: UserStatus.ACTIVE,
  password: user.role === UserRole.ADMIN ? 'admin123' :
           user.role === UserRole.STUDENT ? 'student123' :
           user.role === UserRole.SUPERVISOR ? 'super123' :
           'uni123'
}));

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

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    await this.delay(500);
    // Mock implementation - in real app, this would validate and update password
    console.log('Password change simulated');
  }
  
  // Get all users (for admin purposes)
  getAllUsers(): User[] {
    return MOCK_USERS.map(({ password, ...user }) => user);
  }
  
  // Get users by role
  getUsersByRole(role: UserRole): User[] {
    return MOCK_USERS
      .filter(u => u.role === role)
      .map(({ password, ...user }) => user);
  }
}

export const mockAuthService = new MockAuthService();

// Export mock credentials for reference (primary test accounts)
export const MOCK_CREDENTIALS = {
  ROLE_ADMIN: {
    email: 'admin@mint.gov.et',
    password: 'admin123',
    role: 'Admin',
  },
  ROLE_UNIVERSITY: {
    email: 'coordinator.aau@aau.edu.et',
    password: 'uni123',
    role: 'University Coordinator',
  },
  ROLE_SUPERVISOR: {
    email: 'kidus.kebede@mint.gov.et',
    password: 'super123',
    role: 'Supervisor',
  },
  ROLE_STUDENT: {
    email: 'abebe.alemu@aau.edu.et',
    password: 'student123',
    role: 'Student',
  },
};

