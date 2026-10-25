import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  UserX,
  Trash2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ModerationActionType } from '../types';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    isAdmin,
    jobs,
    applications,
    bookings,
    reports,
    moderationActions,
    auditLogs,
    resolveReportByAdmin,
  } = useApp();

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [selectedAction, setSelectedAction] = useState<ModerationActionType>('warn');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Administrator Access Required</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">
          You must be logged in as a verified Platform Moderator or District Labour Officer to access this area.
        </p>
        <Button variant="primary" size="md" onClick={() => onNavigate('landing')}>
          Return to Home
        </Button>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === 'pending' || r.status === 'under_review');
  const resolvedReports = reports.filter((r) => r.status === 'resolved' || r.status === 'dismissed');

  const handleApplyModeration = async () => {
    if (!selectedReportId || !moderationReason.trim()) return;

    setIsProcessing(true);
    await resolveReportByAdmin(selectedReportId, selectedAction, moderationReason.trim());
    setIsProcessing(false);
    setSelectedReportId(null);
    setModerationReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 mb-2">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Safety & Compliance Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Administration & Moderation
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Logged in as {currentUser?.fullName} ({currentUser?.email})
            </p>
          </div>
        </div>

        {/* Real-time System Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-700/80">
          <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700">
            <span className="text-xs text-gray-400 block mb-1">Active Job Listings</span>
            <span className="text-2xl font-extrabold text-white">{jobs.length}</span>
            <span className="text-[11px] text-emerald-400 block mt-0.5">Across Indian districts</span>
          </div>

          <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700">
            <span className="text-xs text-gray-400 block mb-1">Applications Processed</span>
            <span className="text-2xl font-extrabold text-white">{applications.length}</span>
            <span className="text-[11px] text-sky-400 block mt-0.5">Worker submissions</span>
          </div>

          <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700">
            <span className="text-xs text-gray-400 block mb-1">Total Bookings</span>
            <span className="text-2xl font-extrabold text-white">{bookings.length}</span>
            <span className="text-[11px] text-purple-400 block mt-0.5">Confirmed works</span>
          </div>

          <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700">
            <span className="text-xs text-gray-400 block mb-1">Pending Reports</span>
            <span className="text-2xl font-extrabold text-red-400">{pendingReports.length}</span>
            <span className="text-[11px] text-red-300 block mt-0.5">Action required</span>
          </div>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Safety & Fraud Reports Queue ({pendingReports.length})</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review flagged job listings, suspicious fees, harassment, and illegal activity
            </p>
          </div>
        </div>

        {pendingReports.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 text-gray-500 text-sm">
            <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            No pending safety reports! All user listings and reports are resolved.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div
                key={report.id}
                className="p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/40 text-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="danger" size="sm">
                      {report.reason.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium">
                      Reported by {report.reporterName || 'Anonymous Worker'}
                    </span>
                    <span className="text-xs text-gray-400">• {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>

                  {report.jobTitle && (
                    <div className="font-bold text-gray-900 text-base">
                      Flagged Job: {report.jobTitle}
                    </div>
                  )}

                  <p className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-amber-100 leading-relaxed">
                    "{report.description}"
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedReportId(report.id);
                      setSelectedAction('remove_job');
                    }}
                  >
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Moderation Action Drawer/Card when selected */}
      {selectedReportId && (
        <div className="bg-red-50 rounded-3xl border border-red-200 p-6 shadow-md">
          <h3 className="font-bold text-red-900 text-base mb-2 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-700" />
            <span>Apply Enforcement Action for Report #{selectedReportId.slice(-6)}</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1.5">
                Select Administrative Action
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'warn', label: 'Issue Official Warning' },
                  { id: 'remove_job', label: 'Remove Job Listing' },
                  { id: 'suspend_account', label: 'Suspend Account' },
                  { id: 'ban_account', label: 'Permanent Ban' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setSelectedAction(act.id as ModerationActionType)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedAction === act.id
                        ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-400'
                        : 'bg-white text-gray-700 border-red-200 hover:bg-red-100/50'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                Moderator Reason & Audit Notes *
              </label>
              <textarea
                rows={2}
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                placeholder="State the regulatory grounds (e.g. Zero-advance fee violation, wage discrimination, abusive conduct)..."
                className="w-full p-3 rounded-xl border border-red-200 bg-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="danger"
                size="md"
                onClick={handleApplyModeration}
                isLoading={isProcessing}
                disabled={!moderationReason.trim()}
              >
                Execute Moderation Action
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedReportId(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation History & Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-8 shadow-xs">
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <span>Moderation Audit Trail</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Moderator</th>
                <th className="py-3 px-4">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {moderationActions.map((action) => (
                <tr key={action.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4 whitespace-nowrap">
                    {new Date(action.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {action.targetUserName || action.targetUserId || 'Entity'}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={action.action === 'ban_account' ? 'danger' : 'warning'} size="sm">
                      {action.action.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {action.moderatorName || 'Admin'}
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                    {action.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
