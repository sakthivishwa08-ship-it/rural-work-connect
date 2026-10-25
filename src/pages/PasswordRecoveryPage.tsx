import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface PasswordRecoveryPageProps {
  onNavigate: (page: string) => void;
}

export const PasswordRecoveryPage: React.FC<PasswordRecoveryPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (resetErr) {
          setError(resetErr.message);
          setIsLoading(false);
          return;
        }
      } catch (err: any) {
        setError(err?.message || 'Password reset request failed.');
        setIsLoading(false);
        return;
      }
    }

    // Success state
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-md p-6 sm:p-8">
        <button
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Login</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">Recovery Link Sent!</h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              We sent password reset instructions to <strong>{email}</strong>. Please check your spam folder if you do not see it within 2 minutes.
            </p>
            <Button variant="primary" size="md" fullWidth onClick={() => onNavigate('login')}>
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Your Email Address
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Send Password Reset Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
