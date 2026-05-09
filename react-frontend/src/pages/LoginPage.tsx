// Login page (FR-AUTH-001 to FR-AUTH-008) - MInT IMS Design System
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, EthiopianFlag } from '../components/common';
import { mockAuthService, MOCK_CREDENTIALS } from '../services/mock-auth.service';
import { useAuthStore } from '../store/auth.store';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await mockAuthService.login(email, password);
      setUser(response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: keyof typeof MOCK_CREDENTIALS) => {
    const credentials = MOCK_CREDENTIALS[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'bg-mint-light/25 text-[#93C5FD]';
      case 'ROLE_UNIVERSITY':
        return 'bg-eth-green/20 text-[#6EE7B7]';
      case 'ROLE_SUPERVISOR':
        return 'bg-eth-yellow/20 text-[#FCD34D]';
      case 'ROLE_STUDENT':
        return 'bg-white/8 text-white/50';
      default:
        return 'bg-white/8 text-white/50';
    }
  };

  const getRoleDotColor = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'bg-mint-light';
      case 'ROLE_UNIVERSITY':
        return 'bg-[#6EE7B7]';
      case 'ROLE_SUPERVISOR':
        return 'bg-eth-yellow';
      case 'ROLE_STUDENT':
        return 'bg-white/35';
      default:
        return 'bg-white/35';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-[52%] bg-mint-navy text-white flex-col p-12">
        {/* Ethiopian Flag Stripe */}
        <EthiopianFlag variant="accent" className="mb-8" />

        {/* System Name */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <img 
              src="/assets/images/mint logo6.png" 
              alt="MInT Logo" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-display text-white leading-tight">Internship</h1>
              <h1 className="text-display text-white leading-tight">Management System</h1>
            </div>
          </div>
          <p className="text-xs text-white/50">Ministry of Innovation and Technology</p>
          <p className="text-[10px] text-white/30">Federal Democratic Republic of Ethiopia</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mb-8" />

        {/* System Roles */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase text-white/35 tracking-wider mb-4">
            SYSTEM ROLES
          </p>
          <div className="space-y-3">
            {Object.entries(MOCK_CREDENTIALS).map(([key, cred]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-3 rounded-lg border border-white/7 bg-white/5"
              >
                <div className={`w-2 h-2 rounded-full ${getRoleDotColor(key)}`} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{cred.role}</p>
                  <p className="text-[10px] text-white/40">{cred.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${getRoleBadgeColor(key)}`}>
                  {key}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Ministry Seal Footer */}
        <div className="border border-white/10 rounded-lg p-3 flex items-center gap-3">
          <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div className="flex-1">
            <p className="text-[10px] text-white/50">Government of Ethiopia</p>
            <p className="text-xs text-white/70 font-medium">Version 2.0 · May 2026</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 lg:w-[48%] bg-surface-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img 
              src="/assets/images/mint logo6.png" 
              alt="MInT Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <p className="text-label uppercase text-text-muted mb-2">SECURE SIGN IN</p>
            <h1 className="text-h1 text-mint-navy mb-2">Welcome back</h1>
            <p className="text-body-sm text-text-muted">
              Sign in to access the Internship Management System
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-3 flex gap-2.5">
            <svg className="w-[18px] h-[18px] text-[#D97706] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-[13px] font-semibold text-[#92400E]">Demo Environment</p>
              <p className="text-xs text-[#92400E] mt-0.5">
                This is a demonstration system. Click any role below to auto-fill credentials.
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          {showCredentials && (
            <Card padding="sm">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-body-sm font-semibold text-text-primary">🎭 Quick Login</h3>
                  <button
                    onClick={() => setShowCredentials(false)}
                    className="text-text-muted hover:text-text-primary"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(MOCK_CREDENTIALS).map(([key, cred]) => (
                    <button
                      key={key}
                      onClick={() => handleQuickLogin(key as keyof typeof MOCK_CREDENTIALS)}
                      className="text-left p-2.5 bg-surface-page hover:bg-mint-pale rounded-lg border border-border-default hover:border-mint-blue transition-all"
                    >
                      <p className="text-xs font-semibold text-text-primary">{cred.role}</p>
                      <p className="text-[10px] text-text-muted truncate mt-0.5">{cred.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {!showCredentials && (
            <button
              onClick={() => setShowCredentials(true)}
              className="w-full text-body-sm text-mint-blue hover:text-mint-navy underline"
            >
              Show demo credentials
            </button>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] px-3.5 py-3 rounded-lg flex gap-2.5">
                <svg className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[13px]">{error}</p>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="your.email@example.com"
              leftIcon={
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                leftIcon={
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-text-primary"
                  >
                    {showPassword ? (
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                }
              />
              <div className="text-right mt-2">
                <button type="button" className="text-xs text-mint-blue hover:text-mint-navy">
                  Forgot password?
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Sign in to IMS
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-surface-white text-text-muted">first time here?</span>
            </div>
          </div>

          {/* Auto-provisioning Info */}
          <p className="text-xs text-center text-text-muted">
            Accounts are auto-provisioned by system administrators.
            <br />
            Contact your coordinator for access.
          </p>

          {/* Ethiopian Flag Bottom Decoration */}
          <EthiopianFlag variant="header" className="!h-[3px]" />

          {/* Session Info Pills */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-mint-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-caption text-text-muted">JWT RS256</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-mint-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-caption text-text-muted">8hr session</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-mint-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              <span className="text-caption text-text-muted">On-premise EAT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
