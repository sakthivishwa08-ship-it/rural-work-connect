import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { BookingStatus } from '../types';

interface BookingDetailsHistoryPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const BookingDetailsHistoryPage: React.FC<BookingDetailsHistoryPageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    currentWorkerProfile,
    currentEmployerProfile,
    bookings,
    updateBookingStatus,
    submitReview,
    startOrGetConversation,
  } = useApp();
  const { t } = useI18n();

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual', 'On-Time Payment']);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Filter bookings belonging to current user (as worker or employer)
  const myBookings = bookings.filter((b) => {
    const isWorker = currentWorkerProfile && b.workerId === currentWorkerProfile.id;
    const isEmployer = currentEmployerProfile && b.employerId === currentEmployerProfile.id;
    return isWorker || isEmployer;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success" size="sm">{t.status.accepted}</Badge>;
      case 'in_progress':
        return <Badge variant="info" size="sm">{t.status.in_progress}</Badge>;
      case 'completed':
        return <Badge variant="brand" size="sm">{t.status.completed}</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">{t.status.pending}</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="sm">{t.status.rejected}</Badge>;
      case 'cancelled':
        return <Badge variant="neutral" size="sm">{t.status.cancelled}</Badge>;
      case 'disputed':
        return <Badge variant="danger" size="sm">{t.status.disputed}</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    await updateBookingStatus(bookingId, newStatus);
  };

  const handleOpenReview = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBookingId) return;

    setIsSubmittingReview(true);
    await submitReview(selectedBookingId, rating, feedback, selectedTags);
    setIsSubmittingReview(false);
    setIsReviewModalOpen(false);
    setFeedback('');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {t.bookingsPage.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {t.bookingsPage.subtitle}
        </p>
      </div>

      {myBookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title={t.bookingsPage.noBookingsTitle}
          description={t.bookingsPage.noBookingsDesc}
          actionText={t.bookingsPage.searchJobsBtn}
          onAction={() => onNavigate('job-search')}
        />
      ) : (
        <div className="space-y-4">
          {myBookings.map((b) => {
            const isWorker = currentWorkerProfile && b.workerId === currentWorkerProfile.id;
            const isEmployer = currentEmployerProfile && b.employerId === currentEmployerProfile.id;
            const alreadyReviewed = isWorker ? b.hasWorkerReviewed : b.hasEmployerReviewed;

            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-xs space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(b.status)}
                    <span className="text-xs text-gray-400 font-medium">
                      #{b.id.slice(-6)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{t.bookingsPage.workDate}: <strong>{b.workDate}</strong> at {b.startTime.slice(0, 5)}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                      {b.jobTitle || b.workDescription}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {b.workDescription}
                    </p>

                    <div className="flex items-start gap-1.5 text-xs text-gray-500 pt-1">
                      <MapPin className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span>{b.workLocation}</span>
                    </div>

                    <div className="text-xs text-gray-500 pt-1">
                      {isWorker ? (
                        <span>Employer: <strong className="text-gray-900">{b.employerName}</strong></span>
                      ) : (
                        <span>Worker: <strong className="text-gray-900">{b.workerName}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Financial Settlement Card */}
                  <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                        {t.bookingsPage.agreedWage}
                      </span>
                      <span className="text-2xl font-extrabold text-brand-700 block mt-0.5">
                        ₹{b.agreedWage} <span className="text-xs font-normal text-gray-500">/ day</span>
                      </span>
                      <span className="text-xs text-gray-500 block mt-1">
                        Total: <strong>₹{b.totalAmount}</strong> ({b.durationDays} {b.durationDays > 1 ? 'days' : 'day'})
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200/60 text-[11px] text-gray-500">
                      Payment: Recorded Cash at Worksite / UPI
                    </div>
                  </div>
                </div>

                {/* Status Transition Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const convId = startOrGetConversation(
                          isWorker ? 'user-employer-1' : 'user-worker-1',
                          b.jobId
                        );
                        onNavigate('messaging', { conversationId: convId });
                      }}
                      icon={<MessageSquare className="h-4 w-4" />}
                    >
                      {t.actions.messageUser}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Worker Accept/Reject if pending */}
                    {isWorker && b.status === 'pending' && (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusChange(b.id, 'rejected')}
                          icon={<XCircle className="h-4 w-4" />}
                        >
                          {t.actions.reject}
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(b.id, 'accepted')}
                          icon={<CheckCircle className="h-4 w-4" />}
                        >
                          {t.actions.accept}
                        </Button>
                      </>
                    )}

                    {/* Progress to In Progress */}
                    {b.status === 'accepted' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusChange(b.id, 'in_progress')}
                      >
                        {t.bookingsPage.startWorkToday}
                      </Button>
                    )}

                    {/* Mark Completed */}
                    {(b.status === 'accepted' || b.status === 'in_progress') && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusChange(b.id, 'completed')}
                        icon={<FileCheck className="h-4 w-4" />}
                      >
                        {t.bookingsPage.markCompleted}
                      </Button>
                    )}

                    {/* Submit Review after completion */}
                    {b.status === 'completed' && (
                      alreadyReviewed ? (
                        <Badge variant="success" size="md">
                          {t.bookingsPage.reviewSubmitted}
                        </Badge>
                      ) : (
                        <Button
                          variant="warm"
                          size="sm"
                          onClick={() => handleOpenReview(b.id)}
                          icon={<Star className="h-4 w-4" />}
                        >
                          {t.bookingsPage.leaveReviewBtn}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Submission Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Submit Worksite Review & Rating" maxWidth="md">
        <div className="space-y-4 text-sm text-gray-800">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Star Rating (1 to 5 Stars) *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-base font-bold text-gray-900 ml-2">
                {rating}.0 / 5.0
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Select Verified Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Punctual',
                'Hardworking',
                'On-Time Payment',
                'Safe Worksite',
                'Provided Good Food',
                'Clean Work',
                'Respectful',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Written Feedback *
            </label>
            <textarea
              rows={3}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share honest feedback about the wage settlement, worksite safety, and work quality..."
              className="w-full p-3 rounded-xl border border-gray-300 text-sm"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsReviewModalOpen(false)}>
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitReview}
              isLoading={isSubmittingReview}
              disabled={!feedback.trim()}
            >
              Submit Verified Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
