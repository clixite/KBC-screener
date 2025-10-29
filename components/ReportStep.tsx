// FIX: Full implementation of the report display component.
import React from 'react';
import { ComprehensiveReport } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { DownloadIcon } from './icons/DownloadIcon';

interface ReportStepProps {
  report: ComprehensiveReport;
  onNewSearch: () => void;
}

export const ReportStep: React.FC<ReportStepProps> = ({ report, onNewSearch }) => {
  const { t } = useLocalization();

  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
      {content}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            {t('reportTitle')}
          </h1>
          <div className="flex gap-4">
            <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all"
            >
                <DownloadIcon className="w-5 h-5" />
                {t('downloadReport')}
            </button>
            <button
              onClick={onNewSearch}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all"
            >
              {t('newSearch')}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {renderSection(t('companySummary'), (
            <div>
              <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{report.companySummary.name}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.companySummary.overview}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <p><strong>{t('registrationNumber')}:</strong> {report.companySummary.registrationNumber || 'N/A'}</p>
                <p><strong>{t('address')}:</strong> {report.companySummary.address || 'N/A'}</p>
                <p><strong>{t('website')}:</strong> {report.companySummary.website ? <a href={report.companySummary.website} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all">{report.companySummary.website}</a> : 'N/A'}</p>
              </div>
            </div>
          ))}

          {report.keyPersonnel && report.keyPersonnel.length > 0 && renderSection(t('keyPersonnel'), (
            <div className="space-y-4">
              {report.keyPersonnel.map((person, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                  <h4 className="font-bold">{person.name} - <span className="font-normal text-slate-500 dark:text-slate-400">{person.title}</span></h4>
                  <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{person.bio}</p>
                </div>
              ))}
            </div>
          ))}

          {report.financialHighlights && Object.keys(report.financialHighlights).length > 0 && renderSection(t('financialHighlights'), (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(report.financialHighlights).map(([key, value]) => (
                    <div key={key} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{key}</p>
                        <p className="text-lg font-bold">{value}</p>
                    </div>
                ))}
            </div>
          ))}

          {report.marketPresence && renderSection(t('marketPresence'), <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.marketPresence}</p>)}

          {report.productsAndServices && renderSection(t('productsAndServices'), <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.productsAndServices}</p>)}

          {report.strategicAnalysis && renderSection(t('strategicAnalysis'), (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">{t('strengths')}</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  {report.strategicAnalysis.strengths?.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-2">{t('weaknesses')}</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  {report.strategicAnalysis.weaknesses?.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sky-600 dark:text-sky-400 mb-2">{t('opportunities')}</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  {report.strategicAnalysis.opportunities?.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-2">{t('threats')}</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  {report.strategicAnalysis.threats?.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          ))}

          {report.sources && (report.sources.web.length > 0 || report.sources.maps.length > 0) && renderSection(t('sources'), (
            <div className="space-y-4">
                {report.sources.web.length > 0 && (
                    <div>
                        <h4 className="font-bold mb-2">{t('webSources')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {report.sources.web.map((source, i) => (
                                <li key={i}><a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all">{source.title}</a></li>
                            ))}
                        </ul>
                    </div>
                )}
                {report.sources.maps.length > 0 && (
                    <div>
                        <h4 className="font-bold mb-2 mt-4">{t('mapSources')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {report.sources.maps.map((source, i) => (
                                <li key={i}><a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all">{source.title}</a></li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};
