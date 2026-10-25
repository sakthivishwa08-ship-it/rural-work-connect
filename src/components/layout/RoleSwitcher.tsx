import React from 'react';
import { Repeat, Briefcase, Users } from 'lucide-react';
import { useApp } from '../../lib/store';
import { useI18n } from '../../i18n';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, activeRoleMode, switchRoleMode } = useApp();
  const { t } = useI18n();

  if (!currentUser || currentUser.role !== 'both') {
    return null;
  }

  const isWorker = activeRoleMode === 'worker';

  return (
    <div className="bg-gradient-to-r from-brand-700 via-emerald-800 to-accent-800 text-white px-4 py-2 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-brand-200">Dual-Role Account:</span>
          <span>Currently acting as <strong>{isWorker ? 'Daily-Wage Worker' : 'Worksite Employer'}</strong></span>
        </div>

        <button
          onClick={switchRoleMode}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-gray-900 rounded-lg font-bold text-xs hover:bg-gray-100 shadow transition-all active:scale-95"
        >
          <Repeat className="h-3.5 w-3.5 text-brand-700" />
          <span>Switch to {isWorker ? 'Employer View (Post & Hire)' : 'Worker View (Find Work)'}</span>
        </button>
      </div>
    </div>
  );
};
