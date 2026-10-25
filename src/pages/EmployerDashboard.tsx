import React from 'react';
import {
  Briefcase,
  Users,
  PlusCircle,
  Clock,
  Star,
  CheckCircle,
  Eye,
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface EmployerDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    currentEmployerProfile,
    jobs,
    applications,
    bookings,
  } = useApp();
  const { t } = useI18n();

  // Filter jobs belonging to this employer
  const myJobs = jobs.filter(
    (j) => currentEmployerProfile && j.employerId === currentEmployerProfile.id
  );

  const activeJobs = myJobs.filter((j) => j.status === 'published' || j.status === 'in_progress');

  // Applications for my jobs
  const myJobIds = myJobs.map((j) => j.id);
  const myApplications = applications.filter((app) => myJobIds.includes(app.jobId));
  const pendingApplications = myApplications.filter((app) => app.status === 'pending');

  // Bookings initiated by this employer
  const myBookings = bookings.filter(
    (b) => currentEmployerProfile && b.employerId === currentEmployerProfile.id
  );
  const scheduledBookings = myBookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Employer Overview Header */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-2xl border border-sky-100">
              {currentEmployerProfile?.businessOrIndividualName?.charAt(0) || 'E'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {currentEmployerProfile?.businessOrIndividualName || currentUser?.fullName}
                </h1>
                {currentEmployerProfile?.isIdentityVerified && (
                  <Badge variant="success" size="sm" icon={<CheckCircle className="h-3 w-3" />}>
                    Verified Landowner / Employer
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {currentEmployerProfile?.employerType} • {currentUser?.villageOrTown}, {currentUser?.district}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('create-job')}
            icon={<PlusCircle className="h-5 w-5" />}
          >
            {t.nav.postJob}
          </Button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100">
            <span className="text-xs text-sky-800 font-semibold block mb-1">{t.employerDashboard.activeJobsTitle}</span>
            <span className="text-2xl font-extrabold text-sky-900">{activeJobs.length}</span>
            <span className="text-[11px] text-sky-700 block mt-0.5">{t.employerDashboard.activeJobsSub}</span>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
            <span className="text-xs text-amber-800 font-semibold block mb-1">{t.employerDashboard.pendingApplicants}</span>
            <span className="text-2xl font-extrabold text-amber-900">
              {pendingApplications.length}
            </span>
            <span className="text-[11px] text-amber-700 block mt-0.5">{t.employerDashboard.pendingSub}</span>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
            <span className="text-xs text-emerald-800 font-semibold block mb-1">{t.employerDashboard.scheduledWorkers}</span>
            <span className="text-2xl font-extrabold text-emerald-900">
              {scheduledBookings.length}
            </span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">{t.employerDashboard.scheduledSub}</span>
          </div>

          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
            <span className="text-xs text-purple-800 font-semibold block mb-1">{t.employerDashboard.employerRating}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold text-purple-900">
                {currentEmployerProfile?.averageRating || '4.9'}
              </span>
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] text-purple-700 block mt-0.5">
              {currentEmployerProfile?.totalReviewsCount || 31} {t.employerDashboard.workerReviews}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Applicants Notice */}
      {pendingApplications.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-base">
              {t.employerDashboard.newApplicantsAlert} ({pendingApplications.length})
            </h3>
            <p className="text-xs text-amber-100 mt-0.5">
              Review applicant experience and confirm your worksite team.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('applicants')}
            className="bg-white text-amber-900 hover:bg-amber-50 border-none font-bold"
          >
            {t.employerDashboard.reviewApplicantsBtn}
          </Button>
        </div>
      )}

      {/* Active Posted Jobs Table/Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
            {t.employerDashboard.activePostings}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('worker-discovery')}
            icon={<Users className="h-4 w-4" />}
          >
            {t.employerDashboard.searchWorkersBtn}
          </Button>
        </div>

        {myJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center text-sm text-gray-500">
            {t.employerDashboard.noJobsYet}{' '}
            <button
              onClick={() => onNavigate('create-job')}
              className="text-brand-600 font-bold underline ml-1"
            >
              {t.employerDashboard.postFirstJob}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={job.status === 'published' ? 'success' : 'neutral'} size="sm">
                      {job.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-400">{job.workDate}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">
                    {job.title}
                  </h3>

                  <p className="text-xs text-gray-500 mb-3 truncate">
                    {job.villageOrTown}, {job.district} • {job.category}
                  </p>

                  <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl text-xs mb-3">
                    <span className="text-gray-600">{t.jobDetails.dailyWage}:</span>
                    <strong className="text-brand-700 font-bold text-sm">₹{job.dailyWage} / day</strong>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>{t.employerDashboard.workersNeeded}:</span>
                    <strong className="text-gray-900">{job.workersHired} / {job.workersNeeded} {t.employerDashboard.hired}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('job-details', { jobId: job.id })}
                  >
                    {t.actions.viewDetails}
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('applicants', { jobId: job.id })}
                  >
                    Applicants ({myApplications.filter((a) => a.jobId === job.id).length})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Workers Discovery teaser */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 text-base sm:text-lg">
            {t.workerDiscovery.title}?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            {t.workerDiscovery.subtitle}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('worker-discovery')}
          icon={<Users className="h-4 w-4" />}
        >
          {t.employerDashboard.searchWorkersBtn}
        </Button>
      </div>
    </div>
  );
};
