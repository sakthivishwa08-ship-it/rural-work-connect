import React from 'react';
import { ShieldCheck, AlertTriangle, Eye, PhoneCall, Ban } from 'lucide-react';

export const SafetyTipsCard: React.FC<{ onOpenEmergency?: () => void }> = ({ onOpenEmergency }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 rounded-2xl border border-emerald-200 p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-700" />
          <span>Rural Worksite Safety Guide</span>
        </h4>

        {onOpenEmergency && (
          <button
            onClick={onOpenEmergency}
            className="text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Emergency Dial (112)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 mb-3">
        <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
          <Ban className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold text-gray-900">Zero Advance Fee Rule</strong>
            Never pay any money or deposit to get daily work. Legitimate employers pay you.
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
          <Eye className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold text-gray-900">Verify Worksite & Travel</strong>
            Share the employer's worksite landmark and arrival time with your family before departing.
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold text-gray-900">Confirm Wage Before Starting</strong>
            Verify the daily wage amount and payment terms (cash at sunset or UPI) before beginning work.
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
          <ShieldCheck className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold text-gray-900">Report Inappropriate Activity</strong>
            Report scams, wage harassment, discrimination, or abusive employers immediately in the app.
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 italic">
        * Rural Work Connect provides connection infrastructure and verified reviews, but does not guarantee absolute worksite safety. Practice customary rural precautions.
      </p>
    </div>
  );
};
