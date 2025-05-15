
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'hi' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isHindi: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'hi',
  toggleLanguage: () => {},
  setLanguage: () => {},
  isHindi: true,
  isEnglish: false,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to load saved language preference from localStorage
  const savedLanguage = localStorage.getItem('preferredLanguage');
  const [language, setLanguageState] = useState<Language>(
    savedLanguage === 'en' ? 'en' : 'hi' // Default to Hindi if no preference is saved
  );

  // Derived state for easier checks
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState(prevLang => {
      const newLang = prevLang === 'hi' ? 'en' : 'hi';
      return newLang;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage, 
      setLanguage,
      isHindi,
      isEnglish
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
