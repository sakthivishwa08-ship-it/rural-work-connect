import React from 'react';
import { Bookmark, Briefcase } from 'lucide-react';
import { useApp } from '../lib/store';
import { JobCard } from '../components/jobs/JobCard';
import { EmptyState } from '../components/common/EmptyState';

interface SavedJobsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const SavedJobsPage: React.FC<SavedJobsPageProps> = ({ onNavigate }) => {
  const { jobs, savedJobIds } = useApp();

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-amber-500 fill-amber-500" />
          <span>Saved Jobs</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Your bookmarked daily-wage listings to review or apply later
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-6 w-6" />}
          title="No Saved Jobs"
          description="You haven't bookmarked any jobs yet. Tap the bookmark icon on any job card to save it for quick reference."
          actionText="Search Available Jobs"
          onAction={() => onNavigate('job-search')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={(id) => onNavigate('job-details', { jobId: id })}
              onApply={(id) => onNavigate('job-details', { jobId: id })}
            />
          ))}
        </div>
      )}
    </div>
  );
};
