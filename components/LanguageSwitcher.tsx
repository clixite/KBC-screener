import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { Language } from '../types';
import { GlobeIcon } from './icons/GlobeIcon';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="fixed top-4 right-20 z-50">
      <div className="relative">
        <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 pointer-events-none" />
        <select
          value={language}
          onChange={handleLanguageChange}
          className="pl-10 pr-4 py-2 rounded-full appearance-none bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          aria-label={t('language')}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="nl">Nederlands</option>
        </select>
      </div>
    </div>
  );
};
