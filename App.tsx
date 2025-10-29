import React, { useState, useEffect, useCallback } from 'react';
import { SearchStep } from './components/SearchStep';
import { SelectionStep } from './components/SelectionStep';
import { NewLoadingStep, ProgressMessage } from './components/NewLoadingStep';
import { ReportStep } from './components/ReportStep';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LocalizationProvider, useLocalization } from './contexts/LocalizationContext';
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
  const [error, setError] = useState<string | null>(null);
  const [progressMessages, setProgressMessages] = useState<ProgressMessage[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

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
  }, []);

  const addToHistory = useCallback((query: string) => {
    setSearchHistory(prev => {
      // Add new query to the front, remove duplicates, and limit size
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
    // Prevent re-searching if a search is already in progress for the same query
    if (query === searchQuery && isLoading) return;

    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchCompanies(query);
      setCompanies(results);
      setStep('selection');
      addToHistory(query);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'genericError');
      setStep('search'); // Stay on search screen to show error
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, isLoading, addToHistory]);
  
  const getInitialProgress = (): ProgressMessage[] => [
    { key: 'companySummary', label: t('progress_summary'), status: 'pending' },
    { key: 'keyPersonnel', label: t('progress_personnel'), status: 'pending' },
    { key: 'financialHighlights', label: t('progress_financials'), status: 'pending' },
    { key: 'marketPresence', label: t('progress_market'), status: 'pending' },
    { key: 'productsAndServices', label: t('progress_products'), status: 'pending' },
    { key: 'strategicAnalysis', label: t('progress_swot'), status: 'pending' },
    { key: 'compiling', label: t('progress_compiling'), status: 'pending' },
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
      setError(e.message || 'genericError');
      // If generation fails, we should provide an option to go back
      // For now, we'll go back to selection, but a better UX could be implemented
      // on the loading screen itself.
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
            <LanguageSwitcher />
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
