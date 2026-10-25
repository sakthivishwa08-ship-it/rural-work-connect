import React, { useState } from 'react';
import { Globe, Bell, UserX, Shield, Check, AlertTriangle } from 'lucide-react';
import { useI18n } from '../i18n';
import { useApp } from '../lib/store';
import { Button } from '../components/common/Button';

interface SettingsLanguagePageProps {
  onNavigate: (page: string) => void;
}

export const SettingsLanguagePage: React.FC<SettingsLanguagePageProps> = ({ onNavigate }) => {
  const { language, setLanguage, languages } = useI18n();
  const { currentUser, updateUserProfile, logout } = useApp();

  const [notificationSound, setNotificationSound] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? Your listings and availability will be paused.')) {
      await updateUserProfile({ isDeactivated: true });
      await logout();
      onNavigate('landing');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Settings & Language Preferences
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Customize your display language, notification alerts, and account settings
        </p>
      </div>

      {/* Language Selector Hub (All 22 Eighth Schedule Languages) */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-extrabold text-gray-900">
            Select Preferred Indian Language
          </h2>
        </div>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          The application is prepared for English and all 22 official languages listed in the Eighth Schedule of the Indian Constitution. Tamil, Hindi, Telugu, and English are actively implemented.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                language === lang.code
                  ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/30'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div>
                <span className={`block font-bold text-sm leading-tight ${
                  language === lang.code ? 'text-brand-900' : 'text-gray-900'
                }`}>
                  {lang.nativeName}
                </span>
                <span className="text-[11px] text-gray-400 block mt-0.5">{lang.name}</span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                {lang.isImplemented ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                    Beta
                  </span>
                )}
                {language === lang.code && (
                  <Check className="h-4 w-4 text-brand-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-sky-600" />
          <h2 className="text-lg font-extrabold text-gray-900">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-gray-700">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer">
            <div>
              <strong className="block font-bold text-gray-900">Audio Chime on New Booking</strong>
              <span className="text-gray-500 text-xs">Play an alert chime when a nearby job booking arrives</span>
            </div>
            <input
              type="checkbox"
              checked={notificationSound}
              onChange={(e) => setNotificationSound(e.target.checked)}
              className="w-5 h-5 text-brand-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer">
            <div>
              <strong className="block font-bold text-gray-900">SMS / WhatsApp Reminders</strong>
              <span className="text-gray-500 text-xs">Receive work start time and location reminders via SMS</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-5 h-5 text-brand-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Account Deactivation */}
      <div className="bg-white rounded-3xl border border-red-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-extrabold text-red-900 mb-2 flex items-center gap-2">
          <UserX className="h-5 w-5 text-red-600" />
          <span>Account Deactivation</span>
        </h2>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Deactivating your account pauses all your active job postings and hides your profile from worker discovery searches. You may reactivate at any time by logging back in.
        </p>

        <Button
          variant="danger"
          size="sm"
          onClick={handleDeactivate}
        >
          Deactivate My Account
        </Button>
      </div>
    </div>
  );
};
