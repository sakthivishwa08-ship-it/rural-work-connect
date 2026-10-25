import React, { useState } from 'react';
import { Mail, CheckCircle, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../lib/store';
import { Button } from '../components/common/Button';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface EmailVerificationPageProps {
  onNavigate: (page: string) => void;
}

export const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ onNavigate }) => {
  const { currentUser, updateUserProfile } = useApp();
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus(null);

    if (isSupabaseConfigured && supabase && currentUser?.email) {
      try {
        await supabase.auth.resend({
          type: 'signup',
          email: currentUser.email,
        });
        setResendStatus('Verification link has been sent to your email address.');
      } catch (err: any) {
        setResendStatus(err?.message || 'Error sending email.');
      }
    } else {
      // Demo environment simulation
      setTimeout(() => {
        setResendStatus('Verification email sent to ' + (currentUser?.email || 'your email') + '.');
      }, 600);
    }
    setIsResending(false);
  };

  const handleSimulateVerify = async () => {
    await updateUserProfile({ isVerified: true });
    onNavigate('worker-dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-md p-6 sm:p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 border border-brand-100">
          <Mail className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
          Verify Your Email
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
          We sent a verification link to{' '}
          <strong className="text-gray-900">{currentUser?.email || 'your email'}</strong>. Please check your inbox and tap the link to verify your identity.
        </p>

        {resendStatus && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
            {resendStatus}
          </div>
        )}

        <div className="space-y-3">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={handleResend}
            isLoading={isResending}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Resend Verification Email
          </Button>

          {/* Quick confirmation button for demonstration */}
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleSimulateVerify}
            icon={<CheckCircle className="h-4 w-4" />}
          >
            Confirm & Enter Dashboard
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Supabase Auth Email Verification standard</span>
        </div>
      </div>
    </div>
  );
};
