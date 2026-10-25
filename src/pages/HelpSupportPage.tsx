import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle, PhoneCall, Mail } from 'lucide-react';
import { Button } from '../components/common/Button';

interface HelpSupportPageProps {
  onOpenEmergency: () => void;
}

export const HelpSupportPage: React.FC<HelpSupportPageProps> = ({ onOpenEmergency }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      q: 'Is Rural Work Connect free for daily-wage workers?',
      a: 'Yes, 100% free. Rural daily workers are never charged any commission, sign-up fee, or deduction. Daily wages agreed with the employer belong entirely to you.',
    },
    {
      q: 'How and when are daily wages paid?',
      a: 'Wages are settled directly between employer and worker, typically via physical cash at the worksite at the end of the work day (05:00 PM) or via direct instant UPI (PhonePe / GPay / Paytm). Always confirm the payment terms before starting work.',
    },
    {
      q: 'What should I do if an employer asks for an advance fee or deposit?',
      a: 'Never pay any upfront fee or registration deposit. Demanding money for daily-wage employment is illegal. Report the listing immediately using the "Report Scam" button, and we will take administrative action.',
    },
    {
      q: 'What do platform credits mean? Can I withdraw them as cash?',
      a: 'Credits are internal recognition points earned for completing jobs, 5-star reviews, and milestone achievements. They cannot be withdrawn as cash. They unlock platform visibility boosts and recognition badges.',
    },
    {
      q: 'How does voice search work on my mobile phone?',
      a: 'Tap the microphone icon next to any search box and speak the type of work or village name in Tamil, Hindi, or English. Your phone browser will convert your speech to search text automatically.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitted(true);
    setMessage('');
    setSubject('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Help, Grievance & Support Center
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Frequently asked questions, grievance redressal, and direct platform support
        </p>
      </div>

      {/* Emergency Strip */}
      <div className="bg-amber-500 text-white p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
        <span>Need urgent police or emergency assistance?</span>
        <button
          onClick={onOpenEmergency}
          className="bg-white text-amber-900 px-3 py-1.5 rounded-xl font-bold hover:bg-amber-50 transition-colors"
        >
          Dial 112 / Helplines
        </button>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-brand-600" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm hover:text-brand-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-brand-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Form */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900 mb-2">
          Send a Support or Grievance Inquiry
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Our rural liaison team reviews questions regarding profile verification, booking disputes, and technical help.
        </p>

        {isSubmitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-base">Inquiry Submitted</h3>
            <p className="text-xs text-gray-600 mt-1">
              We have received your grievance request. A platform coordinator will follow up with you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about employer phone number"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98421 23456"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Your Message / Grievance Details *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="w-full p-3 rounded-xl border border-gray-300 text-sm leading-relaxed"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Send className="h-4 w-4" />}
            >
              Submit Support Request
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
