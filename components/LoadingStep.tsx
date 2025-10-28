import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const messages = [
    "analyzingCompanyProfile",
    "screeningSanctionsLists",
    "checkingPEPs",
    "scanningAdverseMedia",
    "identifyingBeneficialOwners",
    "analyzingFinancials",
    "evaluatingESG"
];

export const LoadingStep: React.FC = () => {
    const [messageIndex, setMessageIndex] = React.useState(0);
    const [progress, setProgress] = React.useState(0);
    const { t } = useLocalization();

    React.useEffect(() => {
        const totalDuration = 10000; // Estimated total time for loading
        const stepDuration = totalDuration / messages.length;

        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % messages.length;
                if(nextIndex === 0) {
                   // Restart logic if needed, or just stop
                }
                return nextIndex;
            });
        }, stepDuration);

         const progressInterval = setInterval(() => {
            setProgress(prev => {
                const nextProgress = prev + (100 / (totalDuration / 100));
                return nextProgress > 100 ? 100 : nextProgress;
            });
        }, 100);

        return () => {
            clearInterval(intervalId);
            clearInterval(progressInterval);
        }
    }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
      <div className="w-full max-w-lg text-center">
        <div className="w-24 h-24 mx-auto border-4 border-t-indigo-600 border-r-indigo-600 border-b-indigo-600 border-l-slate-200 dark:border-l-slate-700 rounded-full animate-spin"></div>
        <h2 className="mt-6 text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('generatingReportTitle')}</h2>
        
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-6">
          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
        </div>

        <p className="mt-4 text-slate-600 dark:text-slate-300 min-h-[2rem]">{t(messages[messageIndex])}...</p>
      </div>
    </div>
  );
};
