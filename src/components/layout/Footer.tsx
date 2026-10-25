import React from 'react';
import { Shield, PhoneCall, Heart, ExternalLink, Globe } from 'lucide-react';
import { useI18n } from '../../i18n';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-24 lg:pb-12 border-t border-gray-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Platform About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-base">
                R
              </div>
              <span className="font-bold text-white text-base">Rural Work Connect</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              A dedicated daily-wage employment platform designed for rural India. Enabling transparent daily wages, trusted local employers, and verified skill discovery.
            </p>
            <div className="text-[11px] text-emerald-400 font-medium">
              Made with pride for rural workers across Indian districts.
            </div>
          </div>

          {/* Col 2: Emergency Helplines (India) */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="h-4 w-4 text-red-400" />
              <span>National Helplines</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-gray-300 bg-gray-800/60 p-2 rounded-lg">
                <span>Emergency Services</span>
                <a href="tel:112" className="font-bold text-white text-xs bg-red-600 px-2 py-0.5 rounded">
                  112
                </a>
              </li>
              <li className="flex items-center justify-between text-gray-300 bg-gray-800/60 p-2 rounded-lg">
                <span>Women Helpline</span>
                <a href="tel:181" className="font-bold text-white text-xs bg-purple-600 px-2 py-0.5 rounded">
                  181 / 1091
                </a>
              </li>
              <li className="flex items-center justify-between text-gray-300 bg-gray-800/60 p-2 rounded-lg">
                <span>Shram Suvidha (Labour)</span>
                <a href="tel:14434" className="font-bold text-white text-xs bg-brand-600 px-2 py-0.5 rounded">
                  14434
                </a>
              </li>
              <li className="flex items-center justify-between text-gray-300 bg-gray-800/60 p-2 rounded-lg">
                <span>Childline</span>
                <a href="tel:1098" className="font-bold text-white text-xs bg-sky-600 px-2 py-0.5 rounded">
                  1098
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('job-search')}
                  className="hover:text-white transition-colors"
                >
                  Daily Wage Job Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('worker-discovery')}
                  className="hover:text-white transition-colors"
                >
                  Verified Worker Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-red-400"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Worksite Safety Center</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('credits')}
                  className="hover:text-white transition-colors"
                >
                  Platform Reward Credits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('payments')}
                  className="hover:text-white transition-colors"
                >
                  Worksite Cash & Payment Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Eighth Schedule Disclaimer */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-brand-400" />
              <span>Languages & Legal</span>
            </h4>
            <p className="text-gray-400 text-xs mb-3 leading-relaxed">
              Designed for English and all 22 official languages in the Eighth Schedule of the Constitution of India. Tamil, Hindi, and English are actively verified; other languages are in ongoing community review.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <button
                onClick={() => onNavigate('privacy')}
                className="hover:text-white underline text-gray-400"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => onNavigate('privacy')}
                className="hover:text-white underline text-gray-400"
              >
                Terms of Service
              </button>
              <button
                onClick={() => onNavigate('help')}
                className="hover:text-white underline text-gray-400"
              >
                Help & Grievance
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Rural Work Connect. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Important Notice: Rural Work Connect does not guarantee job safety or wage payment on behalf of private employers. Never pay advance fees for daily-wage employment.
          </p>
        </div>
      </div>
    </footer>
  );
};
