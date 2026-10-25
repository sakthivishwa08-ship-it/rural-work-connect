// Web Speech API Voice Recognition & Native Text-To-Speech for Indian Languages

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoiceLanguageOption {
  code: string;
  bcp47: string;
  name: string;
  nativeName: string;
  samplePrompt: string;
}

export const INDIAN_VOICE_LANGUAGES: VoiceLanguageOption[] = [
  {
    code: 'ta',
    bcp47: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    samplePrompt: 'எ.கா: "கொத்தனார் வேலை", "நெல் அறுவடை", "மதுரை"',
  },
  {
    code: 'hi',
    bcp47: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    samplePrompt: 'उदा: "राजमिस्त्री काम", "खेत कटाई", "लखनऊ"',
  },
  {
    code: 'te',
    bcp47: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    samplePrompt: 'ఉదా: "తాపీ పని", "పంట కోత", "విజయవాడ"',
  },
  {
    code: 'kn',
    bcp47: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    samplePrompt: 'ಉದಾ: "ಮೇಸ್ತ್ರಿ ಕೆಲಸ", "ಬೆಳೆ ಕೊಯ್ಲು", "ಮೈಸೂರು"',
  },
  {
    code: 'ml',
    bcp47: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    samplePrompt: 'ഉദാ: "മേസ്തിരി പണി", "കൊയ്ത്ത്", "പാലക്കാട്"',
  },
  {
    code: 'mr',
    bcp47: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    samplePrompt: 'उदा: "गवंडी काम", "शेतमजुरी", "पुणे"',
  },
  {
    code: 'bn',
    bcp47: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    samplePrompt: 'যেমন: "রাজমিস্ত্রি কাজ", "মাঠের কাজ", "কলকাতা"',
  },
  {
    code: 'gu',
    bcp47: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    samplePrompt: 'દા.ત: "કડીયા કામ", "ખેતી કામ", "અમદાવાદ"',
  },
  {
    code: 'pa',
    bcp47: 'pa-IN',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    samplePrompt: 'ਜਿਵੇਂ: "ਰਾਜਮਿਸਤਰੀ ਕੰਮ", "ਵਾਢੀ ਦਾ ਕੰਮ", "ਜਲੰਧਰ"',
  },
  {
    code: 'or',
    bcp47: 'or-IN',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    samplePrompt: 'ଯେପରି: "ରାଜମିସ୍ତ୍ରୀ କାମ", "ଅମଳ କାମ", "କଟକ"',
  },
  {
    code: 'ur',
    bcp47: 'ur-IN',
    name: 'Urdu',
    nativeName: 'اردو',
    samplePrompt: 'مثال: "معمار کا کام", "کھیتی باڑی", "حیدرآباد"',
  },
  {
    code: 'as',
    bcp47: 'as-IN',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    samplePrompt: 'উদাহৰণ: "ৰাজমিস্ত্ৰী কাম", "ধান কটা কাম"',
  },
  {
    code: 'en',
    bcp47: 'en-IN',
    name: 'English (India)',
    nativeName: 'English',
    samplePrompt: 'e.g. "Masonry", "Paddy harvesting", "Painting"',
  },
];

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

  // Find exact BCP-47 tag for target language
  const matched = INDIAN_VOICE_LANGUAGES.find((l) => l.code === languageCode);
  const targetTag = matched ? matched.bcp47 : 'ta-IN'; // Default to Tamil or user language

  recognition.lang = targetTag;
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
      errorText = 'No speech detected. Please tap the microphone and speak clearly.';
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

  // Stop any active utterance
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const matched = INDIAN_VOICE_LANGUAGES.find((l) => l.code === languageCode);
  const targetTag = matched ? matched.bcp47 : 'en-IN';

  utterance.lang = targetTag;
  utterance.rate = 0.88; // Deliberate speed suitable for rural users
  utterance.pitch = 1.0;

  // Search browser's installed voices for exact native speech match
  const selectVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const exactMatch = voices.find(
        (v) =>
          v.lang.toLowerCase() === targetTag.toLowerCase() ||
          v.lang.replace('_', '-').toLowerCase() === targetTag.toLowerCase()
      );
      const prefixMatch = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(languageCode.toLowerCase()) ||
          v.name.toLowerCase().includes(languageCode.toLowerCase())
      );
      if (exactMatch) {
        utterance.voice = exactMatch;
      } else if (prefixMatch) {
        utterance.voice = prefixMatch;
      }
    }
  };

  selectVoice();
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = selectVoice;
  }

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

