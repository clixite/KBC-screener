import React from 'react';
import { Company } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { HashtagIcon } from './icons/HashtagIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface SelectionStepProps {
  companies: Company[];
  onSelect: (company: Company) => void;
  onBack: () => void;
}

interface CompanyCardProps {
  company: Company;
  onSelect: () => void;
  isBestMatch: boolean;
  t: (key: string) => string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onSelect, isBestMatch, t }) => (
    <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col border-2 border-transparent focus-within:border-indigo-500 hover:border-indigo-500">
        {isBestMatch && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs font-semibold z-10">
                {t('bestMatch')}
            </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 pr-24">{company.name}</h3>
            
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300 flex-grow">
                <div className="flex items-start gap-2">
                    <HashtagIcon className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                    <span><span className="font-medium text-slate-500 dark:text-slate-400">{t('regNumber')}:</span> {company.registrationNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                    <span>{company.address}</span>
                </div>
            </div>

            <button onClick={onSelect} className="w-full text-center px-4 py-2 mt-6 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all">
                {t('selectCompanyButton')}
            </button>
        </div>
    </div>
);


export const SelectionStep: React.FC<SelectionStepProps> = ({ companies, onSelect, onBack }) => {
    const { t } = useLocalization();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('selectCompanyTitle')}</h1>
            <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                {t('backToSearchButton')}
            </button>
        </div>
        
        {companies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((comp, index) => (
                    <CompanyCard 
                        key={comp.id} 
                        company={comp} 
                        onSelect={() => onSelect(comp)} 
                        isBestMatch={index === 0 && companies.length > 1}
                        t={t} 
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <p className="text-slate-600 dark:text-slate-300 text-lg">{t('noCompaniesFound')}</p>
            </div>
        )}
      </div>
    </div>
  );
};
