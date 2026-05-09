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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-navy via-mint-navy to-[#1e3a5f] relative overflow-hidden p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-mint-light rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-eth-yellow rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Ethiopian Flag */}
        <EthiopianFlag variant="accent" className="mb-6" />

        {/* Main Card */}
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl">
          <div className="space-y-6">
            {/* Logo & Title */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src="/assets/images/mint_logo.png" 
                  alt="MInT Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-mint-navy mb-1">Internship Management System</h1>
              <p className="text-sm text-text-muted">Ministry of Innovation and Technology</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border-subtle" />

            {/* Demo Notice */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-3 flex gap-2.5">
              <svg className="w-[18px] h-[18px] text-[#D97706] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-[#92400E]">Demo Environment</p>
                <p className="text-xs text-[#92400E] mt-0.5">
                  Use quick login buttons below to test different roles
                </p>
              </div>
            </div>

            {/* Quick Login Buttons */}
            {showCredentials && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-muted text-center">Quick Login</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(MOCK_CREDENTIALS).map(([key, cred]) => (
                    <button
                      key={key}
                      onClick={() => handleQuickLogin(key as keyof typeof MOCK_CREDENTIALS)}
                      className="text-left p-3 bg-surface-page hover:bg-mint-pale rounded-lg border border-border-default hover:border-mint-blue transition-all group"
                    >
                      <p className="text-xs font-semibold text-text-primary group-hover:text-mint-navy">{cred.role}</p>
                      <p className="text-[10px] text-text-muted truncate mt-0.5">{cred.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!showCredentials && (
              <button
                onClick={() => setShowCredentials(true)}
                className="w-full text-sm text-mint-blue hover:text-mint-navy underline text-center"
              >
                Show demo credentials
              </button>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-text-muted">or sign in with credentials</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] px-3.5 py-3 rounded-lg flex gap-2.5">
                  <svg className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs">{error}</p>
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
              </div>

              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            {/* Footer Info */}
            <div className="pt-4 border-t border-border-subtle">
              <p className="text-xs text-center text-text-muted mb-3">
                Accounts are provisioned by system administrators
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-mint-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[10px] text-text-muted">Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-mint-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] text-text-muted">8hr session</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Version Footer */}
        <p className="text-center text-xs text-white/60 mt-4">
          Version 2.0 · May 2026
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
