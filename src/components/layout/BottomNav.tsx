import React from 'react';
import { Home, Briefcase, PlusCircle, Users, MessageSquare, User } from 'lucide-react';
import { useApp } from '../../lib/store';
import { useI18n } from '../../i18n';

interface BottomNavProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onNavigate, currentPage }) => {
  const { currentUser, activeRoleMode, conversations } = useApp();
  const { t } = useI18n();

  const unreadMessagesCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const getDashboardPage = () => {
    if (!currentUser) return 'landing';
    if (currentUser.role === 'admin') return 'admin';
    return activeRoleMode === 'worker' ? 'worker-dashboard' : 'employer-dashboard';
  };

  const getProfilePage = () => {
    if (!currentUser) return 'login';
    return activeRoleMode === 'employer' ? 'employer-profile' : 'worker-profile';
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around safe-bottom">
      {/* Home / Dashboard */}
      <button
        onClick={() => onNavigate(getDashboardPage())}
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
          ['landing', 'worker-dashboard', 'employer-dashboard', 'admin'].includes(currentPage)
            ? 'text-brand-600 font-bold'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Home className="h-5 w-5 mb-0.5" />
        <span className="text-[10px] leading-tight">{t.nav.home}</span>
      </button>

      {/* Jobs or Workers */}
      {activeRoleMode === 'worker' ? (
        <button
          onClick={() => onNavigate('job-search')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentPage === 'job-search' ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Briefcase className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.nav.findJobs}</span>
        </button>
      ) : (
        <button
          onClick={() => onNavigate('worker-discovery')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentPage === 'worker-discovery' ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.nav.findWorkers}</span>
        </button>
      )}

      {/* Center Action: Post Job or Applications */}
      {activeRoleMode === 'employer' ? (
        <button
          onClick={() => onNavigate('create-job')}
          className="flex flex-col items-center justify-center -mt-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full p-3 shadow-lg shadow-brand-600/30 transition-transform active:scale-95"
          aria-label="Post Job"
        >
          <PlusCircle className="h-6 w-6" />
        </button>
      ) : (
        <button
          onClick={() => onNavigate('applications')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentPage === 'applications' ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Briefcase className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.nav.myApplications}</span>
        </button>
      )}

      {/* Messages */}
      <button
        onClick={() => onNavigate(currentUser ? 'messaging' : 'login')}
        className={`relative flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
          currentPage === 'messaging' ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <MessageSquare className="h-5 w-5 mb-0.5" />
        <span className="text-[10px] leading-tight">{t.nav.messages}</span>
        {unreadMessagesCount > 0 && (
          <span className="absolute top-0 right-3 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadMessagesCount}
          </span>
        )}
      </button>

      {/* Profile */}
      <button
        onClick={() => onNavigate(getProfilePage())}
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
          ['worker-profile', 'employer-profile', 'settings'].includes(currentPage)
            ? 'text-brand-600 font-bold'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <User className="h-5 w-5 mb-0.5" />
        <span className="text-[10px] leading-tight">{t.nav.profile}</span>
      </button>
    </div>
  );
};
