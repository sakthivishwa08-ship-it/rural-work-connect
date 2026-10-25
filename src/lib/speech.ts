// Web Speech API Voice Input and Text-To-Speech helper for Indian Languages

// Extend window for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

export interface VoiceRecognitionResult {
  start: () => void;
  stop: () => void;
}

export function startSpeechRecognition(
  languageCode: string,
  onResult: (transcript: string) => void,
  onError: (errorMsg: string) => void,
  onEnd?: () => void
): VoiceRecognitionResult | null {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser. Please type your search.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Map app lang code to BCP 47 language tag
  const langMap: Record<string, string> = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    bn: 'bn-IN',
    pa: 'pa-IN',
    ur: 'ur-IN',
  };

  recognition.lang = langMap[languageCode] || 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const text = event.results[0][0].transcript;
      onResult(text);
    }
  };

  recognition.onerror = (event: any) => {
    let errorText = 'Speech recognition error';
    if (event.error === 'not-allowed') {
      errorText = 'Microphone permission denied. Please allow microphone access in your browser settings.';
    } else if (event.error === 'no-speech') {
      errorText = 'No speech was detected. Please try tapping the microphone again.';
    } else {
      errorText = `Speech error: ${event.error}`;
    }
    onError(errorText);
  };

  if (onEnd) {
    recognition.onend = onEnd;
  }

  try {
    recognition.start();
  } catch (err: any) {
    onError(err?.message || 'Could not start microphone');
    return null;
  }

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {}
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {}
    },
  };
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  languageCode: string,
  onEnd?: () => void
): void {
  if (!isSpeechSynthesisSupported()) return;

  // Stop previous speech if playing
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const langMap: Record<string, string> = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    bn: 'bn-IN',
  };

  utterance.lang = langMap[languageCode] || 'en-IN';
  utterance.rate = 0.95; // Slightly slower for clear rural comprehension

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  return window.speechSynthesis.speaking;
}
