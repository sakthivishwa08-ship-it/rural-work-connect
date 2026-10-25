import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, AlertCircle, Globe, ChevronDown, Check } from 'lucide-react';
import {
  startSpeechRecognition,
  isSpeechRecognitionSupported,
  VoiceRecognitionResult,
  INDIAN_VOICE_LANGUAGES,
  VoiceLanguageOption,
} from '../../lib/speech';
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
  placeholder,
  className = '',
}) => {
  const { language, t } = useI18n();

  // Voice recognition language, defaults to current app language (ta, hi, te, kn, ml, en, etc.)
  const [voiceLang, setVoiceLang] = useState<string>(() => {
    return localStorage.getItem('rwc_voice_lang') || language || 'ta';
  });
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<VoiceRecognitionResult | null>(null);
  const [showVoiceLangPicker, setShowVoiceLangPicker] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync voice language when user switches global language
  useEffect(() => {
    if (language) {
      setVoiceLang(language);
    }
  }, [language]);

  // Click outside listener for the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowVoiceLangPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      setVoiceError('Voice input is not supported on this browser. Please use Chrome or Edge.');
      return;
    }

    setIsListening(true);
    const session = startSpeechRecognition(
      voiceLang,
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

  const selectedVoiceObj =
    INDIAN_VOICE_LANGUAGES.find((l) => l.code === voiceLang) ||
    INDIAN_VOICE_LANGUAGES.find((l) => l.code === 'ta') ||
    INDIAN_VOICE_LANGUAGES[0];

  const handleSelectVoiceLang = (langObj: VoiceLanguageOption) => {
    setVoiceLang(langObj.code);
    localStorage.setItem('rwc_voice_lang', langObj.code);
    setShowVoiceLangPicker(false);
    setVoiceError(null);
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div className="relative flex items-center w-full">
        {/* Search icon */}
        <div className="absolute left-3.5 pointer-events-none text-gray-400">
          <Search className="h-5 w-5" />
        </div>

        {/* Search input field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch()}
          placeholder={placeholder || t.searchPage.placeholder}
          className="w-full pl-11 pr-36 py-3.5 bg-white rounded-2xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs text-sm sm:text-base transition-all"
        />

        {/* Right Controls: Voice Language Selector + Microphone Button */}
        <div className="absolute right-2 flex items-center gap-1.5" ref={dropdownRef}>
          {/* Quick Voice Language Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowVoiceLangPicker(!showVoiceLangPicker)}
              title="Change Voice Language (குரல் மொழி மாற்றுக)"
              className="px-2.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 text-xs font-bold transition-all flex items-center gap-1 border border-brand-200"
            >
              <Globe className="h-3.5 w-3.5 text-brand-700" />
              <span>{selectedVoiceObj.nativeName}</span>
              <ChevronDown className="h-3 w-3 text-brand-600 opacity-70" />
            </button>

            {/* Indian Languages Voice Dropdown */}
            {showVoiceLangPicker && (
              <div className="absolute right-0 top-full mt-2 w-64 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-2 z-50 text-left">
                <div className="px-2.5 py-1.5 border-b border-gray-100 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  Speak in Language (குரல் மொழி):
                </div>
                <div className="divide-y divide-gray-50 mt-1">
                  {INDIAN_VOICE_LANGUAGES.map((item) => {
                    const isSelected = voiceLang === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSelectVoiceLang(item)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-brand-500 text-white font-bold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{item.nativeName}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-brand-100' : 'text-gray-400'}`}>
                            {item.name}
                          </span>
                        </div>
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            title={
              isListening
                ? 'Stop listening'
                : `${t.actions.voiceSearch} (${selectedVoiceObj.nativeName})`
            }
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-md ring-4 ring-red-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
            aria-label="Voice Search"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Active Listening Audio Banner with Native Language Instructions */}
      {isListening && (
        <div className="mt-2.5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex flex-col gap-1 shadow-sm animate-pulse">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block animate-ping"></span>
            <span>
              {t.actions.listening} ({selectedVoiceObj.nativeName} - {selectedVoiceObj.name})
            </span>
          </div>
          <div className="text-xs text-red-700 pl-5">
            {selectedVoiceObj.samplePrompt}
          </div>
        </div>
      )}

      {/* Voice Error notice */}
      {voiceError && (
        <div className="mt-2 flex items-start gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600" />
          <span>{voiceError}</span>
        </div>
      )}
    </div>
  );
};
