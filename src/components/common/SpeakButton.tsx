import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from '../../lib/speech';
import { useI18n } from '../../i18n';

interface SpeakButtonProps {
  textToSpeak: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  textToSpeak,
  className = '',
  size = 'sm',
}) => {
  const { language, t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isSpeechSynthesisSupported()) {
    return null;
  }

  const handleToggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(textToSpeak, language, () => {
        setIsPlaying(false);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      title={isPlaying ? t.actions.stopAudio : t.actions.listen}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors border ${
        isPlaying
          ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
      } ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'} ${className}`}
      aria-label="Text to speech reader"
    >
      {isPlaying ? (
        <>
          <VolumeX className="h-4 w-4 text-amber-700" />
          <span>{t.actions.stopAudio}</span>
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4 text-emerald-700" />
          <span>{t.actions.listen}</span>
        </>
      )}
    </button>
  );
};
