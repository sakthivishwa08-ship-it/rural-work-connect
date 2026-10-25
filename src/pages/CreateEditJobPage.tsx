import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Users,
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { WORK_CATEGORIES, INDIAN_STATES_DISTRICTS, isValidPinCode } from '../lib/locations';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Job, JobStatus } from '../types';

interface CreateEditJobPageProps {
  onNavigate: (page: string, params?: any) => void;
  jobToEditId?: string;
}

export const CreateEditJobPage: React.FC<CreateEditJobPageProps> = ({
  onNavigate,
  jobToEditId,
}) => {
  const { currentUser, currentEmployerProfile, jobs, createJob, updateJob } = useApp();
  const { t } = useI18n();

  const existingJob = jobToEditId ? jobs.find((j) => j.id === jobToEditId) : null;

  const [title, setTitle] = useState(existingJob?.title || '');
  const [description, setDescription] = useState(existingJob?.description || '');
  const [category, setCategory] = useState(existingJob?.category || 'Agriculture and Farm Work');
  const [workersNeeded, setWorkersNeeded] = useState(existingJob?.workersNeeded || 2);
  const [dailyWage, setDailyWage] = useState(existingJob?.dailyWage || 700);
  const [paymentTerms, setPaymentTerms] = useState(
    existingJob?.paymentTerms || 'Daily Cash at 05:00 PM'
  );
  const [state, setState] = useState(existingJob?.state || currentUser?.state || 'Tamil Nadu');
  const [district, setDistrict] = useState(existingJob?.district || currentUser?.district || 'Madurai');
  const [villageOrTown, setVillageOrTown] = useState(
    existingJob?.villageOrTown || currentUser?.villageOrTown || ''
  );
  const [worksiteAddress, setWorksiteAddress] = useState(existingJob?.worksiteAddress || '');
  const [pincode, setPincode] = useState(existingJob?.pincode || currentUser?.pincode || '');
  const [workDate, setWorkDate] = useState(existingJob?.workDate || '2026-10-28');
  const [startTime, setStartTime] = useState(existingJob?.startTime || '07:30');
  const [durationDays, setDurationDays] = useState(existingJob?.durationDays || 1);
  const [mealsProvided, setMealsProvided] = useState(existingJob?.mealsProvided || false);
  const [accommodationProvided, setAccommodationProvided] = useState(
    existingJob?.accommodationProvided || false
  );
  const [transportProvided, setTransportProvided] = useState(
    existingJob?.transportProvided || false
  );
  const [equipmentRequirements, setEquipmentRequirements] = useState(
    existingJob?.equipmentRequirements || ''
  );
  const [genderPreference, setGenderPreference] = useState<'Any' | 'Male' | 'Female'>(
    existingJob?.genderPreference || 'Any'
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStateObj = INDIAN_STATES_DISTRICTS.find((s) => s.state === state);
  const districtList = selectedStateObj ? selectedStateObj.districts : [];

  const handleValidate = () => {
    setError(null);
    if (!title.trim() || !description.trim() || !worksiteAddress.trim() || !pincode.trim()) {
      setError('Please fill in all mandatory job information fields.');
      return false;
    }
    if (dailyWage < 100) {
      setError('Daily wage must be at least ₹100 / day.');
      return false;
    }
    if (workersNeeded < 1) {
      setError('At least 1 worker is required.');
      return false;
    }
    if (!isValidPinCode(pincode)) {
      setError('Please provide a valid 6-digit Indian PIN code.');
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!handleValidate()) return;

    setIsLoading(true);
    if (existingJob) {
      await updateJob(existingJob.id, {
        title,
        description,
        category,
        workersNeeded,
        dailyWage,
        paymentTerms,
        state,
        district,
        villageOrTown,
        worksiteAddress,
        pincode,
        workDate,
        startTime,
        durationDays,
        mealsProvided,
        accommodationProvided,
        transportProvided,
        equipmentRequirements,
        genderPreference,
      });
      setIsLoading(false);
      onNavigate('job-details', { jobId: existingJob.id });
    } else {
      const res = await createJob({
        title,
        description,
        category,
        requiredSkills: [category],
        workersNeeded,
        workersHired: 0,
        state,
        district,
        villageOrTown,
        worksiteAddress,
        pincode,
        workDate,
        startTime,
        durationDays,
        dailyWage,
        paymentTerms,
        mealsProvided,
        accommodationProvided,
        transportProvided,
        equipmentRequirements,
        genderPreference,
        status: 'published',
        images: [],
      });
      setIsLoading(false);
      if (res.success && res.job) {
        onNavigate('job-details', { jobId: res.job.id });
      } else {
        setError(res.error || 'Failed to publish job.');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <button
        onClick={() => onNavigate('employer-dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Employer Dashboard</span>
      </button>

      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-xs">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {existingJob ? 'Edit Daily Job Listing' : 'Post a New Daily Job'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Specify wage, worksite location, requirements, and worker count
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4 text-sm text-gray-800">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Paddy Field Harvesting & Sacking"
              className="w-full p-3 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Work Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {WORK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Workers Needed & Daily Wage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Number of Workers Needed *
              </label>
              <input
                type="number"
                min="1"
                required
                value={workersNeeded}
                onChange={(e) => setWorkersNeeded(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Daily Wage (₹ / day) *
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={dailyWage}
                onChange={(e) => setDailyWage(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-gray-300 text-sm font-bold text-brand-700 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Payment Terms & Settlement *
            </label>
            <input
              type="text"
              required
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="e.g. Daily Cash at 05:00 PM or Direct UPI"
              className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Date, Start Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Work Start Date *
              </label>
              <input
                type="date"
                required
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Morning Start Time *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* State & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                State *
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  const firstD = INDIAN_STATES_DISTRICTS.find((s) => s.state === e.target.value)?.districts[0] || '';
                  setDistrict(firstD);
                }}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm"
              >
                {INDIAN_STATES_DISTRICTS.map((s) => (
                  <option key={s.state} value={s.state}>
                    {s.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm"
              >
                {districtList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Village/Town & PIN code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Village / Town *
              </label>
              <input
                type="text"
                required
                value={villageOrTown}
                onChange={(e) => setVillageOrTown(e.target.value)}
                placeholder="e.g. Alanganallur"
                className="w-full p-3 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Worksite PIN Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="625501"
                className="w-full p-3 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>

          {/* Worksite Landmark Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Exact Worksite Landmark & Address *
            </label>
            <input
              type="text"
              required
              value={worksiteAddress}
              onChange={(e) => setWorksiteAddress(e.target.value)}
              placeholder="e.g. Survey No. 44, Vettaikaranpudur Road, Near North Water Tank"
              className="w-full p-3 rounded-xl border border-gray-300 text-sm"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Detailed Work Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the physical work to be done, ground conditions, equipment to be used, and safety precautions..."
              className="w-full p-3 rounded-xl border border-gray-300 text-sm leading-relaxed"
            />
          </div>

          {/* Amenities & Checkboxes */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Provided Amenities
            </span>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mealsProvided}
                  onChange={(e) => setMealsProvided(e.target.checked)}
                  className="rounded text-brand-600 w-4 h-4"
                />
                <span>Free Meals / Lunch Provided</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transportProvided}
                  onChange={(e) => setTransportProvided(e.target.checked)}
                  className="rounded text-brand-600 w-4 h-4"
                />
                <span>Worksite Transport / Pickup</span>
              </label>
            </div>
          </div>

          {/* Equipment note */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Equipment & Tools Note
            </label>
            <input
              type="text"
              value={equipmentRequirements}
              onChange={(e) => setEquipmentRequirements(e.target.value)}
              placeholder="e.g. Sickles provided; bring protective headgear"
              className="w-full p-3 rounded-xl border border-gray-300 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => {
                if (handleValidate()) setIsPreviewOpen(true);
              }}
              icon={<Eye className="h-4 w-4" />}
            >
              Preview Listing
            </Button>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handlePublish}
              isLoading={isLoading}
              icon={<CheckCircle className="h-4 w-4" />}
            >
              {existingJob ? 'Save Changes' : 'Publish Job Listing'}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Job Listing Preview" maxWidth="lg">
        <div className="space-y-4 text-sm text-gray-800">
          <div>
            <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
              {category}
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-2">{title || 'Untitled Job'}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {villageOrTown}, {district} • Posted by {currentEmployerProfile?.businessOrIndividualName}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-xl text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Daily Wage</span>
              <strong className="text-brand-700 text-base">₹{dailyWage} / day</strong>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Workers</span>
              <strong>{workersNeeded} Needed</strong>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Date</span>
              <strong>{workDate}</strong>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Time</span>
              <strong>{startTime}</strong>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase mb-1">Description:</h4>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-gray-100">
              {description}
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)}>
              Edit Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsPreviewOpen(false);
                handlePublish();
              }}
            >
              Confirm & Publish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
