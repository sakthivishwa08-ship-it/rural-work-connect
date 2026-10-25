import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Utensils,
  Home,
  Truck,
  CheckCircle,
  Bookmark,
  Share2,
  AlertTriangle,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SpeakButton } from '../components/common/SpeakButton';
import { Modal } from '../components/common/Modal';

interface JobDetailsPageProps {
  jobId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ jobId, onNavigate }) => {
  const {
    jobs,
    currentUser,
    currentWorkerProfile,
    applications,
    applyForJob,
    savedJobIds,
    toggleSaveJob,
    startOrGetConversation,
  } = useApp();
  const { t } = useI18n();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [proposedWage, setProposedWage] = useState<number>(0);
  const [applyMessage, setApplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const job = jobs.find((j) => j.id === jobId) || jobs[0];

  const hasAlreadyApplied = applications.some(
    (a) => currentWorkerProfile && a.jobId === job.id && a.workerId === currentWorkerProfile.id
  );

  const isSaved = savedJobIds.includes(job.id);

  const speechText = `${job.title}. Category: ${job.category}. Location: ${job.villageOrTown}, ${job.district}. Daily wage: ${job.dailyWage} rupees per day. Payment terms: ${job.paymentTerms}. Starting date: ${job.workDate} at ${job.startTime}. Description: ${job.description}. ${job.mealsProvided ? 'Free food provided.' : ''}`;

  const handleOpenApplyModal = () => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    setProposedWage(job.dailyWage);
    setIsApplyModalOpen(true);
  };

  const handleConfirmApply = async () => {
    setIsSubmitting(true);
    setApplyError(null);

    const res = await applyForJob(job.id, proposedWage, applyMessage);
    setIsSubmitting(false);

    if (res.success) {
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
      }, 1500);
    } else {
      setApplyError(res.error || 'Failed to submit application.');
    }
  };

  const handleMessageEmployer = () => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    // Employer ID in mockData references ep-1 or ep-2, user-employer-1
    const convId = startOrGetConversation('user-employer-1', job.id);
    onNavigate('messaging', { conversationId: convId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('job-search')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Job Search</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        {/* Top Badges & Audio Reader */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="brand" size="md">
            {job.category}
          </Badge>

          <div className="flex items-center gap-2">
            <SpeakButton textToSpeak={speechText} size="md" />

            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 border-gray-200'
              }`}
              title={isSaved ? 'Saved job' : 'Save job'}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug mb-3">
          {job.title}
        </h1>

        {/* Employer & Verification Info */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100 flex-wrap">
          <span className="font-bold text-gray-900">{job.employerName}</span>
          {job.employerVerified && (
            <span className="text-emerald-600 inline-flex items-center gap-1 font-semibold text-xs">
              <CheckCircle className="h-4 w-4 fill-emerald-100" />
              Verified Employer
            </span>
          )}
          {job.employerRating ? (
            <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-xs">
              ★ {job.employerRating} rating
            </span>
          ) : null}
          <span className="text-gray-400">• Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Daily Wage
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-brand-700 block mt-0.5">
              ₹{job.dailyWage}
            </span>
            <span className="text-[11px] text-gray-500">{job.paymentTerms}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Date & Start Time
            </span>
            <span className="text-sm sm:text-base font-bold text-gray-800 block mt-0.5">
              {job.workDate}
            </span>
            <span className="text-[11px] text-gray-500">Sharp at {job.startTime.slice(0, 5)}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Duration
            </span>
            <span className="text-sm sm:text-base font-bold text-gray-800 block mt-0.5">
              {job.durationDays} {job.durationDays > 1 ? 'Days' : 'Day'}
            </span>
            <span className="text-[11px] text-gray-500">Daily wage work</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Positions Open
            </span>
            <span className="text-sm sm:text-base font-bold text-gray-800 block mt-0.5">
              {job.workersHired} of {job.workersNeeded} Hired
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {job.workersNeeded - job.workersHired} slots left
            </span>
          </div>
        </div>

        {/* Work Location Details */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-gray-200 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-gray-900 font-bold">Worksite Location Address:</strong>
              <p className="text-gray-700 mt-0.5 leading-relaxed">
                {job.worksiteAddress}, {job.villageOrTown}, {job.district}, {job.state} - {job.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-3 mb-6">
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
            Work Description & Expectations
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Worksite Benefits & Conditions */}
        <div className="mb-6 space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Worksite Benefits & Amenities
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 ${
              job.mealsProvided
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
              <Utensils className="h-3.5 w-3.5" />
              <span>{job.mealsProvided ? 'Meals / Food Provided' : 'Meals Not Included'}</span>
            </span>

            <span className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 ${
              job.transportProvided
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
              <Truck className="h-3.5 w-3.5" />
              <span>{job.transportProvided ? 'Worksite Transport Provided' : 'Own Travel Required'}</span>
            </span>

            {job.genderPreference && job.genderPreference !== 'Any' && (
              <span className="px-3 py-1.5 rounded-xl border font-semibold bg-amber-50 text-amber-800 border-amber-200">
                Prefers: {job.genderPreference} ({job.genderPreferenceReason || 'Work requirement'})
              </span>
            )}
          </div>
        </div>

        {/* Equipment & Tools Needed */}
        {job.equipmentRequirements && (
          <div className="mb-8 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
            <strong className="block font-bold text-gray-900 mb-0.5">Equipment / Tools Note:</strong>
            {job.equipmentRequirements}
          </div>
        )}

        {/* Action Row */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('safety', { reportedJobId: job.id, jobTitle: job.title })}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-700 font-semibold transition-colors"
            >
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Report this job listing</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={handleMessageEmployer}
              icon={<MessageSquare className="h-4 w-4" />}
            >
              Contact Employer
            </Button>

            {hasAlreadyApplied ? (
              <Button variant="outline" size="md" disabled>
                ✓ Application Submitted
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleOpenApplyModal}
                icon={<Send className="h-4 w-4" />}
              >
                Apply for this Work
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Apply for Job" maxWidth="md">
        <div className="space-y-4 text-sm">
          {applySuccess ? (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 text-lg">Application Submitted!</h3>
              <p className="text-xs text-gray-500 mt-1">
                The employer has been notified and will review your profile.
              </p>
            </div>
          ) : (
            <>
              {applyError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
                  {applyError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Proposed Daily Wage (₹ / day)
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={proposedWage}
                  onChange={(e) => setProposedWage(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm font-bold text-brand-700"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Employer's posted wage: ₹{job.dailyWage} / day
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Message to Employer (Optional)
                </label>
                <textarea
                  rows={3}
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="e.g. Vanakkam, I have 5 years experience in paddy harvesting and live nearby in Alanganallur..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-900 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>
                  Your application will share your verified skill qualifications and rating with the employer. Your private phone number remains protected.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleConfirmApply}
                  isLoading={isSubmitting}
                >
                  Confirm & Submit Application
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
