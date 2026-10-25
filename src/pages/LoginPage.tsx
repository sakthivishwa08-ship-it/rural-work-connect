import React, { useState } from 'react';
import { LogIn, Lock, Mail, AlertCircle, UserCheck } from 'lucide-react';
import { useApp } from '../lib/store';
import { Button } from '../components/common/Button';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, loginAsDemoUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      onNavigate('worker-dashboard');
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-14">
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Sign In to Rural Work
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Access your bookings, daily jobs, and platform credits
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('password-recovery')}
                className="text-xs text-brand-600 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* 1-Click Fast Demo Logins */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
            Quick 1-Click Testing Accounts
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                loginAsDemoUser('worker');
                onNavigate('worker-dashboard');
              }}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-brand-400 hover:bg-brand-50/50 text-left transition-all"
            >
              <span className="block font-bold text-xs text-gray-900">Ramanathan</span>
              <span className="text-[10px] text-brand-700 font-semibold">Worker (Mason)</span>
            </button>

            <button
              onClick={() => {
                loginAsDemoUser('employer');
                onNavigate('employer-dashboard');
              }}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-sky-400 hover:bg-sky-50/50 text-left transition-all"
            >
              <span className="block font-bold text-xs text-gray-900">Sundaram</span>
              <span className="text-[10px] text-sky-700 font-semibold">Employer (Farmer)</span>
            </button>

            <button
              onClick={() => {
                loginAsDemoUser('both');
                onNavigate('employer-dashboard');
              }}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all"
            >
              <span className="block font-bold text-xs text-gray-900">Arulraj</span>
              <span className="text-[10px] text-purple-700 font-semibold">Both Roles</span>
            </button>

            <button
              onClick={() => {
                loginAsDemoUser('admin');
                onNavigate('admin');
              }}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-red-400 hover:bg-red-50/50 text-left transition-all"
            >
              <span className="block font-bold text-xs text-gray-900">Admin</span>
              <span className="text-[10px] text-red-700 font-semibold">Labour Officer</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          New to Rural Work Connect?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-brand-700 font-bold hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};
