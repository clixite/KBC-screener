import React, { createContext, useContext, ReactNode } from 'react';
import { translations } from '../translations';

// FIX: Export the Translations type for use in other components.
export type Translations = typeof translations.en;

interface LocalizationContextType {
  t: (key: keyof Translations) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const t = (key: keyof Translations): string => {
    // Always return the English translation. Fallback to the key itself if not found.
    return translations.en[key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};