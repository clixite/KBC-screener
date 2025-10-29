// FIX: Full implementation of a simple loading step component.
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { SpinnerIcon } from './icons/SpinnerIcon';

export const LoadingStep: React.FC = () => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
      <div className="w-full max-w-md text-center">
        <SpinnerIcon className="w-16 h-16 mx-auto text-indigo-500 animate-spin" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
          {t('generatingReport')}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {t('loadingSubtitle')}
        </p>
      </div>
    </div>
  );
};
