// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { SearchStep } from './components/SearchStep';
import { SelectionStep } from './components/SelectionStep';
import { NewLoadingStep, ProgressMessage } from './components/NewLoadingStep';
import { ReportStep } from './components/ReportStep';
import { ThemeToggle } from './components/ThemeToggle';
import { LocalizationProvider, useLocalization } from './contexts/LocalizationContext';
import type { Translations } from './contexts/LocalizationContext';
import { searchCompanies, generateComprehensiveReport } from './services/geminiService';
import { Company, ComprehensiveReport } from './types';

type AppStep = 'search' | 'selection' | 'loading' | 'report';

const HISTORY_KEY = 'kyc-app-search-history';
const MAX_HISTORY_ITEMS = 5;

const AppContent: React.FC = () => {
  const [step, setStep] = useState<AppStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [report, setReport] = useState<ComprehensiveReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<keyof Translations | null>(null);
  const [progressMessages, setProgressMessages] = useState<ProgressMessage[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);


  const { t } = useLocalization();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Could not load search history.", e);
      setSearchHistory([]);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.warn("Could not get user location. Search results may be less relevant.", error);
            }
        );
    }
  }, []);

  const addToHistory = useCallback((query: string) => {
    setSearchHistory(prev => {
      const newHistory = [
        query,
        ...prev.filter(item => item.toLowerCase() !== query.toLowerCase())
      ].slice(0, MAX_HISTORY_ITEMS);
      
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error("Could not save search history.", e);
      }
      
      return newHistory;
    });
  }, []);

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error("Could not clear search history.", e);
    }
  };


  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;
    if (query === searchQuery && isLoading) return;

    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchCompanies(query, location);
      setCompanies(results);
      setStep('selection');
      addToHistory(query);
    } catch (e: any) {
      console.error(e);
      setError((e.message || 'genericError') as keyof Translations);
      setStep('search');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, isLoading, addToHistory, location]);
  
  const getInitialProgress = (): ProgressMessage[] => [
    { key: 'executiveSummary', label: t('progress_exec_summary'), status: 'pending' },
    { key: 'companySummary', label: t('progress_summary'), status: 'pending' },
    { key: 'keyPersonnel', label: t('progress_personnel'), status: 'pending' },
    { key: 'beneficialOwnership', label: t('progress_ubo'), status: 'pending' },
    { key: 'pepScreening', label: t('progress_pep'), status: 'pending' },
    { key: 'amlRiskAssessment', label: t('progress_aml'), status: 'pending' },
    { key: 'regulatoryCompliance', label: t('progress_regulatory'), status: 'pending' },
    { key: 'financialHealthAnalysis', label: t('progress_financials'), status: 'pending' },
    { key: 'marketPresence', label: t('progress_market'), status: 'pending' },
    { key: 'productsAndServices', label: t('progress_products'), status: 'pending' },
    { key: 'strategicAnalysis', label: t('progress_swot'), status: 'pending' },
    { key: 'reputationalRisk', label: t('progress_reputation'), status: 'pending' },
    { key: 'socialMediaPresence', label: t('progress_social'), status: 'pending' },
    { key: 'certifications', label: t('progress_certs'), status: 'pending' },
    { key: 'dueDiligenceReport', label: t('progress_diligence'), status: 'pending' },
    { key: 'goNoGoAssessment', label: t('progress_goNoGo'), status: 'pending' },
  ];

  const handleSelectCompany = async (company: Company) => {
    setSelectedCompany(company);
    setProgressMessages(getInitialProgress());
    setStep('loading');
    setError(null);
    
    const onProgressUpdate = (key: string, status: ProgressMessage['status']) => {
        setProgressMessages(prev => 
            prev.map(msg => msg.key === key ? { ...msg, status } : msg)
        );
    };

    try {
      const generatedReport = await generateComprehensiveReport(company, onProgressUpdate);
      setReport(generatedReport);
      setStep('report');
    } catch (e: any) {
      console.error(e);
      setError((e.message || 'genericError') as keyof Translations);
      setStep('selection'); 
    }
  };

  const reset = () => {
    setStep('search');
    setSearchQuery('');
    setCompanies([]);
    setSelectedCompany(null);
    setReport(null);
    setIsLoading(false);
    setError(null);
    setProgressMessages([]);
  };

  const renderStep = () => {
    switch (step) {
      case 'search':
        return <SearchStep 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            error={error} 
            history={searchHistory}
            onClearHistory={handleClearHistory}
        />;
      case 'selection':
        return <SelectionStep companies={companies} onSelect={handleSelectCompany} onBack={reset} />;
      case 'loading':
        return <NewLoadingStep progressMessages={progressMessages} />;
      case 'report':
        return report && <ReportStep report={report} onNewSearch={reset} />;
      default:
        return <SearchStep 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            error={error} 
            history={searchHistory}
            onClearHistory={handleClearHistory}
        />;
    }
  };
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <main>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        {renderStep()}
    </main>
  );
};


const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <AppContent />
    </LocalizationProvider>
  );
};

export default App;