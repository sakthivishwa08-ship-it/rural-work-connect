import React from 'react';
import { Briefcase, MapPin, Calendar, Clock, ArrowRight, XCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { ApplicationStatus } from '../types';

interface MyApplicationsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MyApplicationsPage: React.FC<MyApplicationsPageProps> = ({ onNavigate }) => {
  const { currentWorkerProfile, applications, updateApplicationStatus } = useApp();
  const { t } = useI18n();

  const myApps = applications.filter(
    (app) => currentWorkerProfile && app.workerId === currentWorkerProfile.id
  );

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success" size="sm">Accepted (Work Scheduled)</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="sm">Declined</Badge>;
      case 'withdrawn':
        return <Badge variant="neutral" size="sm">Withdrawn by You</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const handleWithdraw = async (appId: string) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      await updateApplicationStatus(appId, 'withdrawn');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          My Job Applications
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Track employer responses and scheduled worksite confirmations
        </p>
      </div>

      {myApps.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="No Applications Submitted"
          description="You have not applied for any daily-wage jobs yet. Browse nearby agriculture, construction, and general work listings."
          actionText="Find Jobs Nearby"
          onAction={() => onNavigate('job-search')}
        />
      ) : (
        <div className="space-y-4">
          {myApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(app.status)}
                  <span className="text-xs text-gray-400 font-medium">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 hover:text-brand-700 transition-colors cursor-pointer"
                    onClick={() => onNavigate('job-details', { jobId: app.jobId })}>
                  {app.jobTitle || 'Job Title'}
                </h3>

                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  {app.jobLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {app.jobLocation}
                    </span>
                  )}
                  {app.jobWorkDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      Work Date: {app.jobWorkDate}
                    </span>
                  )}
                  <span className="font-bold text-brand-700">
                    Proposed Wage: ₹{app.proposedWage || app.jobWage} / day
                  </span>
                </div>

                {app.message && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 italic">
                    "{app.message}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                {app.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleWithdraw(app.id)}
                    className="text-red-600 hover:bg-red-50 text-xs"
                  >
                    Withdraw Application
                  </Button>
                )}

                {app.status === 'accepted' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('bookings')}
                    icon={<Calendar className="h-4 w-4" />}
                  >
                    View Scheduled Booking
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('job-details', { jobId: app.jobId })}
                >
                  View Job
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
