import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Calendar,
  X,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { JobCard } from '../components/jobs/JobCard';
import { VoiceSearchInput } from '../components/common/VoiceSearchInput';
import { JobFiltersModal, FilterState } from '../components/jobs/JobFiltersModal';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';

interface JobSearchPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialQuery?: string;
  initialCategory?: string;
}

export const JobSearchPage: React.FC<JobSearchPageProps> = ({
  onNavigate,
  initialQuery = '',
  initialCategory = '',
}) => {
  const { jobs, applications, currentWorkerProfile } = useApp();
  const { t, language } = useI18n();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(
    language === 'ta'
      ? ['கொத்தனார்', 'அறுவடை', 'பெயிண்டிங்', 'மேலூர்']
      : language === 'hi'
      ? ['राजमिस्त्री', 'कटाई', 'रंगाई', 'ड्राइवर']
      : ['Harvesting', 'Masonry', 'Painting', 'Melur']
  );

  const [filters, setFilters] = useState<FilterState>({
    state: '',
    district: '',
    category: initialCategory,
    minWage: 0,
    maxWage: 2000,
    workDate: '',
    mealsOnly: false,
    sortBy: 'newest',
  });

  const handleResetFilters = () => {
    setFilters({
      state: '',
      district: '',
      category: '',
      minWage: 0,
      maxWage: 2000,
      workDate: '',
      mealsOnly: false,
      sortBy: 'newest',
    });
    setSearchQuery('');
  };

  const myAppliedJobIds = useMemo(() => {
    if (!currentWorkerProfile) return [];
    return applications
      .filter((a) => a.workerId === currentWorkerProfile.id)
      .map((a) => a.jobId);
  }, [applications, currentWorkerProfile]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Must be published or in_progress
      if (job.status !== 'published' && job.status !== 'in_progress') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchDesc = job.description.toLowerCase().includes(q);
        const matchCategory = job.category.toLowerCase().includes(q);
        const matchLocation = `${job.villageOrTown} ${job.district} ${job.pincode}`.toLowerCase().includes(q);
        const matchSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCategory && !matchLocation && !matchSkills) {
          return false;
        }
      }

      // Category filter
      if (filters.category && job.category !== filters.category) return false;

      // State & District
      if (filters.state && job.state !== filters.state) return false;
      if (filters.district && job.district !== filters.district) return false;

      // Wage
      if (job.dailyWage < filters.minWage || job.dailyWage > filters.maxWage) return false;

      // Work Date
      if (filters.workDate && job.workDate !== filters.workDate) return false;

      // Meals
      if (filters.mealsOnly && !job.mealsProvided) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'wage_high') return b.dailyWage - a.dailyWage;
      if (filters.sortBy === 'wage_low') return a.dailyWage - b.dailyWage;
      if (filters.sortBy === 'earliest') return new Date(a.workDate).getTime() - new Date(b.workDate).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [jobs, searchQuery, filters]);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.state ? 1 : 0) +
    (filters.district ? 1 : 0) +
    (filters.minWage > 0 || filters.maxWage < 2000 ? 1 : 0) +
    (filters.workDate ? 1 : 0) +
    (filters.mealsOnly ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {t.searchPage?.title || 'Find Daily-Wage Jobs'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {t.searchPage?.subtitle || 'Search open worksites in your village, town, or district with daily cash or UPI wages'}
        </p>
      </div>

      {/* Voice Search & Filter Trigger Bar */}
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex-1 min-w-[280px]">
          <VoiceSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t.searchPage?.placeholder || 'Search by job title, skill, or village name...'}
          />
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border font-bold text-sm transition-all shadow-xs ${
            activeFilterCount > 0
              ? 'bg-brand-50 border-brand-500 text-brand-800 ring-1 ring-brand-500'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>{t.searchPage?.filtersBtn || 'Filters'}</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Recent Searches Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-gray-600">
        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider flex-shrink-0">
          {t.searchPage?.popularTitle || 'Popular:'}
        </span>
        {recentSearches.map((tag) => (
          <button
            key={tag}
            onClick={() => setSearchQuery(tag)}
            className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex-shrink-0"
          >
            {tag}
          </button>
        ))}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-brand-600 font-semibold hover:underline flex items-center gap-1 flex-shrink-0 ml-auto"
          >
            <X className="h-3 w-3" />
            <span>{t.searchPage?.clearSearch || 'Clear search'}</span>
          </button>
        )}
      </div>

      {/* Active Filter Indicators */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs bg-brand-50/50 p-2.5 rounded-xl border border-brand-100">
          <span className="font-semibold text-brand-900">{t.searchPage?.activeFilters || 'Active Filters:'}</span>
          {filters.category && (
            <span className="bg-white px-2 py-0.5 rounded-md border border-brand-200 text-brand-800">
              {t.categories?.[filters.category as keyof typeof t.categories] || filters.category}
            </span>
          )}
          {filters.district && (
            <span className="bg-white px-2 py-0.5 rounded-md border border-brand-200 text-brand-800">
              {filters.district}
            </span>
          )}
          {filters.mealsOnly && (
            <span className="bg-white px-2 py-0.5 rounded-md border border-brand-200 text-brand-800">
              {t.jobDetails?.foodProvided || 'Food Provided'}
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-brand-700 font-bold hover:underline ml-auto flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t.searchPage?.resetAll || 'Reset All'}</span>
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
        <span>{filteredJobs.length} {t.searchPage?.showingCount || 'available daily jobs'}</span>
        <span className="capitalize">{t.searchPage?.sortedBy || 'Sorted by'}: {filters.sortBy.replace('_', ' ')}</span>
      </div>

      {/* Jobs Grid or Empty State */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title={t.searchPage?.noJobsTitle || 'No Matching Jobs Found'}
          description={t.searchPage?.noJobsDesc || 'Try broadening your search keywords, clearing your filters, or checking back soon as new daily jobs are posted throughout the day.'}
          actionText={t.searchPage?.clearFiltersBtn || 'Clear All Filters'}
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              hasApplied={myAppliedJobIds.includes(job.id)}
              onViewDetails={(id) => onNavigate('job-details', { jobId: id })}
              onApply={(id) => onNavigate('job-details', { jobId: id })}
            />
          ))}
        </div>
      )}

      {/* Filters Modal Component */}
      <JobFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};
