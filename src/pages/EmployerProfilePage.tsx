import React, { useState } from 'react';
import {
  MapPin,
  Star,
  CheckCircle,
  Briefcase,
  Edit3,
  Phone,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

interface EmployerProfilePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const EmployerProfilePage: React.FC<EmployerProfilePageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    currentEmployerProfile,
    updateEmployerProfile,
    jobs,
    reviews,
  } = useApp();
  const { t } = useI18n();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessOrIndividualName: currentEmployerProfile?.businessOrIndividualName || '',
    employerType: currentEmployerProfile?.employerType || 'Farmer / Landowner',
    worksiteAddress: currentEmployerProfile?.worksiteAddress || '',
    description: currentEmployerProfile?.description || '',
    preferredContactMethod: currentEmployerProfile?.preferredContactMethod || 'in_app',
  });

  const myJobs = jobs.filter(
    (j) => currentEmployerProfile && j.employerId === currentEmployerProfile.id
  );

  const employerReviews = reviews.filter(
    (r) => currentUser && r.revieweeId === currentUser.id
  );

  const handleSave = async () => {
    await updateEmployerProfile({
      businessOrIndividualName: formData.businessOrIndividualName,
      employerType: formData.employerType,
      worksiteAddress: formData.worksiteAddress,
      description: formData.description,
      preferredContactMethod: formData.preferredContactMethod,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Employer Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-sky-50 text-sky-800 flex items-center justify-center font-bold text-3xl border border-sky-200">
              {currentEmployerProfile?.businessOrIndividualName?.charAt(0) || 'E'}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {currentEmployerProfile?.businessOrIndividualName || currentUser?.fullName}
                </h1>
                {currentEmployerProfile?.isIdentityVerified ? (
                  <Badge variant="success" size="sm" icon={<CheckCircle className="h-3 w-3" />}>
                    Verified Landowner / Employer
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">
                    Verification Pending
                  </Badge>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {currentEmployerProfile?.employerType} • {currentUser?.villageOrTown}, {currentUser?.district}
              </p>

              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{currentEmployerProfile?.averageRating || 4.9}</span>
                  <span className="text-[10px] text-gray-400">({currentEmployerProfile?.totalReviewsCount || 31})</span>
                </div>
                <span className="text-gray-500 font-medium">
                  {currentEmployerProfile?.completedHiresCount || 42} Hires Completed
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => setIsEditing(true)}
            icon={<Edit3 className="h-4 w-4" />}
          >
            Edit Profile
          </Button>
        </div>

        {/* Description */}
        {currentEmployerProfile?.description && (
          <p className="mt-6 text-xs sm:text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
            {currentEmployerProfile.description}
          </p>
        )}

        {/* Worksite Details */}
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400 uppercase text-[10px] block font-semibold">Registered Worksite Address</span>
            <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
              {currentEmployerProfile?.worksiteAddress || `${currentUser?.villageOrTown}, ${currentUser?.district}`}
            </span>
          </div>
          <div>
            <span className="text-gray-400 uppercase text-[10px] block font-semibold">Preferred Communication</span>
            <span className="font-semibold text-gray-800 text-sm mt-0.5 block capitalize">
              {currentEmployerProfile?.preferredContactMethod.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Posted Jobs by this Employer */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-gray-900">
            Active & Past Job Listings ({myJobs.length})
          </h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('create-job')}
          >
            Post New Job
          </Button>
        </div>

        <div className="space-y-3">
          {myJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onNavigate('job-details', { jobId: job.id })}
              className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100/80 transition-colors border border-gray-100 flex items-center justify-between gap-3 cursor-pointer"
            >
              <div>
                <span className="font-bold text-gray-900 text-sm block mb-1">
                  {job.title}
                </span>
                <span className="text-xs text-gray-500">
                  {job.workDate} • ₹{job.dailyWage}/day • {job.workersHired}/{job.workersNeeded} Workers Hired
                </span>
              </div>
              <Badge variant={job.status === 'published' ? 'success' : 'neutral'} size="sm">
                {job.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews by Workers */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">
          Worker Reviews & Ratings ({employerReviews.length})
        </h2>

        {employerReviews.length === 0 ? (
          <p className="text-xs text-gray-500">No worker reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {employerReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-gray-900 text-sm">{rev.reviewerName}</span>
                  <span className="text-amber-500 font-bold">★ {rev.rating}.0</span>
                </div>
                <p className="text-gray-600 mb-2">{rev.feedback}</p>
                <div className="flex flex-wrap gap-1">
                  {rev.tags.map((t) => (
                    <span key={t} className="bg-white px-2 py-0.5 rounded text-[10px] text-gray-500 border border-gray-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Employer Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Employer Profile" maxWidth="md">
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Business / Farm / Landowner Name
            </label>
            <input
              type="text"
              value={formData.businessOrIndividualName}
              onChange={(e) => setFormData({ ...formData, businessOrIndividualName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Employer Type
            </label>
            <select
              value={formData.employerType}
              onChange={(e) => setFormData({ ...formData, employerType: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-sm"
            >
              <option value="Farmer / Landowner">Farmer / Landowner</option>
              <option value="Contractor / Builder">Contractor / Builder</option>
              <option value="Household / Private Individual">Household / Private Individual</option>
              <option value="Small Enterprise / Mandi Trader">Small Enterprise / Mandi Trader</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Worksite Location & Address
            </label>
            <input
              type="text"
              value={formData.worksiteAddress}
              onChange={(e) => setFormData({ ...formData, worksiteAddress: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              About Farm / Worksite / Fair Payment Assurances
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
