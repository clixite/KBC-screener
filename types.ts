export interface Company {
  name: string;
  registrationNumber?: string;
  address?: string;
  website?: string;
  description?: string;
}

export interface ReportSource {
    title: string;
    uri: string;
}

export interface ReportSources {
    web: ReportSource[];
    maps: ReportSource[];
}

export interface KeyPersonnel {
    name: string;
    title: string;
    bio: string;
}

export interface StrategicAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface ComprehensiveReport {
    companySummary: Company & { overview: string };
    keyPersonnel: KeyPersonnel[];
    financialHighlights: Record<string, string>;
    marketPresence: string;
    productsAndServices: string;
    strategicAnalysis: StrategicAnalysis;
    sources?: ReportSources;
}
