// List of all 22 Eighth Schedule Indian Languages + English

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  isImplemented: boolean;
  notes?: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', isImplemented: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isImplemented: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isImplemented: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isImplemented: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', isImplemented: false, notes: 'UI translated with core keywords; full dictionary in review' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', isImplemented: false, notes: 'UI translated with core keywords; full dictionary in review' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', isImplemented: false, notes: 'In preparation' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', isImplemented: false, notes: 'In preparation' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isImplemented: false, notes: 'In preparation' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', isImplemented: false, notes: 'In preparation' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', isImplemented: false, notes: 'In preparation' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', isImplemented: false, notes: 'In preparation' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isImplemented: false, notes: 'In preparation' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', isImplemented: false, notes: 'In preparation' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', isImplemented: false, notes: 'In preparation' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', isImplemented: false, notes: 'In preparation' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', isImplemented: false, notes: 'In preparation' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', isImplemented: false, notes: 'In preparation' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', isImplemented: false, notes: 'In preparation' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', isImplemented: false, notes: 'In preparation' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', isImplemented: false, notes: 'In preparation' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'ꯃꯩꯇꯩꯂꯣꯟ', isImplemented: false, notes: 'In preparation' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', isImplemented: false, notes: 'In preparation' },
];
