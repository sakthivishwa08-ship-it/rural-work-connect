import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Search,
  ShieldCheck,
  CheckCircle,
  PhoneCall,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { VoiceSearchInput } from '../components/common/VoiceSearchInput';
import { JobCard } from '../components/jobs/JobCard';
import { WORK_CATEGORIES } from '../lib/locations';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';

interface LandingPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenEmergency: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenEmergency }) => {
  const { jobs, currentUser } = useApp();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const publishedJobs = jobs.filter((j) => j.status === 'published').slice(0, 4);

  const handleSearchSubmit = () => {
    onNavigate('job-search', { query: searchTerm });
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-emerald-50/50 to-white pt-8 pb-12 sm:pt-16 sm:pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 text-brand-900 text-xs sm:text-sm font-semibold mb-6 border border-brand-200">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <span>தினக்கூலி வேலை & தொழிலாளர் இணைப்பு மேடை</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto mb-4">
            Connecting Rural Workers & Trusted Employers Across{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-600 to-accent-600">
              India
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            {t.subTagline} Find daily-wage agricultural, construction, and household work nearby with guaranteed fair wages.
          </p>

          {/* Hero Voice Search Box */}
          <div className="max-w-xl mx-auto mb-8">
            <VoiceSearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearchSubmit}
              placeholder="Search by work (e.g. Masonry, Harvesting) or Village..."
            />
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => onNavigate('job-search')}
              icon={<Search className="h-5 w-5" />}
            >
              {t.nav.findJobs}
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => onNavigate(currentUser ? 'create-job' : 'signup')}
              icon={<Users className="h-5 w-5 text-brand-600" />}
            >
              {t.nav.findWorkers}
            </Button>
          </div>

          {/* Quick stats or key assurances */}
          <div className="mt-10 pt-8 border-t border-emerald-100/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-4xl mx-auto text-xs sm:text-sm">
            <div className="p-2">
              <span className="block font-bold text-gray-900 text-base sm:text-lg">100% Free</span>
              <span className="text-gray-500">Zero fees for daily workers</span>
            </div>
            <div className="p-2">
              <span className="block font-bold text-gray-900 text-base sm:text-lg">Daily Wages</span>
              <span className="text-gray-500">Cash on site or direct UPI</span>
            </div>
            <div className="p-2">
              <span className="block font-bold text-gray-900 text-base sm:text-lg">Voice Search</span>
              <span className="text-gray-500">Speak in Tamil, Hindi, English</span>
            </div>
            <div className="p-2">
              <span className="block font-bold text-gray-900 text-base sm:text-lg">Safety First</span>
              <span className="text-gray-500">Emergency & 112 direct links</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Latest Work Available Nearby
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Real daily jobs posted by verified rural landowners and contractors
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('job-search')}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            View All Jobs
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {publishedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={(id) => onNavigate('job-details', { jobId: id })}
              onApply={(id) => onNavigate('job-details', { jobId: id })}
            />
          ))}
        </div>
      </section>

      {/* Work Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore Rural Work by Category
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Find daily wage employment matching your specific skills and experience
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {WORK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onNavigate('job-search', { category: cat })}
              className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-brand-500 hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold mb-3 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-gray-900 block leading-tight mb-1 group-hover:text-brand-700">
                  {cat}
                </span>
                <span className="text-[11px] text-gray-400">View daily jobs →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Safety & Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-brand-800 to-gray-900 text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-4">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Community</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
              Safety, Mutual Respect & Transparent Wages
            </h3>

            <p className="text-emerald-100 text-xs sm:text-sm mb-6 leading-relaxed">
              No middleman commission. Direct communication between farm owners, contractors, and daily wage workers. With verified identity reviews and 24x7 emergency helpline access.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('safety')}
                className="bg-white text-emerald-900 hover:bg-emerald-50 border-none font-bold"
              >
                Read Safety Guidelines
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={onOpenEmergency}
                className="text-white border-white/40 hover:bg-white/10"
                icon={<PhoneCall className="h-4 w-4 text-red-300" />}
              >
                Helpline Contacts
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
