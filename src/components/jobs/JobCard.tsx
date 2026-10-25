import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  Utensils,
  CheckCircle,
  Bookmark,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Job } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SpeakButton } from '../common/SpeakButton';
import { useApp } from '../../lib/store';
import { useI18n } from '../../i18n';
import { getTranslatedJobSpeech } from '../../lib/speech';

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  hasApplied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewDetails,
  onApply,
  hasApplied = false,
}) => {
  const { savedJobIds, toggleSaveJob } = useApp();
  const { language, t } = useI18n();

  const isSaved = savedJobIds.includes(job.id);

  // Fully translated native audio summary
  const speechText = getTranslatedJobSpeech(job, language);

  const displayCategory =
    t.categories?.[job.category as keyof typeof t.categories] || job.category;

  return (
    <div
      onClick={() => onViewDetails(job.id)}
      className="bg-white rounded-2xl border border-gray-200/90 hover:border-brand-400 shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Top bar: Category + Audio + Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge variant="brand" size="sm">
            {displayCategory}
          </Badge>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <SpeakButton textToSpeak={speechText} size="sm" />

            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 border-gray-200'
              }`}
              title={isSaved ? t.actions.saved : t.actions.saveJob}
              aria-label="Save Job"
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug mb-2">
          {job.title}
        </h3>

        {/* Employer & Verification */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
          <span className="font-semibold text-gray-800 truncate">{job.employerName}</span>
          {job.employerVerified && (
            <span className="text-emerald-600 inline-flex items-center" title="Verified Landowner / Employer">
              <CheckCircle className="h-3.5 w-3.5 fill-emerald-100" />
            </span>
          )}
          {job.employerRating ? (
            <span className="text-amber-700 font-bold ml-1 bg-amber-50 px-1.5 py-0.2 rounded text-[11px]">
              ★ {job.employerRating}
            </span>
          ) : null}
        </div>

        {/* Key Attributes Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3.5">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.villageOrTown}, {job.district}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>{job.workDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>{job.startTime.slice(0, 5)} ({job.durationDays} {job.durationDays > 1 ? 'days' : 'day'})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>{job.workersHired} / {job.workersNeeded} {t.employerDashboard?.workersNeeded || 'workers'}</span>
          </div>
        </div>

        {/* Benefits Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.mealsProvided && (
            <Badge variant="success" size="sm" icon={<Utensils className="h-3 w-3" />}>
              {t.jobDetails?.foodProvided || 'Food Provided'}
            </Badge>
          )}
          {job.transportProvided && (
            <Badge variant="info" size="sm">
              {t.jobDetails?.transportProvided || 'Transport Available'}
            </Badge>
          )}
          {job.genderPreference && job.genderPreference !== 'Any' && (
            <Badge variant="warning" size="sm">
              {job.genderPreference}
            </Badge>
          )}
        </div>
      </div>

      {/* Wage & Action Button */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
            {t.jobDetails?.dailyWage || 'Daily Wage'}
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-brand-700 flex items-center leading-none">
            <span>₹{job.dailyWage}</span>
            <span className="text-xs font-normal text-gray-500 ml-1">/ day</span>
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {hasApplied ? (
            <Badge variant="info" size="md">
              {t.jobDetails?.alreadyApplied || 'Applied'}
            </Badge>
          ) : onApply ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApply(job.id)}
            >
              {t.actions.applyNow}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(job.id)}
              icon={<ChevronRight className="h-4 w-4" />}
            >
              {t.actions.viewDetails}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
