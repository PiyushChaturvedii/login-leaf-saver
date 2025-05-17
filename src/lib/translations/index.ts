
import { authTranslations } from './auth';
import { dashboardTranslations } from './dashboard';
import { profileTranslations } from './profile';
import { commonTranslations } from './common';
import { errorTranslations } from './errors';
import { successTranslations } from './success';

// Type definition for language strings
export type LanguageStrings = {
  [key: string]: {
    en: string;
    hi: string;
  };
};

// Merge all translation modules
export const translations: LanguageStrings = {
  ...commonTranslations,
  ...authTranslations,
  ...dashboardTranslations,
  ...profileTranslations,
  ...errorTranslations,
  ...successTranslations
};

/**
 * Get a translated string based on current language
 * @param key - The translation key
 * @param language - The current language code ('en' or 'hi')
 * @returns The translated string
 */
export const t = (key: keyof typeof translations, language: 'en' | 'hi'): string => {
  if (translations[key]) {
    return translations[key][language];
  }
  
  // Fallback to the key itself if translation is missing
  console.warn(`Translation missing for key: ${key}`);
  return String(key);  // Convert to string explicitly to fix the type error
};
