

import { useState, useCallback } from 'react';
import { Language } from '../types';
import { translations } from '../locales/translations';

export const useLocalization = (initialLang: Language = 'en') => {
  const [language, setLanguage] = useState<Language>(initialLang);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return { language, setLanguage, t };
};
