import React from 'react';
import { Company } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { BuildingIcon } from './icons/BuildingIcon';
import { HashtagIcon } from './icons/HashtagIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

interface SelectionStepProps {
  companies: Company[];
  onSelect: (company: Company) => void;
  onBack: () => void;
}

export const SelectionStep: React.FC<SelectionStepProps> = ({ companies, onSelect, onBack }) => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
      <div className="w-full max-w-4xl">
        <div className="text-center">
          <BuildingIcon className="w-16 h-16 mx-auto text-indigo-500" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-5xl">
            {t('selectCompanyTitle')}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {t('selectCompanySubtitle')}
          </p>
        </div>

        <div className="mt-8">
          {companies.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company, index) => (
                <li key={index} 
                    className="flex flex-col p-5 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all"
                >
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{company.name}</h2>
                    
                    {company.description && company.description !== 'N/A' && (
                       <div className="flex items-start gap-2 mt-3 text-sm text-slate-500 dark:text-slate-400">
                           <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                           <p>{company.description}</p>
                       </div>
                    )}

                    <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <HashtagIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>{company.registrationNumber || 'N/A'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPinIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span>{company.address || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelect(company)}
                    className="mt-5 w-full px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all"
                  >
                    {t('generateReport')}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
              <InformationCircleIcon className="w-12 h-12 mx-auto text-amber-500" />
              <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">{t('noResults')}</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">{t('noResultsHint')}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all"
          >
            {t('backToSearch')}
          </button>
        </div>
      </div>
    </div>
  );
};
