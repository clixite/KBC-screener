export type Step = 'search' | 'selection' | 'loading' | 'report';

export type Language = 'en' | 'fr' | 'nl';

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  address: string;
}

export interface RiskAssessment {
  level: 'Low' | 'Medium' | 'High';
  summary: string;
  factors: string[];
}

export interface SanctionMatch {
  name: string;
  list: string;
  reason: string;
  source: string;
}

export interface Person {
  name: string;
  role: string;
  nationality: string;
  pepStatus: 'Yes' | 'No' | 'Potential';
}

export interface FinancialHealth {
  status: string;
  revenue: string;
  profitability: string;
  netIncome: string;
  totalAssets: string;
  totalLiabilities: string;
  debtRatio: string;
  summary: string;
}

export interface EsgAnalysis {
  rating: 'Leader' | 'Average' | 'Laggard';
  summary: string;
  environmental: string;
  social: string;
  governance: string;
}

export interface Certification {
  name: string;
  issuingBody: string;
  validUntil: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ComprehensiveReport {
  companySummary: {
    name: string;
    registrationNumber: string;
    address: string;
    website: string;
    description: string;
  };
  riskAssessment: RiskAssessment;
  sanctionsScreening: {
    status: 'Clear' | 'Found';
    matches: SanctionMatch[];
  };
  pepScreening: {
    status: 'Clear' | 'Found';
    matches: Person[];
  };
  adverseMedia: {
    status: 'Clear' | 'Negative findings';
    summary: string;
  };
  ownershipStructure: {
    summary: string;
    keyPeople: Person[];
  };
  financialHealth: FinancialHealth;
  esgAnalysis: EsgAnalysis;
  certifications: Certification[];
  sources: {
    web: GroundingSource[];
    maps: GroundingSource[];
  };
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}