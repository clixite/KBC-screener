import React from 'react';
import { BuildingIcon } from './icons/BuildingIcon';
import { SearchIcon } from './icons/SearchIcon';
import { useLocalization } from '../contexts/LocalizationContext';

interface SearchStepProps {
  onSearch: (companyName: string) => void;
  isLoading: boolean;
}

export const SearchStep: React.FC<SearchStepProps> = ({ onSearch, isLoading }) => {
  const [companyName, setCompanyName] = React.useState('Google');
  const { t } = useLocalization();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onSearch(companyName);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
      <div className="w-full max-w-2xl text-center">
        <BuildingIcon className="w-16 h-16 mx-auto text-indigo-500" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          {t('subtitle')}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-xl mx-auto">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder={t('companyNamePlaceholder')}
            className="flex-grow px-4 py-3 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <SearchIcon className="w-5 h-5" />
            <span>{isLoading ? t('searchingButton') : t('searchButton')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