// Helper to generate full translated audio briefs for any job in Indian languages
export function getTranslatedJobSpeech(job: any, language: string): string {
  if (language === 'ta') {
    return `${job.title}. வேலை வகை: ${job.category}. இடம்: ${job.villageOrTown}, ${job.district}. தினக்கூலி: ${job.dailyWage} ரூபாய். தொடங்கும் தேதி: ${job.workDate}. ${job.mealsProvided ? 'உணவு வழங்கப்படும்.' : 'உணவு கிடையாது.'} விவரம்: ${job.description.slice(0, 120)}`;
  }
  if (language === 'hi') {
    return `${job.title}. कार्य श्रेणी: ${job.category}. स्थान: ${job.villageOrTown}, ${job.district}. दैनिक मजदूरी: ${job.dailyWage} रुपये प्रति दिन। काम की तारीख: ${job.workDate}। ${job.mealsProvided ? 'मुफ्त भोजन उपलब्ध है।' : 'भोजन शामिल नहीं है।'} विवरण: ${job.description.slice(0, 120)}`;
  }
  if (language === 'te') {
    return `${job.title}. పని రకం: ${job.category}. ప్రదేశం: ${job.villageOrTown}, ${job.district}. రోజువారీ వేతనం: ${job.dailyWage} రూపాయలు. పని తేదీ: ${job.workDate}. ${job.mealsProvided ? 'ఉచిత భోజనం ఉంది.' : 'భోజనం లేదు.'} వివరాలు: ${job.description.slice(0, 120)}`;
  }
  if (language === 'kn') {
    return `${job.title}. ಕೆಲಸದ ವಿಧ: ${job.category}. ಸ್ಥಳ: ${job.villageOrTown}, ${job.district}. ದಿನಗೂಲಿ: ${job.dailyWage} ರೂಪಾಯಿ. ದಿನಾಂಕ: ${job.workDate}. ${job.mealsProvided ? 'ಊಟದ ವ್ಯವಸ್ಥೆ ಇದೆ.' : 'ಊಟ ಇಲ್ಲ.'} ವಿವರ: ${job.description.slice(0, 120)}`;
  }
  if (language === 'ml') {
    return `${job.title}. തൊഴിൽ വിഭാഗം: ${job.category}. സ്ഥലം: ${job.villageOrTown}, ${job.district}. ദിവസവേതനം: ${job.dailyWage} രൂപ. തീയതി: ${job.workDate}. ${job.mealsProvided ? 'ഭക്ഷണം ലഭ്യമാണ്.' : ''} വിവരണം: ${job.description.slice(0, 120)}`;
  }
  if (language === 'mr') {
    return `${job.title}. कामाचा प्रकार: ${job.category}. ठिकाण: ${job.villageOrTown}, ${job.district}. रोजंदारी: ${job.dailyWage} रुपये. तारीख: ${job.workDate}. ${job.mealsProvided ? 'जेवणाची सोय आहे.' : ''} तपशील: ${job.description.slice(0, 120)}`;
  }
  if (language === 'bn') {
    return `${job.title}. কাজের ধরণ: ${job.category}. স্থান: ${job.villageOrTown}, ${job.district}. দৈনিক মজুরি: ${job.dailyWage} টাকা. তারিখ: ${job.workDate}. ${job.mealsProvided ? 'খাবার প্রদান করা হবে।' : ''} বিবরণ: ${job.description.slice(0, 120)}`;
  }
  return `${job.title}. Category: ${job.category}. Location: ${job.villageOrTown}, ${job.district}. Daily wage: ${job.dailyWage} rupees per day. Work date: ${job.workDate}. ${job.mealsProvided ? 'Food is provided.' : 'Meals not included.'} Description: ${job.description.slice(0, 120)}`;
}
