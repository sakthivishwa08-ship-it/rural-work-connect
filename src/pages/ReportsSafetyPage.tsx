import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  PhoneCall,
  CheckCircle,
  FileWarning,
  Send,
  Eye,
  Ban,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ReportReason } from '../types';

interface ReportsSafetyPageProps {
  onOpenEmergency: () => void;
  reportedJobId?: string;
  reportedJobTitle?: string;
  reportedUserId?: string;
  reportedUserName?: string;
}

export const ReportsSafetyPage: React.FC<ReportsSafetyPageProps> = ({
  onOpenEmergency,
  reportedJobId,
  reportedJobTitle,
  reportedUserId,
  reportedUserName,
}) => {
  const { currentUser, submitReport } = useApp();
  const { t } = useI18n();

  const [reason, setReason] = useState<ReportReason>('fraudulent_listing');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide specific details regarding this violation.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await submitReport({
      reportedUserId,
      jobId: reportedJobId,
      reason,
      description: description.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      setDescription('');
    } else {
      setError(res.error || 'Failed to submit safety report.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Safety Center Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-7 w-7 text-red-600" />
          <span>Worker Safety & Grievance Reporting</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Zero-tolerance protection against scams, wage deductions, abusive conduct, and unsafe worksites
        </p>
      </div>

      {/* Emergency Dial Card */}
      <div className="bg-red-500 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-red-200 block mb-1">
            Immediate Physical Danger or Distress
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            Need Police or Emergency Help Right Now?
          </h2>
          <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-lg leading-relaxed">
            Call national emergency responders (112) or the 24x7 Women in Distress Helpline (181).
          </p>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={onOpenEmergency}
          className="bg-white text-red-700 hover:bg-red-50 border-none font-extrabold shadow"
          icon={<PhoneCall className="h-5 w-5" />}
        >
          View Emergency Helplines
        </Button>
      </div>

      {/* Safety Guidelines Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span>Essential Worksite Safety Checklist</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <strong className="block text-gray-900 font-bold">1. Zero Advance Fee Mandate</strong>
            <p className="text-gray-600 leading-relaxed">
              Never pay registration, uniform, or interview fees. Any listing asking for upfront money is an illegal scam and should be reported below.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <strong className="block text-gray-900 font-bold">2. Pre-Travel Verification</strong>
            <p className="text-gray-600 leading-relaxed">
              Always verify the employer phone number and prominent worksite landmark before travelling. Travel during daylight hours whenever possible.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <strong className="block text-gray-900 font-bold">3. Fixed Wage Agreement</strong>
            <p className="text-gray-600 leading-relaxed">
              Confirm your daily rate (e.g. ₹700/day) and finish time (e.g. 5:00 PM) before starting physical work in the morning.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <strong className="block text-gray-900 font-bold">4. Share Location with Family</strong>
            <p className="text-gray-600 leading-relaxed">
              Inform your family or neighbours about the exact farm or construction site address and your expected return time.
            </p>
          </div>
        </div>
      </div>

      {/* Incident / Scam Report Form */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-red-600" />
            <span>Submit a Platform Incident or Abuse Report</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Reports are immediately reviewed by human administrators. Target listings and abusive accounts may be suspended.
          </p>
        </div>

        {reportedJobTitle && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
            Reporting Job: {reportedJobTitle}
          </div>
        )}

        {reportedUserName && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
            Reporting User: {reportedUserName}
          </div>
        )}

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-lg">Report Submitted Successfully</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 leading-relaxed">
              Thank you for keeping Rural Work Connect safe. Our compliance officers have received your evidence and are investigating.
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Submit Another Report
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Violation Category *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="fraudulent_listing">Fraudulent or Fake Job Listing</option>
                <option value="suspicious_payment">Demand for Advance Fee / Registration Deposit</option>
                <option value="misleading_wage_description">Misleading Wages or Underpayment at Site</option>
                <option value="harassment_threats">Harassment, Verbal Abuse, or Threats</option>
                <option value="unsafe_worksite">Unsafe Worksite Conditions or Hazard</option>
                <option value="discrimination">Unlawful Discrimination</option>
                <option value="prohibited_exploitation">Prohibited Activity / Exploitation</option>
                <option value="fake_impersonation">Fake Account or Impersonation</option>
                <option value="other">Other Incident</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Detailed Description of the Incident *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred, dates, what was said, telephone numbers involved, or worksite location..."
                className="w-full p-3 rounded-xl border border-gray-300 text-sm leading-relaxed focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="danger"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                icon={<Send className="h-4 w-4" />}
              >
                Submit Incident for Administrative Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
