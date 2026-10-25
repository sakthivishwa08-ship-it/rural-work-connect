import React, { useState } from 'react';
import { Search, Mic, MicOff, AlertCircle } from 'lucide-react';
import { startSpeechRecognition, isSpeechRecognitionSupported, VoiceRecognitionResult } from '../../lib/speech';
import { useI18n } from '../../i18n';

interface VoiceSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string;
}

export const VoiceSearchInput: React.FC<VoiceSearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search jobs, skills, locations...',
  className = '',
}) => {
  const { language, t } = useI18n();
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<VoiceRecognitionResult | null>(null);

  const isVoiceSupported = isSpeechRecognitionSupported();

  const handleToggleVoice = () => {
    setVoiceError(null);

    if (isListening) {
      if (activeSession) activeSession.stop();
      setIsListening(false);
      setActiveSession(null);
      return;
    }

    if (!isVoiceSupported) {
      setVoiceError('Voice search is not supported on this device/browser. Please type your search.');
      return;
    }

    setIsListening(true);
    const session = startSpeechRecognition(
      language,
      (transcript) => {
        onChange(transcript);
        setIsListening(false);
        setActiveSession(null);
        if (onSearch) onSearch();
      },
      (error) => {
        setVoiceError(error);
        setIsListening(false);
        setActiveSession(null);
      },
      () => {
        setIsListening(false);
        setActiveSession(null);
      }
    );

    if (session) {
      setActiveSession(session);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 pointer-events-none text-gray-400">
          <Search className="h-5 w-5" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch()}
          placeholder={placeholder}
          className="w-full pl-11 pr-14 py-3.5 bg-white rounded-2xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm text-base transition-all"
        />

        <button
          type="button"
          onClick={handleToggleVoice}
          title={isListening ? 'Stop listening' : t.actions.voiceSearch}
          className={`absolute right-2.5 p-2 rounded-xl transition-all flex items-center justify-center ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-md'
              : 'text-gray-500 hover:text-brand-600 hover:bg-gray-100'
          }`}
          aria-label="Voice Search"
        >
          {isListening ? <Mic className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5" />}
        </button>
      </div>

      {isListening && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 px-1 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
          <span>{t.actions.listening} (Tamil / Hindi / English voice supported)</span>
        </div>
      )}

      {voiceError && (
        <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600" />
          <span>{voiceError}</span>
        </div>
      )}
    </div>
  );
};
