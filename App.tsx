import React from 'react';
import { Step, Company, ComprehensiveReport } from './types';
import { SearchStep } from './components/SearchStep';
import { SelectionStep } from './components/SelectionStep';
import { LoadingStep } from './components/LoadingStep';
import { ReportStep } from './components/ReportStep';
import { findCompanies, generateComprehensiveReport } from './services/geminiService';
import { ThemeToggle } from './components/ThemeToggle';
import { LocalizationProvider, useLocalization } from './contexts/LocalizationContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const AppContent: React.FC = () => {
  const [step, setStep] = React.useState<Step>('search');
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const [report, setReport] = React.useState<ComprehensiveReport | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { language } = useLocalization();

  const handleSearch = async (companyName: string) => {
    setIsLoading(true);
    const foundCompanies = await findCompanies(companyName, language);
    setCompanies(foundCompanies);
    setStep('selection');
    setIsLoading(false);
  };

  const handleSelectCompany = async (company: Company) => {
    setSelectedCompany(company);
    setStep('loading');
    const generatedReport = await generateComprehensiveReport(company, language);
    if (generatedReport) {
      setReport(generatedReport);
      setStep('report');
    } else {
      // Handle error case, e.g., show an error message and go back
      alert('Failed to generate the report. Please try again.');
      handleBackToSearch();
    }
  };

  const handleBackToSearch = () => {
    setStep('search');
    setCompanies([]);
  };
  
  const handleStartOver = () => {
    setStep('search');
    setCompanies([]);
    setSelectedCompany(null);
    setReport(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'search':
        return <SearchStep onSearch={handleSearch} isLoading={isLoading} />;
      case 'selection':
        return <SelectionStep companies={companies} onSelect={handleSelectCompany} onBack={handleBackToSearch}/>;
      case 'loading':
        return <LoadingStep />;
      case 'report':
        if (report) {
          return <ReportStep report={report} onStartOver={handleStartOver} />;
        }
        // Fallback to search if data is missing
        handleStartOver();
        return <SearchStep onSearch={handleSearch} isLoading={isLoading} />;
      default:
        return <SearchStep onSearch={handleSearch} isLoading={isLoading} />;
    }
  };

  return <>{renderStep()}</>
}


function App() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <LocalizationProvider>
      <main className="font-sans antialiased">
        <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
        {/* FIX: Add the LanguageSwitcher component to the UI */}
        <LanguageSwitcher />
        <AppContent />
      </main>
    </LocalizationProvider>
  );
}

export default App;