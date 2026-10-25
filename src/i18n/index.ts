import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './en';
import { ta } from './ta';
import { hi } from './hi';
import { te } from './te';
import { SUPPORTED_LANGUAGES, LanguageInfo } from './languagesList';

export type TranslationType = typeof en;

const translations: Record<string, TranslationType> = {
  en,
  ta,
  hi,
  te,
};

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: TranslationType;
  languages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('rwc_lang') || 'en';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('rwc_lang', lang);
  };

  const t = translations[language] || en;
  const currentLanguageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageInfo,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
