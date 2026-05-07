// Login page (FR-AUTH-001 to FR-AUTH-008)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card } from '../components/common';
import { mockAuthService, MOCK_CREDENTIALS } from '../services/mock-auth.service';
import { useAuthStore } from '../store/auth.store';
import { APP_NAME } from '../constants';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(true);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{APP_NAME}</h1>
          <p className="mt-2 text-gray-600">Ministry of Innovation and Technology</p>
          <p className="text-sm text-gray-500">Internship Management System</p>
        </div>

        {/* Demo Credentials Card */}
        {showCredentials && (
          <Card>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-900">🎭 Demo Credentials</h3>
                <button
                  onClick={() => setShowCredentials(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-600">Click any role to auto-fill credentials:</p>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(MOCK_CREDENTIALS).map(([key, cred]) => (
                  <button
                    key={key}
                    onClick={() => handleQuickLogin(key as keyof typeof MOCK_CREDENTIALS)}
                    className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <p className="text-xs font-semibold text-gray-900">{cred.role}</p>
                    <p className="text-xs text-gray-600 truncate">{cred.email}</p>
                    <p className="text-xs text-gray-500">Pass: {cred.password}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {!showCredentials && (
          <button
            onClick={() => setShowCredentials(true)}
            className="w-full text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Show demo credentials
          </button>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
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
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            ⚠️ This is a demo version with mock authentication
          </p>
          <p className="text-xs text-gray-600">
            Ministry of Innovation and Technology © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
