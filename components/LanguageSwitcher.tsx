import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { GlobeIcon } from './icons/GlobeIcon';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative p-2 rounded-full bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 transition-all"
      aria-label="Toggle language"
    >
      <div className="flex items-center gap-2">
        <GlobeIcon className="w-6 h-6" />
        <span className="font-semibold uppercase">{language}</span>
      </div>
    </button>
  );
};
