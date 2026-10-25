import React from 'react';
import { ShieldCheck, Lock, FileText, AlertTriangle } from 'lucide-react';

export const PrivacyTermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12 space-y-8 text-gray-800 text-sm leading-relaxed">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Last updated: October 2026 • Compliant with Indian IT Act 2000 & Digital Personal Data Protection Act (DPDPA)
        </p>
      </div>

      {/* Worker Privacy Guarantee */}
      <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 space-y-3">
        <h2 className="text-base sm:text-lg font-extrabold text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-700" />
          <span>Worker Privacy & Sensitive Data Safeguards</span>
        </h2>
        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
          Rural Work Connect upholds strict privacy standards for rural daily-wage workers:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-emerald-900">
          <li><strong>No Public Phone Exposure:</strong> Private worker telephone numbers are concealed from public search indexes. They are disclosed strictly between worker and employer after an official booking is accepted.</li>
          <li><strong>No Exact Home Address:</strong> Only district, taluk, and village/town are shown on search results. Exact residences are never published publicly.</li>
          <li><strong>Zero Financial Credential Storage:</strong> The platform does not store debit card details, bank passwords, or UPI PINs.</li>
        </ul>
      </div>

      {/* Terms of Service Section */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-900">
            1. Nature of the Service
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Rural Work Connect is an employment intermediary platform designed to connect independent rural daily-wage workers with employers (farmers, contractors, households, and enterprises) in India. Rural Work Connect is not an employer, contractor, or employment agency for the daily workers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-900">
            2. Zero Advance Fee Prohibition
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            It is strictly prohibited for any employer, recruiter, or user to request registration fees, uniform deposits, or upfront payments from workers seeking daily employment. Any account violating this rule will be permanently banned and reported to relevant law enforcement authorities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-900">
            3. Wage Agreements & Settlement
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Employers must honor the agreed daily wage without unlawful unilateral deductions. Payment must be settled at the agreed frequency (typically cash at the end of the day or direct UPI).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-900">
            4. Safety & Worksite Disclaimers
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            While Rural Work Connect enforces identity verification, review moderation, and safety reporting, the platform does not guarantee absolute worksite safety. Users are urged to practice customary rural precautions, verify landmarks, travel during daylight, and utilize emergency numbers (112 / 181 / 14434) whenever safety is in question.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-900">
            5. Prohibited Activities
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            The platform strictly prohibits any listings or communications involving human trafficking, child labour (under Child & Adolescent Labour Act), sexual harassment, bonded labour, discrimination on caste/religion/gender for arbitrary reasons, or deceptive listings.
          </p>
        </section>
      </div>
    </div>
  );
};
