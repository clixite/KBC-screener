import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import type { Translations } from '../contexts/LocalizationContext';
import { SearchIcon } from './icons/SearchIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ClockIcon } from './icons/ClockIcon';
import { TrashIcon } from './icons/TrashIcon';
import { BuildingIcon } from './icons/BuildingIcon';

interface SearchStepProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  // FIX: Ensure the error prop is a valid translation key for type safety.
  error: keyof Translations | null;
  history: string[];
  onClearHistory: () => void;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}


export const SearchStep: React.FC<SearchStepProps> = ({ onSearch, isLoading, error, history, onClearHistory }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500); // 500ms delay
  const { t } = useLocalization();

  useEffect(() => {
    // Sanitize input by trimming and only trigger search if the debounced query is not empty
    const sanitizedQuery = debouncedQuery.trim();
    if (sanitizedQuery) {
      onSearch(sanitizedQuery);
    }
  }, [debouncedQuery, onSearch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
      <div className="w-full max-w-2xl text-center">
        <BuildingIcon className="w-16 h-16 mx-auto mb-6 text-slate-400 dark:text-slate-500" />
        <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-5xl">
          {t('searchTitle')}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          {t('searchSubtitle')}
        </p>
        
        <div className="mt-8 w-full">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-12 py-3 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            {isLoading && (
              <SpinnerIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 animate-spin" />
            )}
          </div>
           <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('searchHint')}</p>
        </div>

        {error && (
            <p className="mt-4 text-rose-600 dark:text-rose-400">{t(error)}</p>
        )}

        {history.length > 0 && (
          <div className="mt-8 w-full text-left">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('recentSearches')}
              </h3>
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors font-semibold uppercase tracking-wider"
                aria-label={t('clearHistory')}
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>{t('clearHistory')}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    onSearch(item);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-sm"
                >
                  <ClockIcon className="w-4 h-4" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};