import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

export interface ProgressMessage {
  key: string;
  label: string;
  status: 'pending' | 'complete' | 'error';
}

interface NewLoadingStepProps {
  progressMessages: ProgressMessage[];
}

const getStatusIcon = (status: ProgressMessage['status']) => {
    switch (status) {
        case 'pending':
            return <SpinnerIcon className="w-6 h-6 text-indigo-500 animate-spin" />;
        case 'complete':
            return <CheckCircleIcon className="w-6 h-6 text-emerald-500" />;
        case 'error':
            return <XCircleIcon className="w-6 h-6 text-rose-500" />;
    }
};

export const NewLoadingStep: React.FC<NewLoadingStepProps> = ({ progressMessages }) => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
          {t('generatingReport')}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {t('loadingSubtitle')}
        </p>

        <div className="mt-8 space-y-4">
          {progressMessages.map((msg) => (
            <div
              key={msg.key}
              className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <span className={`font-medium ${msg.status === 'pending' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>
                {msg.label}
              </span>
              <div className="flex-shrink-0">
                {getStatusIcon(msg.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};