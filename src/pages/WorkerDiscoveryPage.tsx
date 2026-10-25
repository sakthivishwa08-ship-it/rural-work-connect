import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  MapPin,
  Star,
  Calendar,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { WorkerCard } from '../components/workers/WorkerCard';
import { VoiceSearchInput } from '../components/common/VoiceSearchInput';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { WORK_CATEGORIES, INDIAN_STATES_DISTRICTS } from '../lib/locations';
import { WorkerProfile } from '../types';

interface WorkerDiscoveryPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const WorkerDiscoveryPage: React.FC<WorkerDiscoveryPageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    currentEmployerProfile,
    createDirectBooking,
  } = useApp();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  // Direct Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-28');
  const [bookingTime, setBookingTime] = useState('08:00');
  const [durationDays, setDurationDays] = useState(1);
  const [agreedWage, setAgreedWage] = useState(700);
  const [workLocation, setWorkLocation] = useState(
    currentEmployerProfile?.worksiteAddress || `${currentUser?.villageOrTown}, ${currentUser?.district}`
  );
  const [workDescription, setWorkDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // In demo state, let's pull workers from mock profiles
  // Ramanathan (Mason, Madurai), Selvi (Harvesting, Thanjavur), Arulraj (Centering, Madurai)
  const mockWorkers: { profile: WorkerProfile; user: any }[] = [
    {
      profile: {
        id: 'wp-1',
        userId: 'user-worker-1',
        experienceYears: 6.5,
        expectedDailyWage: 750,
        availabilityStatus: 'available',
        availableHoursType: 'Full Day (8 hrs)',
        travelRadiusKm: 20,
        bio: 'Expert in bricklaying, cement plastering, and stone foundation masonry. Punctual and brings own measuring tools.',
        skills: ['Bricklaying & Wall Masonry', 'Cement Plastering', 'Concrete Mixing & Pouring'],
        completedJobsCount: 28,
        averageRating: 4.9,
        totalReviewsCount: 19,
        showPhonePublicly: false,
        showEmailPublicly: false,
        showExactAddressPublicly: false,
        createdAt: '2026-08-10T09:10:00Z',
      },
      user: {
        id: 'user-worker-1',
        fullName: 'Ramanathan K.',
        avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=face',
        villageOrTown: 'Alanganallur',
        district: 'Madurai',
        state: 'Tamil Nadu',
        isVerified: true,
      },
    },
    {
      profile: {
        id: 'wp-2',
        userId: 'user-worker-2',
        experienceYears: 4.0,
        expectedDailyWage: 550,
        availabilityStatus: 'available',
        availableHoursType: 'Morning Shift & Full Day',
        travelRadiusKm: 12,
        bio: 'Skilled in paddy transplantation, field weeding, and Samba harvest sacking. Fast and dependable farm hand.',
        skills: ['Paddy Harvesting', 'Sowing & Planting', 'Field Weeding & De-weeding'],
        completedJobsCount: 34,
        averageRating: 4.8,
        totalReviewsCount: 22,
        showPhonePublicly: false,
        showEmailPublicly: false,
        showExactAddressPublicly: false,
        createdAt: '2026-08-12T10:40:00Z',
      },
      user: {
        id: 'user-worker-2',
        fullName: 'Selvi Muthu',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
        villageOrTown: 'Papanasam',
        district: 'Thanjavur',
        state: 'Tamil Nadu',
        isVerified: true,
      },
    },
    {
      profile: {
        id: 'wp-3',
        userId: 'user-both-1',
        experienceYears: 8.0,
        expectedDailyWage: 850,
        availabilityStatus: 'busy',
        availableHoursType: 'Full Day',
        travelRadiusKm: 25,
        bio: 'Centering specialist and building contractor. Available for structural foundation and beam installation.',
        skills: ['Centering & Steel Binding', 'Bricklaying & Wall Masonry', 'PVC Pipe Fitting & Leak Repair'],
        completedJobsCount: 16,
        averageRating: 4.7,
        totalReviewsCount: 11,
        showPhonePublicly: false,
        showEmailPublicly: false,
        showExactAddressPublicly: false,
        createdAt: '2026-08-05T11:20:00Z',
      },
      user: {
        id: 'user-both-1',
        fullName: 'Arulraj Chettiar',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        villageOrTown: 'Melur',
        district: 'Madurai',
        state: 'Tamil Nadu',
        isVerified: true,
      },
    },
  ];

  const filteredWorkers = useMemo(() => {
    return mockWorkers.filter((item) => {
      if (availabilityOnly && item.profile.availabilityStatus !== 'available') {
        return false;
      }

      if (selectedDistrict && item.user.district !== selectedDistrict) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.user.fullName.toLowerCase().includes(q);
        const matchLocation = `${item.user.villageOrTown} ${item.user.district}`.toLowerCase().includes(q);
        const matchSkills = item.profile.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchLocation && !matchSkills) return false;
      }

      return true;
    });
  }, [mockWorkers, searchQuery, selectedDistrict, availabilityOnly]);

  const handleOpenBooking = (workerId: string) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    const target = mockWorkers.find((w) => w.profile.id === workerId);
    if (target) {
      setSelectedWorkerId(workerId);
      setAgreedWage(target.profile.expectedDailyWage);
      setWorkDescription(`Daily wage work for ${target.profile.skills[0] || 'worksite duties'}`);
      setIsBookingModalOpen(true);
    }
  };

  const handleConfirmDirectBooking = async () => {
    if (!selectedWorkerId || !workDescription.trim() || !workLocation.trim()) {
      setBookingError('Please enter the worksite location and work description.');
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    const res = await createDirectBooking({
      workerId: selectedWorkerId,
      workDate: bookingDate,
      startTime: bookingTime,
      durationDays: Number(durationDays),
      agreedWage: Number(agreedWage),
      workLocation: workLocation.trim(),
      workDescription: workDescription.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      setBookingSuccess(true);
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setBookingSuccess(false);
        onNavigate('bookings');
      }, 1500);
    } else {
      setBookingError(res.error || 'Failed to send booking request.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Find Available Rural Workers
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Directly discover and book verified masons, farm hands, harvesters, and drivers near you
        </p>
      </div>

      {/* Voice Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1">
          <VoiceSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by worker name, skill (e.g. Masonry, Harvesting), or village..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="p-3 rounded-2xl border border-gray-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Districts</option>
            <option value="Madurai">Madurai</option>
            <option value="Thanjavur">Thanjavur</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>

          <label className="flex items-center gap-1.5 p-3 rounded-2xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={availabilityOnly}
              onChange={(e) => setAvailabilityOnly(e.target.checked)}
              className="rounded text-brand-600 w-4 h-4"
            />
            <span>Available Only</span>
          </label>
        </div>
      </div>

      {/* Worker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkers.map(({ profile, user }) => (
          <WorkerCard
            key={profile.id}
            worker={profile}
            user={user}
            onBookWorker={handleOpenBooking}
            onViewProfile={(wId) => onNavigate('worker-profile', { workerId: wId })}
          />
        ))}
      </div>

      {/* Direct Booking Modal */}
      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Send Work Booking Request" maxWidth="md">
        <div className="space-y-4 text-sm text-gray-800">
          {bookingSuccess ? (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 text-lg">Booking Request Sent!</h3>
              <p className="text-xs text-gray-500 mt-1">
                The worker has been notified and can confirm or accept your request.
              </p>
            </div>
          ) : (
            <>
              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
                  {bookingError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Work Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Morning Start Time *</label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Agreed Daily Wage (₹) *</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={agreedWage}
                    onChange={(e) => setAgreedWage(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-bold text-brand-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Worksite Location Address *</label>
                <input
                  type="text"
                  required
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Work Description & Tasks *</label>
                <textarea
                  rows={2}
                  required
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="e.g. Masonry plastering of 30-ft brick wall..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex items-center justify-between">
                <span className="text-gray-600">Total Work Value:</span>
                <strong className="text-brand-700 text-base font-extrabold">₹{agreedWage * durationDays}</strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsBookingModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleConfirmDirectBooking}
                  isLoading={isSubmitting}
                >
                  Confirm & Send Request
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
