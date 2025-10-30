// types.ts
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

export interface RiskFactor {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
    summary: string;
}

export interface SanctionMatchDetail {
    name: string;
    list: string;
    details: string;
}

export interface AMLRiskAssessment {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
    summary: string;
    redFlags: string[];
    detailedBreakdown?: {
        jurisdictionRisk: RiskFactor;
        industryRisk: RiskFactor;
        sanctionsMatches: RiskFactor & { matches?: SanctionMatchDetail[] };
    };
    crimeTypologies?: string[];
    mitigationStrategies?: string[];
}

export interface PEPScreeningDetail {
    name: string;
    title: string;
    reason: string;
    relationship?: string;
}

export interface PEPScreening {
    isPEPInvolved: boolean;
    details: PEPScreeningDetail[];
}

export interface UBO {
    name: string;
    ownershipPercentage?: string;
    nationality?: string;
}

export interface BeneficialOwnership {
    summary: string;
    ubos: UBO[];
}

export interface RegulatoryCompliance {
    summary: string;
    legalIssues: string[];
    regulatoryActions: string[];
}

export interface ReputationalRisk {
    summary: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Mixed' | 'Unknown';
    keyMentions: string[];
}

export interface SocialMediaProfile {
    platform: string;
    url: string;
    summary: string;
}

export interface SocialMediaPresence {
    summary: string;
    profiles: SocialMediaProfile[];
}

export interface ExecutiveSummary {
    summary: string;
    overallRisk: 'Low' | 'Medium' | 'High' | 'Unknown';
    keyFindings: string[];
}

export interface Certification {
    name: string;
    issuingBody: string;
    description: string;
}

export interface VerificationDetails {
    companyName: string;
    legalStatus: string;
    registrationDetails: string;
    regulatoryOversight: string;
    existenceConfirmed: boolean;
}

export interface DueDiligenceReport {
    verificationSummary: VerificationDetails;
    riskConsolidation: string;
    finalRecommendation: string;
}

export interface GoNoGoAssessment {
    recommendation: 'Go' | 'Go with conditions' | 'No-Go';
    justification: string;
}

export interface ComprehensiveReport {
    executiveSummary: ExecutiveSummary;
    goNoGoAssessment: GoNoGoAssessment;
    companySummary: Company & { overview: string };
    keyPersonnel: KeyPersonnel[];
    financialHealthAnalysis: Record<string, string>;
    marketPresence: string;
    productsAndServices: string;
    strategicAnalysis: StrategicAnalysis;
    
    // New banking-level sections
    amlRiskAssessment: AMLRiskAssessment;
    pepScreening: PEPScreening;
    beneficialOwnership: BeneficialOwnership;
    regulatoryCompliance: RegulatoryCompliance;
    reputationalRisk: ReputationalRisk;
    socialMediaPresence: SocialMediaPresence;
    certifications: Certification[];
    dueDiligenceReport: DueDiligenceReport;

    sources?: ReportSources;
}