import React, { useState } from 'react';
import {
  Globe,
  Bell,
  MessageSquare,
  Bookmark,
  Shield,
  Coins,
  Receipt,
  User,
  LogOut,
  Briefcase,
  Users,
  PlusCircle,
  Menu,
  X,
  Repeat,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../lib/store';
import { useI18n } from '../../i18n';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface HeaderProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const {
    currentUser,
    logout,
    activeRoleMode,
    switchRoleMode,
    notifications,
    conversations,
    creditAccount,
    isAdmin,
  } = useApp();
  const { language, setLanguage, languages, t } = useI18n();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const isBothRole = currentUser?.role === 'both';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Platform Name */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight block leading-tight">
                Rural Work <span className="text-brand-600">Connect</span>
              </span>
              <span className="text-[11px] sm:text-xs text-gray-500 font-medium block leading-none">
                கிராமப்புற வேலை இணைப்பு
              </span>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => onNavigate(currentUser ? (isAdmin ? 'admin' : activeRoleMode === 'worker' ? 'worker-dashboard' : 'employer-dashboard') : 'landing')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                ['worker-dashboard', 'employer-dashboard', 'landing', 'admin'].includes(currentPage)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {t.nav.dashboard}
            </button>

            <button
              onClick={() => onNavigate('job-search')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentPage === 'job-search'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {t.nav.findJobs}
            </button>

            <button
              onClick={() => onNavigate('worker-discovery')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentPage === 'worker-discovery'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {t.nav.findWorkers}
            </button>

            {currentUser && (activeRoleMode === 'employer' || isBothRole) && (
              <button
                onClick={() => onNavigate('create-job')}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-brand-700 hover:bg-brand-50 flex items-center gap-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                <span>{t.nav.postJob}</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('safety')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'safety'
                  ? 'bg-red-50 text-red-700'
                  : 'text-red-700/80 hover:text-red-700 hover:bg-red-50'
              }`}
            >
              <Shield className="h-4 w-4 text-red-600" />
              <span>{t.nav.safety}</span>
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dual Role Mode Toggle Switcher */}
            {currentUser && isBothRole && (
              <button
                onClick={switchRoleMode}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-brand-300 bg-brand-50 text-brand-800 hover:bg-brand-100"
                title="Switch between Worker and Employer mode"
              >
                <Repeat className="h-3.5 w-3.5 text-brand-600" />
                <span>Mode: {activeRoleMode === 'worker' ? 'Worker' : 'Employer'}</span>
              </button>
            )}

            {/* Language Selector Dropdown (22 Eighth Schedule languages) */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 text-xs sm:text-sm font-medium border border-gray-200"
                aria-label="Select Language"
              >
                <Globe className="h-4 w-4 text-brand-600 flex-shrink-0" />
                <span className="hidden sm:inline uppercase font-bold text-xs">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Eighth Schedule Languages
                  </div>
                  <div className="divide-y divide-gray-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between transition-colors ${
                          language === lang.code
                            ? 'bg-brand-50 text-brand-800 font-bold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{lang.nativeName}</span>
                          <span className="text-[11px] text-gray-400">{lang.name}</span>
                        </div>
                        {lang.isImplemented ? (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            Beta
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* If Authenticated: Notifications & Messages & User Avatar */}
            {currentUser ? (
              <>
                {/* Messages Icon */}
                <button
                  onClick={() => onNavigate('messaging')}
                  className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Messages"
                >
                  <MessageSquare className="h-5 w-5" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                {/* Notifications Icon */}
                <button
                  onClick={() => onNavigate('notifications')}
                  className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-gray-200 hover:border-brand-400 hover:bg-gray-50 transition-all"
                  >
                    <img
                      src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop&crop=face'}
                      alt={currentUser.fullName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                    />
                    <span className="hidden md:block text-xs font-semibold text-gray-800 pr-1">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <div className="font-bold text-gray-900 text-sm truncate">{currentUser.fullName}</div>
                        <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Badge variant="brand" size="sm">
                            {currentUser.role.toUpperCase()}
                          </Badge>
                          {creditAccount && (
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Coins className="h-3 w-3 text-amber-600" />
                              {creditAccount.balance} cr
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            onNavigate(currentUser.role === 'employer' ? 'employer-profile' : 'worker-profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{t.nav.profile}</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('applications');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <span>{t.nav.myApplications}</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('bookings');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{t.nav.myBookings}</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('credits');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Coins className="h-4 w-4 text-amber-500" />
                          <span>{t.nav.credits}</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('payments');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Receipt className="h-4 w-4 text-emerald-500" />
                          <span>{t.nav.payments}</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('saved-jobs');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Bookmark className="h-4 w-4 text-gray-500" />
                          <span>{t.nav.savedJobs}</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              onNavigate('admin');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 flex items-center gap-2 mt-1"
                          >
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span>{t.nav.admin}</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-gray-100">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            onNavigate('landing');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t.nav.logout}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('login')}
                  className="hidden sm:inline-flex"
                >
                  {t.nav.login}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('signup')}
                >
                  {t.nav.signup}
                </Button>
              </div>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => {
              onNavigate('job-search');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-brand-50"
          >
            {t.nav.findJobs}
          </button>
          <button
            onClick={() => {
              onNavigate('worker-discovery');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-brand-50"
          >
            {t.nav.findWorkers}
          </button>
          <button
            onClick={() => {
              onNavigate('safety');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            {t.nav.safety}
          </button>
          <button
            onClick={() => {
              onNavigate('help');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-brand-50"
          >
            {t.nav.help}
          </button>
          <button
            onClick={() => {
              onNavigate('privacy');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-brand-50"
          >
            Privacy & Terms
          </button>
        </div>
      )}
    </header>
  );
};
