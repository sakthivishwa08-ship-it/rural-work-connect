import React, { useState } from 'react';
import {
  Receipt,
  IndianRupee,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const PaymentRecordsPage: React.FC = () => {
  const { payments, recordPayment, bookings, currentEmployerProfile } = useApp();
  const { t } = useI18n();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(bookings[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState(bookings[0]?.totalAmount || 700);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" size="sm">Paid / Settled</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending Settlement</Badge>;
      case 'processing':
        return <Badge variant="info" size="sm">Processing</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const handleRecord = async () => {
    if (!selectedBookingId || paymentAmount <= 0) return;
    setIsSubmitting(true);
    await recordPayment(selectedBookingId, paymentAmount, paymentMethod);
    setIsSubmitting(false);
    setIsRecordModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Worksite Payment Records
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track daily cash settlements, worksite receipts, and direct UPI transfers in INR (₹)
          </p>
        </div>

        {currentEmployerProfile && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsRecordModalOpen(true)}
            icon={<PlusCircle className="h-4 w-4" />}
          >
            Record Worksite Settlement
          </Button>
        )}
      </div>

      {/* Payment Gateway Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-sky-50 border border-sky-200 text-xs sm:text-sm text-sky-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-sky-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold">
            Online Payment Gateway Status: Not Configured (Recorded Cash & Direct UPI Active)
          </strong>
          <p className="text-xs text-sky-800 leading-relaxed">
            Per platform security standards, online escrow payment gateways (such as Razorpay / Cashfree) remain in unconfigured state until live merchant keys and webhook secrets are provisioned. Currently, worksite cash settlements and direct UPI transfers are formally logged and verified here. No sensitive banking credentials or UPI PINs are ever stored.
          </p>
        </div>
      </div>

      {/* Payment Methods Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <strong className="block text-gray-900 font-bold text-sm">Worksite Cash</strong>
            <span className="text-gray-500 mt-0.5 block">Standard rural settlement paid daily directly to worker</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <strong className="block text-gray-900 font-bold text-sm">Direct PhonePe / GPay</strong>
            <span className="text-gray-500 mt-0.5 block">Instant bank transfer via QR code shown at site</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <strong className="block text-gray-900 font-bold text-sm">Online Gateway</strong>
            <span className="text-amber-700 font-semibold mt-0.5 block">Configurable for future enterprise escrow</span>
          </div>
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-8 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">
          Recorded Settlements Ledger ({payments.length})
        </h2>

        {payments.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">No payment records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Receipt / Date</th>
                  <th className="py-3 px-4">Job / Booking</th>
                  <th className="py-3 px-4">Participants</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <strong className="block text-gray-900">{pay.providerReference || pay.id.slice(-8)}</strong>
                      <span className="text-[10px] text-gray-400">{new Date(pay.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {pay.jobTitle || `Booking #${pay.bookingId.slice(-6)}`}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      <div>Employer: <strong>{pay.employerName || 'Employer'}</strong></div>
                      <div>Worker: <strong>{pay.workerName || 'Worker'}</strong></div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold uppercase text-gray-800">
                      {pay.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(pay.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-brand-700 text-base">
                      ₹{pay.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} title="Record Worksite Settlement" maxWidth="md">
        <div className="space-y-4 text-sm text-gray-800">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Booking</label>
            <select
              value={selectedBookingId}
              onChange={(e) => {
                setSelectedBookingId(e.target.value);
                const b = bookings.find((item) => item.id === e.target.value);
                if (b) setPaymentAmount(b.totalAmount);
              }}
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-sm"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.workerName} - {b.jobTitle || b.workDescription.slice(0, 25)} (₹{b.totalAmount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Amount Paid (₹)</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-bold text-brand-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Settlement Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                Cash at Worksite
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                  paymentMethod === 'upi'
                    ? 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                Direct UPI / QR
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleRecord}
              isLoading={isSubmitting}
            >
              Confirm Settlement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
