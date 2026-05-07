// Authentication state management using Zustand
import { create } from 'zustand';
import { User, UserRole } from '../types';
import { mockAuthService } from '../services/mock-auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: mockAuthService.getCurrentUser(),
  isAuthenticated: mockAuthService.isAuthenticated(),
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  logout: () => {
    mockAuthService.logout();
    set({ user: null, isAuthenticated: false });
  },

  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  },
}));
