import React from 'react';
import { MapPin, Star, Briefcase, IndianRupee, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WorkerProfile, UserProfile } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useI18n } from '../../i18n';

interface WorkerCardProps {
  worker: WorkerProfile;
  user?: UserProfile;
  onBookWorker?: (workerId: string) => void;
  onViewProfile?: (workerId: string) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  user,
  onBookWorker,
  onViewProfile,
}) => {
  const { t } = useI18n();

  const getAvailabilityBadge = (status: WorkerProfile['availabilityStatus']) => {
    switch (status) {
      case 'available':
        return <Badge variant="success" size="sm">{t.workerDiscovery.availableNow}</Badge>;
      case 'busy':
        return <Badge variant="warning" size="sm">{t.workerDiscovery.busyOnWork}</Badge>;
      case 'unavailable':
      default:
        return <Badge variant="neutral" size="sm">{t.workerDiscovery.unavailable}</Badge>;
    }
  };

  const displayName = user?.fullName || 'Daily-Wage Worker';
  const location = user ? `${user.villageOrTown}, ${user.district}` : 'Tamil Nadu';

  return (
    <div
      onClick={() => onViewProfile && onViewProfile(worker.id)}
      className="bg-white rounded-2xl border border-gray-200/90 hover:border-brand-400 shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Header: Avatar, Name, Location & Status */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative">
            <img
              src={
                user?.avatarUrl ||
                `https://images.unsplash.com/photo-1544717305-2782549b5136?w=160&h=160&fit=crop&crop=face`
              }
              alt={displayName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-brand-500/20"
            />
            {user?.isVerified && (
              <span
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 text-emerald-600 shadow"
                title="Identity Verified Worker"
              >
                <CheckCircle2 className="h-4 w-4 fill-emerald-100" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate group-hover:text-brand-700 transition-colors">
                {displayName}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {getAvailabilityBadge(worker.availabilityStatus)}

              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{worker.averageRating > 0 ? worker.averageRating : 'New'}</span>
                <span className="text-[10px] text-gray-400">({worker.totalReviewsCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {worker.bio && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {worker.bio}
          </p>
        )}

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {worker.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg border border-gray-200"
            >
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="text-[11px] font-medium text-gray-400 px-1 py-0.5">
              +{worker.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">{t.workerDiscovery.experience}</span>
            <span className="font-semibold text-gray-800">{worker.experienceYears} Years</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">{t.workerDiscovery.completedWorks}</span>
            <span className="font-semibold text-gray-800">{worker.completedJobsCount} Works</span>
          </div>
        </div>
      </div>

      {/* Wage & Book Button */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
            {t.workerDiscovery.expectedWage}
          </span>
          <div className="text-base sm:text-lg font-extrabold text-brand-700 flex items-center">
            <span>₹{worker.expectedDailyWage}</span>
            <span className="text-xs font-normal text-gray-500 ml-1">/ day</span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          {onBookWorker ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBookWorker(worker.id)}
              disabled={worker.availabilityStatus === 'unavailable'}
            >
              {t.actions.bookWorker}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile && onViewProfile(worker.id)}
            >
              {t.actions.viewDetails}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
