import React from 'react';
import { Bell, CheckCheck, Briefcase, Calendar, Star, ShieldAlert, ArrowRight } from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

interface NotificationsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const { t } = useI18n();

  const myNotifications = notifications.filter(
    (n) => currentUser && n.recipientId === currentUser.id
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Briefcase className="h-5 w-5 text-brand-600" />;
      case 'booking':
        return <Calendar className="h-5 w-5 text-sky-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-amber-500" />;
      case 'safety':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t.nav.notifications}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Updates on applications, hiring decisions, bookings, and rewards
          </p>
        </div>

        {myNotifications.some((n) => !n.isRead) && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            icon={<CheckCheck className="h-4 w-4" />}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-6 w-6" />}
          title="No Notifications"
          description="You're all caught up! You'll receive instant alerts here when employers book you or workers apply."
        />
      ) : (
        <div className="space-y-3">
          {myNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.linkUrl) {
                  const targetPage = notif.linkUrl.replace('/', '');
                  onNavigate(targetPage);
                }
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                notif.isRead
                  ? 'bg-white border-gray-200/80 hover:bg-gray-50'
                  : 'bg-brand-50/50 border-brand-200 shadow-xs hover:bg-brand-50'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-gray-100 flex-shrink-0 shadow-xs">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-sm font-bold ${notif.isRead ? 'text-gray-900' : 'text-brand-950'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                  {notif.body}
                </p>

                {notif.linkUrl && (
                  <span className="text-[11px] font-bold text-brand-700 hover:underline inline-flex items-center gap-1">
                    <span>View Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
