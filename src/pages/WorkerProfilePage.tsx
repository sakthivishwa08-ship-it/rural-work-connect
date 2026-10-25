import React, { useState } from 'react';
import {
  User,
  MapPin,
  Star,
  Briefcase,
  IndianRupee,
  Clock,
  ShieldCheck,
  CheckCircle,
  Eye,
  EyeOff,
  Edit3,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { WORK_CATEGORIES, INDIAN_STATES_DISTRICTS } from '../lib/locations';

interface WorkerProfilePageProps {
  onNavigate: (page: string) => void;
  workerId?: string;
}

export const WorkerProfilePage: React.FC<WorkerProfilePageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    currentWorkerProfile,
    updateUserProfile,
    updateWorkerProfile,
    reviews,
  } = useApp();
  const { t } = useI18n();

  const [isEditing, setIsEditing] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Editable Form State
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    villageOrTown: currentUser?.villageOrTown || '',
    district: currentUser?.district || '',
    state: currentUser?.state || 'Tamil Nadu',
    pincode: currentUser?.pincode || '',
    experienceYears: currentWorkerProfile?.experienceYears || 1.0,
    expectedDailyWage: currentWorkerProfile?.expectedDailyWage || 600,
    travelRadiusKm: currentWorkerProfile?.travelRadiusKm || 15,
    bio: currentWorkerProfile?.bio || '',
    skills: currentWorkerProfile?.skills || [],
    showPhonePublicly: currentWorkerProfile?.showPhonePublicly || false,
    showEmailPublicly: currentWorkerProfile?.showEmailPublicly || false,
    showExactAddressPublicly: currentWorkerProfile?.showExactAddressPublicly || false,
  });

  const workerReviews = reviews.filter(
    (r) => currentUser && r.revieweeId === currentUser.id
  );

  const handleSave = async () => {
    await updateUserProfile({
      fullName: formData.fullName,
      phone: formData.phone,
      villageOrTown: formData.villageOrTown,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode,
    });

    await updateWorkerProfile({
      experienceYears: Number(formData.experienceYears),
      expectedDailyWage: Number(formData.expectedDailyWage),
      travelRadiusKm: Number(formData.travelRadiusKm),
      bio: formData.bio,
      skills: formData.skills,
      showPhonePublicly: formData.showPhonePublicly,
      showEmailPublicly: formData.showEmailPublicly,
      showExactAddressPublicly: formData.showExactAddressPublicly,
    });

    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!formData.skills.includes(newSkillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkillInput.trim()],
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=face'}
                alt={currentUser?.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-brand-500/20"
              />
              {currentUser?.isVerified && (
                <span
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 text-emerald-600 shadow"
                  title="Verified Profile"
                >
                  <CheckCircle className="h-5 w-5 fill-emerald-100" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {currentUser?.fullName}
                </h1>
                <Badge variant="brand" size="sm">
                  {currentWorkerProfile?.availabilityStatus === 'available'
                    ? 'Available for Work'
                    : currentWorkerProfile?.availabilityStatus === 'busy'
                    ? 'Busy'
                    : 'Unavailable'}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span>
                  {currentUser?.villageOrTown}, {currentUser?.district} ({currentUser?.state}) - {currentUser?.pincode}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{currentWorkerProfile?.averageRating || 4.9}</span>
                  <span className="text-[10px] text-gray-400">({currentWorkerProfile?.totalReviewsCount || 19})</span>
                </div>

                <span className="text-xs text-gray-500">
                  {currentWorkerProfile?.completedJobsCount || 28} Completed Works
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
            {t.actions.editProfile}
          </Button>
        </div>

        {/* Bio */}
        {currentWorkerProfile?.bio && (
          <p className="mt-6 text-xs sm:text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
            {currentWorkerProfile.bio}
          </p>
        )}

        {/* Work Terms Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100 text-xs">
          <div>
            <span className="text-gray-400 uppercase text-[10px] block font-semibold">Daily Wage</span>
            <span className="font-extrabold text-brand-700 text-base">
              ₹{currentWorkerProfile?.expectedDailyWage || 600} / day
            </span>
          </div>

          <div>
            <span className="text-gray-400 uppercase text-[10px] block font-semibold">Experience</span>
            <span className="font-bold text-gray-800 text-base">
              {currentWorkerProfile?.experienceYears} Years
            </span>
          </div>

          <div>
            <span className="text-gray-400 uppercase text-[10px] block font-semibold">Travel Distance</span>
            <span className="font-bold text-gray-800 text-base">
              Within {currentWorkerProfile?.travelRadiusKm} km
            </span>
          </div>

          <div>
            <span className="text-gray-400 uppercase text-[10px] block font-semibold">Shift Hours</span>
            <span className="font-bold text-gray-800 text-sm">
              {currentWorkerProfile?.availableHoursType || 'Full Day (8 hrs)'}
            </span>
          </div>
        </div>
      </div>

      {/* Skills Showcase */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">
          Skills & Specializations
        </h2>
        <div className="flex flex-wrap gap-2">
          {currentWorkerProfile?.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-800 text-xs sm:text-sm font-semibold border border-brand-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Privacy & Visibility Settings Section */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-extrabold text-gray-900">
            Privacy & Contact Protection
          </h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Rural Work Connect strictly conceals your personal contact numbers and private address from public search results until you accept a legitimate job booking.
        </p>

        <div className="space-y-2 text-xs text-gray-700">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span>Direct Phone Number Visibility</span>
            <span className="font-bold text-gray-600">
              {currentWorkerProfile?.showPhonePublicly ? 'Visible Publicly' : 'Hidden by Default (Protected)'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span>Email Address Visibility</span>
            <span className="font-bold text-gray-600">
              {currentWorkerProfile?.showEmailPublicly ? 'Visible Publicly' : 'Hidden by Default (Protected)'}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews Received */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">
          Ratings & Reviews Received ({workerReviews.length})
        </h2>

        {workerReviews.length === 0 ? (
          <p className="text-xs text-gray-500">No reviews received yet. Complete your first daily job to receive verified employer ratings.</p>
        ) : (
          <div className="space-y-3">
            {workerReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-gray-900 text-sm">{rev.reviewerName}</span>
                  <div className="flex items-center text-amber-500 font-bold">
                    ★ {rev.rating}.0
                  </div>
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

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Worker Profile" maxWidth="lg">
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Expected Daily Wage (₹)</label>
              <input
                type="number"
                value={formData.expectedDailyWage}
                onChange={(e) => setFormData({ ...formData, expectedDailyWage: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Experience (Years)</label>
              <input
                type="number"
                step="0.5"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">About / Bio</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
            />
          </div>

          {/* Add Skills */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add custom skill (e.g. Drip Irrigation, Centering)..."
                className="flex-1 p-2 rounded-xl border border-gray-300 text-xs"
              />
              <Button variant="outline" size="sm" onClick={handleAddSkill} icon={<Plus className="h-4 w-4" />}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-brand-50 text-brand-800 rounded-lg text-xs font-medium border border-brand-200 inline-flex items-center gap-1"
                >
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="text-brand-600 hover:text-red-600">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Privacy Toggles */}
          <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
            <span className="font-bold text-gray-700 uppercase block">Privacy Toggles</span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showPhone"
                checked={formData.showPhonePublicly}
                onChange={(e) => setFormData({ ...formData, showPhonePublicly: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <label htmlFor="showPhone" className="text-gray-700">Show phone number publicly on search</label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Profile Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
