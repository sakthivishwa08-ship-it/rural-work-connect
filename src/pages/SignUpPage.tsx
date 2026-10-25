import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Mail, Lock, Phone, MapPin, Globe, AlertCircle } from 'lucide-react';
import { INDIAN_STATES_DISTRICTS, isValidPinCode } from '../lib/locations';
import { SUPPORTED_LANGUAGES } from '../i18n/languagesList';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { UserRole } from '../types';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { signUp } = useApp();
  const { t, language } = useI18n();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const [preferredLang, setPreferredLang] = useState(language);
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Madurai');
  const [villageOrTown, setVillageOrTown] = useState('');
  const [pincode, setPincode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStateObj = INDIAN_STATES_DISTRICTS.find((s) => s.state === state);
  const districts = selectedStateObj ? selectedStateObj.districts : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !email.trim() || !villageOrTown.trim() || !pincode.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isValidPinCode(pincode)) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setIsLoading(true);
    const result = await signUp({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password,
      role,
      preferredLanguage: preferredLang,
      state,
      district,
      villageOrTown: villageOrTown.trim(),
      pincode: pincode.trim(),
    });
    setIsLoading(false);

    if (result.success) {
      onNavigate('email-verification');
    } else {
      setError(result.error || 'Failed to register account.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-md p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <UserCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t.auth.registerTitle}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t.auth.registerSubtitle}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {t.auth.accountType}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'worker', title: t.roles.worker, desc: 'Find daily jobs & get paid' },
                { id: 'employer', title: t.roles.employer, desc: 'Post jobs & hire workers' },
                { id: 'both', title: t.roles.both, desc: 'Worker & Employer combined' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id as UserRole)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === item.id
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/30'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className={`block font-bold text-sm ${role === item.id ? 'text-brand-800' : 'text-gray-900'}`}>
                    {item.title}
                  </span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.auth.fullName}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramanathan K."
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.auth.phoneNumber}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98421 23456"
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email & Preferred Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.auth.emailAddress} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.auth.preferredLanguage}
              </label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* State & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.jobForm.state}
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  const firstDist = INDIAN_STATES_DISTRICTS.find((s) => s.state === e.target.value)?.districts[0] || '';
                  setDistrict(firstDist);
                }}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
                {t.jobForm.district}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {districts.map((d) => (
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
                {t.jobForm.villageOrTown}
              </label>
              <input
                type="text"
                required
                value={villageOrTown}
                onChange={(e) => setVillageOrTown(e.target.value)}
                placeholder="e.g. Alanganallur"
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.jobForm.pincode}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="625501"
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.auth.password} *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {t.auth.confirmPassword}
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 text-[11px] text-gray-500 leading-relaxed">
            {t.auth.privacyNote}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              {t.auth.registerBtn}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          {t.auth.alreadyHaveAccount}{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-brand-700 font-bold hover:underline"
          >
            {t.auth.signInBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
