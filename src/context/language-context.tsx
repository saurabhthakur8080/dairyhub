'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'hi'; // 'en' for English, 'hi' for Hindi

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: <T>(translations: { [key in Language]: T }) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en'); // Default to English

  useEffect(() => {
    const storedLang = localStorage.getItem('dairy-hub-language') as Language | null;
    if (storedLang && ['en', 'hi'].includes(storedLang)) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    if (['en', 'hi'].includes(lang)) {
        setLanguageState(lang);
        localStorage.setItem('dairy-hub-language', lang);
    }
  };
  
  const t = <T,> (translations: { [key in Language]: T }) => {
    return translations[language];
  };

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}