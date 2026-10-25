import React from 'react';
import { PhoneCall, ShieldAlert, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Emergency & Support Contacts (India)" maxWidth="sm">
      <div className="space-y-4 text-sm">
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>
            If you or someone at the worksite is in immediate physical danger, distress, or harassment, tap below to call official government emergency services immediately.
          </span>
        </div>

        <div className="space-y-2.5">
          <a
            href="tel:112"
            className="flex items-center justify-between p-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm">National Emergency Service</div>
                <div className="text-xs font-normal text-red-100">Police, Fire & Medical</div>
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-lg">
              112
            </span>
          </a>

          <a
            href="tel:181"
            className="flex items-center justify-between p-3.5 rounded-xl bg-purple-700 text-white font-bold hover:bg-purple-800 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm">Women Helpline</div>
                <div className="text-xs font-normal text-purple-200">24x7 Safety in Distress</div>
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-lg">
              181 / 1091
            </span>
          </a>

          <a
            href="tel:14434"
            className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm">National Labour Helpline</div>
                <div className="text-xs font-normal text-emerald-200">Shram Suvidha & Wage Grievance</div>
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-lg">
              14434
            </span>
          </a>

          <a
            href="tel:1098"
            className="flex items-center justify-between p-3.5 rounded-xl bg-sky-700 text-white font-bold hover:bg-sky-800 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm">Childline Protection</div>
                <div className="text-xs font-normal text-sky-200">Report Child Labour Exploitation</div>
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-lg">
              1098
            </span>
          </a>
        </div>

        <div className="pt-2 text-center">
          <Button variant="outline" size="sm" onClick={onClose} fullWidth>
            Dismiss
          </Button>
        </div>
      </div>
    </Modal>
  );
};
