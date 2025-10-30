import React from 'react';
import { GlobeIcon } from './icons/GlobeIcon';

export const LanguageSwitcher: React.FC = () => {
  // FIX: The useLocalization hook does not provide 'language' or 'setLanguage', causing compilation errors.
  // The application is currently hardcoded to English. This component
  // is disabled to reflect that and fix the compilation errors.
  const language = 'en';

  const toggleLanguage = () => {
    // No-op since language switching is not implemented.
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative p-2 rounded-full bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 transition-all cursor-not-allowed"
      aria-label="Toggle language"
      disabled
    >
      <div className="flex items-center gap-2">
        <GlobeIcon className="w-6 h-6" />
        <span className="font-semibold uppercase">{language}</span>
      </div>
    </button>
  );
};
