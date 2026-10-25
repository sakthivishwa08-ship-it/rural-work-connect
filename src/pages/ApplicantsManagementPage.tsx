import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  MessageSquare,
  Briefcase,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

interface ApplicantsManagementPageProps {
  onNavigate: (page: string, params?: any) => void;
  jobId?: string;
}

export const ApplicantsManagementPage: React.FC<ApplicantsManagementPageProps> = ({
  onNavigate,
  jobId,
}) => {
  const {
    currentEmployerProfile,
    jobs,
    applications,
    updateApplicationStatus,
    startOrGetConversation,
  } = useApp();
  const { t } = useI18n();

  const [selectedJobFilter, setSelectedJobFilter] = useState<string>(jobId || '');

  // Filter jobs of current employer
  const myJobs = jobs.filter(
    (j) => currentEmployerProfile && j.employerId === currentEmployerProfile.id
  );
  const myJobIds = myJobs.map((j) => j.id);

  // Relevant applications
  const relevantApps = applications.filter((app) => {
    if (!myJobIds.includes(app.jobId)) return false;
    if (selectedJobFilter && app.jobId !== selectedJobFilter) return false;
    return true;
  });

  const handleAccept = async (appId: string) => {
    await updateApplicationStatus(appId, 'accepted');
  };

  const handleReject = async (appId: string) => {
    await updateApplicationStatus(appId, 'rejected');
  };

  const handleChat = (workerUserId: string, relatedJobId: string) => {
    // In demo data, worker user id is user-worker-1 or user-worker-2
    const convId = startOrGetConversation(workerUserId, relatedJobId);
    onNavigate('messaging', { conversationId: convId });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('employer-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Job Applicants
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Review applicant qualifications, accept worker applications, and confirm worksite teams
          </p>
        </div>

        {/* Filter by Job */}
        {myJobs.length > 0 && (
          <div className="min-w-[220px]">
            <select
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold"
            >
              <option value="">All My Posted Jobs ({myJobs.length})</option>
              {myJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {relevantApps.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No Applicants for this Job"
          description="Workers in your district have not applied yet. Ensure your daily wage is competitive and work location details are clear."
          actionText="View Your Jobs"
          onAction={() => onNavigate('employer-dashboard')}
        />
      ) : (
        <div className="space-y-4">
          {relevantApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-gray-900 text-lg">
                    {app.workerName}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{app.workerRating > 0 ? app.workerRating : 'New Worker'}</span>
                  </div>
                  <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'pending' ? 'warning' : 'neutral'} size="sm">
                    {app.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="text-xs text-gray-500">
                  Applied for: <strong className="text-gray-800">{app.jobTitle}</strong>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                  <span>Experience: <strong>{app.workerExperience} Years</strong></span>
                  {app.workerDistrict && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {app.workerDistrict}
                    </span>
                  )}
                  <span className="font-bold text-brand-700">
                    Proposed Wage: ₹{app.proposedWage || app.jobWage} / day
                  </span>
                </div>

                {app.workerSkills && app.workerSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {app.workerSkills.map((s) => (
                      <span key={s} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {app.message && (
                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                    "{app.message}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChat('user-worker-1', app.jobId)}
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  Message
                </Button>

                {app.status === 'pending' && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(app.id)}
                      icon={<XCircle className="h-4 w-4" />}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAccept(app.id)}
                      icon={<CheckCircle className="h-4 w-4" />}
                    >
                      Accept & Book
                    </Button>
                  </>
                )}

                {app.status === 'accepted' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('bookings')}
                    icon={<Calendar className="h-4 w-4 text-emerald-600" />}
                  >
                    View Booking
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
