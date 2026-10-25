import React from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  Star,
  Coins,
  CheckCircle,
  Bell,
  ArrowRight,
  TrendingUp,
  MapPin,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { JobCard } from '../components/jobs/JobCard';
import { SafetyTipsCard } from '../components/safety/SafetyTipsCard';
import { WorkerAvailabilityStatus } from '../types';

interface WorkerDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenEmergency: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ onNavigate, onOpenEmergency }) => {
  const {
    currentUser,
    currentWorkerProfile,
    updateWorkerProfile,
    jobs,
    applications,
    bookings,
    creditAccount,
  } = useApp();
  const { t } = useI18n();

  const myApplications = applications.filter(
    (app) => currentWorkerProfile && app.workerId === currentWorkerProfile.id
  );

  const myBookings = bookings.filter(
    (b) => currentWorkerProfile && b.workerId === currentWorkerProfile.id
  );

  const upcomingBookings = myBookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status));

  const recommendedJobs = jobs.filter((j) => j.status === 'published').slice(0, 4);

  const handleAvailabilityChange = (status: WorkerAvailabilityStatus) => {
    updateWorkerProfile({ availabilityStatus: status });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Welcome & Availability Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=160&h=160&fit=crop&crop=face'}
              alt={currentUser?.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-brand-500/20"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {t.workerDashboard.welcome}, {currentUser?.fullName || 'Worker'}!
                </h1>
                {currentUser?.isVerified && (
                  <Badge variant="success" size="sm" icon={<CheckCircle className="h-3 w-3" />}>
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>{currentUser?.villageOrTown}, {currentUser?.district} ({currentUser?.state})</span>
              </p>
            </div>
          </div>

          {/* Availability Status Toggle */}
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200/80">
            <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              {t.workerDashboard.currentStatus}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAvailabilityChange('available')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentWorkerProfile?.availabilityStatus === 'available'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {t.workerDashboard.availableBtn}
              </button>

              <button
                type="button"
                onClick={() => handleAvailabilityChange('busy')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentWorkerProfile?.availabilityStatus === 'busy'
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {t.workerDashboard.busyBtn}
              </button>

              <button
                type="button"
                onClick={() => handleAvailabilityChange('unavailable')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentWorkerProfile?.availabilityStatus === 'unavailable'
                    ? 'bg-gray-600 text-white shadow-sm ring-2 ring-gray-500/30'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {t.workerDashboard.offBtn}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Core Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-brand-50/60 p-4 rounded-2xl border border-brand-100">
            <span className="text-xs text-brand-800 font-semibold block mb-1">{t.workerDashboard.completedWorks}</span>
            <span className="text-2xl font-extrabold text-brand-900">
              {currentWorkerProfile?.completedJobsCount || 0}
            </span>
            <span className="text-[11px] text-brand-700 block mt-0.5">{t.workerDashboard.completedSub}</span>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
            <span className="text-xs text-amber-800 font-semibold block mb-1">{t.workerDashboard.avgRating}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold text-amber-900">
                {currentWorkerProfile?.averageRating && currentWorkerProfile.averageRating > 0
                  ? currentWorkerProfile.averageRating
                  : '5.0'}
              </span>
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] text-amber-700 block mt-0.5">
              {currentWorkerProfile?.totalReviewsCount || 0} {t.workerDashboard.reviewsReceived}
            </span>
          </div>

          <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100">
            <span className="text-xs text-sky-800 font-semibold block mb-1">{t.workerDashboard.rewardCredits}</span>
            <div className="flex items-center gap-1">
              <Coins className="h-5 w-5 text-sky-600" />
              <span className="text-2xl font-extrabold text-sky-900">
                {creditAccount?.balance || 50}
              </span>
            </div>
            <span className="text-[11px] text-sky-700 block mt-0.5">{t.workerDashboard.creditsSub}</span>
          </div>

          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
            <span className="text-xs text-purple-800 font-semibold block mb-1">{t.workerDashboard.activeBookings}</span>
            <span className="text-2xl font-extrabold text-purple-900">
              {upcomingBookings.length}
            </span>
            <span className="text-[11px] text-purple-700 block mt-0.5">{t.workerDashboard.bookingsSub}</span>
          </div>
        </div>
      </div>

      {/* Safety Tips Highlight */}
      <SafetyTipsCard onOpenEmergency={onOpenEmergency} />

      {/* Upcoming Bookings / Work Schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
            {t.workerDashboard.upcomingWorkTitle}
          </h2>
          <button
            onClick={() => onNavigate('bookings')}
            className="text-xs sm:text-sm font-semibold text-brand-700 hover:underline"
          >
            View All ({myBookings.length})
          </button>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 text-center text-sm text-gray-500">
            {t.workerDashboard.noUpcoming}{' '}
            <button
              onClick={() => onNavigate('job-search')}
              className="text-brand-600 font-bold underline ml-1"
            >
              {t.workerDashboard.browseJobs}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => onNavigate('bookings')}
                className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs hover:border-brand-400 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Work Date: {b.workDate}
                    </span>
                    <Badge variant={b.status === 'accepted' ? 'success' : 'warning'} size="sm">
                      {b.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-1">
                    {b.jobTitle || b.workDescription}
                  </h3>

                  <p className="text-xs text-gray-600 mb-2">
                    Employer: <strong className="text-gray-800">{b.employerName}</strong>
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{b.workLocation}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-brand-700 text-base">₹{b.agreedWage} / day</span>
                  <span className="font-medium text-gray-500">Starts at {b.startTime.slice(0, 5)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
            {t.workerDashboard.recommendedTitle}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('job-search')}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            {t.actions.viewAllJobs}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={(id) => onNavigate('job-details', { jobId: id })}
              onApply={(id) => onNavigate('job-details', { jobId: id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
