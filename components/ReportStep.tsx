// components/ReportStep.tsx
import React from 'react';
import { ComprehensiveReport, RiskFactor, SanctionMatchDetail } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { DownloadIcon } from './icons/DownloadIcon';
import { exportReportAsPDF } from '../services/pdfService';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { HandRaisedIcon } from './icons/HandRaisedIcon';


interface ReportStepProps {
  report: ComprehensiveReport;
  onNewSearch: () => void;
}

export const ReportStep: React.FC<ReportStepProps> = ({ report, onNewSearch }) => {
  const { t } = useLocalization();

  const handleDownload = () => {
    exportReportAsPDF(report, t);
  };

  const renderSection = (title: string, content: React.ReactNode, key: string) => (
    <div key={key} className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 border border-slate-200 dark:border-slate-700 break-inside-avoid">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
      {content}
    </div>
  );

  const renderList = (items: string[] | undefined, emptyMessage: string) => {
    if (!items || items.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400 italic">{emptyMessage}</p>;
    }
    return (
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    );
  };
  
  const getRiskBadgeClass = (level: string | undefined) => {
    switch (level?.toLowerCase()) {
        case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
        case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
        case 'high': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  const getSentimentBadgeClass = (sentiment: string | undefined) => {
    switch (sentiment?.toLowerCase()) {
        case 'positive': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
        case 'neutral': return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200';
        case 'mixed': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
        case 'negative': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };
  
  const ExecutiveSummarySection = () => (
     <div className="bg-slate-100 dark:bg-slate-800 shadow-lg rounded-lg p-6 border border-slate-200 dark:border-slate-700 break-inside-avoid ring-2 ring-indigo-500/50">
        <div className="flex items-start gap-4">
            <ShieldCheckIcon className="w-10 h-10 text-indigo-500 flex-shrink-0" />
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('executiveSummary')}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">A high-level overview of the key findings.</p>
            </div>
        </div>
      
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center justify-center bg-white dark:bg-slate-700/50 p-4 rounded-md text-center">
                 <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('overallRisk')}</h3>
                 <span className={`mt-2 px-4 py-1.5 text-lg font-bold rounded-full ${getRiskBadgeClass(report.executiveSummary.overallRisk)}`}>
                    {report.executiveSummary.overallRisk || 'Unknown'}
                </span>
            </div>
            <div className="md:col-span-2">
                 <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.executiveSummary.summary}</p>
            </div>
        </div>
        <div className="mt-6">
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('keyFindings')}</h4>
            <div className="mt-2">
                {renderList(report.executiveSummary.keyFindings, 'No specific key findings were highlighted.')}
            </div>
        </div>
    </div>
  );

  const GoNoGoSection = () => {
    if (!report.goNoGoAssessment) return null;

    const { recommendation, justification } = report.goNoGoAssessment;
    let badgeClass = '';
    let icon: React.ReactNode;

    switch (recommendation) {
        case 'Go':
            badgeClass = 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200 ring-emerald-600/20';
            icon = <ThumbUpIcon className="w-8 h-8 text-emerald-500" />;
            break;
        case 'Go with conditions':
            badgeClass = 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200 ring-amber-600/20';
            icon = <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />;
            break;
        case 'No-Go':
            badgeClass = 'bg-rose-100 text-rose-900 dark:bg-rose-900/50 dark:text-rose-200 ring-rose-600/20';
            icon = <HandRaisedIcon className="w-8 h-8 text-rose-500" />;
            break;
    }

    return (
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 border border-slate-200 dark:border-slate-700 break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('goNoGoAssessment')}</h2>
            <div className={`flex flex-col md:flex-row items-center gap-6 p-4 rounded-lg ring-1 ring-inset ${badgeClass}`}>
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    {icon}
                    <span className="text-xl font-bold">{recommendation}</span>
                </div>
                <div className="flex-grow">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{t('justification')}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{justification}</p>
                </div>
            </div>
        </div>
    );
  };

  const RiskFactorDisplay: React.FC<{title: string, riskFactor: RiskFactor | (RiskFactor & {matches?: SanctionMatchDetail[]}) | undefined}> = ({ title, riskFactor }) => {
    if (!riskFactor) return null;
    const sanctionsFactor = riskFactor as RiskFactor & { matches?: SanctionMatchDetail[] };

    return (
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex justify-between items-start gap-2">
                <h5 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h5>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getRiskBadgeClass(riskFactor.riskLevel)} flex-shrink-0`}>
                    {riskFactor.riskLevel || 'Unknown'}
                </span>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{riskFactor.summary}</p>
            {sanctionsFactor.matches && sanctionsFactor.matches.length > 0 && (
                 <div className="mt-3">
                    <h6 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">{t('sanctionMatchDetails')}</h6>
                    <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-700">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                          <thead className="bg-slate-50 dark:bg-slate-900/50">
                              <tr>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t('pdf_sanction_name')}</th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t('pdf_sanction_list')}</th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t('pdf_sanction_details')}</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                              {sanctionsFactor.matches.map((match, i) => (
                                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                      <td className="px-4 py-3 text-sm font-semibold text-rose-800 dark:text-rose-200">{match.name}</td>
                                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{match.list}</td>
                                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{match.details}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                 </div>
            )}
        </div>
    )
  };


  const sections = [
    {
      key: 'companySummary',
      title: t('companySummary'),
      content: (
        <div>
          <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{report.companySummary.name}</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.companySummary.overview}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p><strong>{t('registrationNumber')}:</strong> {report.companySummary.registrationNumber || 'N/A'}</p>
            <p><strong>{t('address')}:</strong> {report.companySummary.address || 'N/A'}</p>
            <p><strong>{t('website')}:</strong> {report.companySummary.website ? <a href={report.companySummary.website} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all">{report.companySummary.website}</a> : 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'amlRiskAssessment',
      title: t('amlRiskAssessment'),
      condition: report.amlRiskAssessment,
      content: (
        <div className="space-y-4">
            <div>
                <span className="font-bold text-slate-600 dark:text-slate-300">{t('riskLevel')}: </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskBadgeClass(report.amlRiskAssessment.riskLevel)}`}>
                    {report.amlRiskAssessment.riskLevel || 'Unknown'}
                </span>
            </div>
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('summary')}</h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.amlRiskAssessment.summary}</p>
            </div>
            {report.amlRiskAssessment.detailedBreakdown && (
                <div className="mt-6">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('riskFactorsBreakdown')}</h4>
                    <div className="space-y-3">
                        <RiskFactorDisplay title={t('jurisdictionRisk')} riskFactor={report.amlRiskAssessment.detailedBreakdown.jurisdictionRisk} />
                        <RiskFactorDisplay title={t('industryRisk')} riskFactor={report.amlRiskAssessment.detailedBreakdown.industryRisk} />
                        <RiskFactorDisplay title={t('sanctionsMatches')} riskFactor={report.amlRiskAssessment.detailedBreakdown.sanctionsMatches} />
                    </div>
                </div>
            )}
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mt-6">{t('redFlags')}</h4>
                {renderList(report.amlRiskAssessment.redFlags, 'No red flags identified.')}
            </div>
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mt-6">{t('crimeTypologies')}</h4>
                {renderList(report.amlRiskAssessment.crimeTypologies, 'No specific crime typologies identified.')}
            </div>
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mt-6">{t('mitigationStrategies')}</h4>
                {renderList(report.amlRiskAssessment.mitigationStrategies, 'No specific mitigation strategies recommended.')}
            </div>
        </div>
      )
    },
    {
      key: 'dueDiligenceReport',
      title: t('dueDiligenceReport'),
      condition: report.dueDiligenceReport,
      content: (() => {
        const vs = report.dueDiligenceReport.verificationSummary;
        return (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('verificationSummary')}</h4>
                    <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md border border-slate-200 dark:border-slate-700/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <p><strong className="font-semibold text-slate-600 dark:text-slate-300">Company Name:</strong> {vs.companyName}</p>
                            <p><strong className="font-semibold text-slate-600 dark:text-slate-300">Legal Status:</strong> {vs.legalStatus}</p>
                            <p className="sm:col-span-2"><strong className="font-semibold text-slate-600 dark:text-slate-300">Registration:</strong> {vs.registrationDetails}</p>
                            <p className="sm:col-span-2"><strong className="font-semibold text-slate-600 dark:text-slate-300">Regulatory Oversight:</strong> {vs.regulatoryOversight}</p>
                            <div className="sm:col-span-2 flex items-center gap-2">
                                <strong className="font-semibold text-slate-600 dark:text-slate-300">Existence Confirmed:</strong> 
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${vs.existenceConfirmed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'}`}>
                                    {vs.existenceConfirmed ? t('yes') : t('no')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('riskConsolidation')}</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.dueDiligenceReport.riskConsolidation}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('finalRecommendation')}</h4>
                    <p className="mt-1 text-lg font-bold text-indigo-600 dark:text-indigo-400">{report.dueDiligenceReport.finalRecommendation}</p>
                </div>
            </div>
        );
      })()
    },
    {
      key: 'pepScreening',
      title: t('pepScreening'),
      condition: report.pepScreening,
      content: (
        <div className="space-y-4">
          <p className="font-bold text-lg">{report.pepScreening.isPEPInvolved ? 'Yes' : 'No'}</p>
          {report.pepScreening.isPEPInvolved && (
            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('pepDetails')}</h4>
              <div className="space-y-3">
                {report.pepScreening.details.map((person, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                    <p className="font-bold">{person.name} - <span className="font-normal italic">{person.title}</span></p>
                    {person.relationship && <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{person.relationship}</p>}
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{person.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'beneficialOwnership',
      title: t('beneficialOwnership'),
      condition: report.beneficialOwnership,
      content: (
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('uboSummary')}</h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.beneficialOwnership.summary}</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('uboList')}</h4>
                {report.beneficialOwnership.ubos?.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {report.beneficialOwnership.ubos.map((ubo, i) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md text-sm">
                        <p className="font-bold">{ubo.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">Ownership: {ubo.ownershipPercentage || 'N/A'} | Nationality: {ubo.nationality || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-500 dark:text-slate-400 italic">No specific UBOs identified.</p>}
            </div>
        </div>
      )
    },
    {
      key: 'regulatoryCompliance',
      title: t('regulatoryCompliance'),
      condition: report.regulatoryCompliance,
      content: (
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('regulatorySummary')}</h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.regulatoryCompliance.summary}</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('legalIssues')}</h4>
                {renderList(report.regulatoryCompliance.legalIssues, 'No legal issues found.')}
            </div>
             <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('regulatoryActions')}</h4>
                {renderList(report.regulatoryCompliance.regulatoryActions, 'No regulatory actions found.')}
            </div>
        </div>
      )
    },
    {
      key: 'certifications',
      title: t('certifications'),
      condition: report.certifications && report.certifications.length > 0,
      content: (
        <div className="space-y-4">
          {report.certifications.map((cert, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
              <h4 className="font-bold">{cert.name}</h4>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Issued by: {cert.issuingBody}</p>
              <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{cert.description}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'keyPersonnel',
      title: t('keyPersonnel'),
      condition: report.keyPersonnel && report.keyPersonnel.length > 0,
      content: (
        <div className="space-y-4">
          {report.keyPersonnel.map((person, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
              <h4 className="font-bold">{person.name} - <span className="font-normal text-slate-500 dark:text-slate-400">{person.title}</span></h4>
              <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{person.bio}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'financialHealthAnalysis',
      title: t('financialHealthAnalysis'),
      condition: report.financialHealthAnalysis && Object.keys(report.financialHealthAnalysis).length > 0,
      content: (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(report.financialHealthAnalysis).map(([key, value]) => (
                <div key={key} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{key}</p>
                    <p className="text-lg font-bold">{value}</p>
                </div>
            ))}
        </div>
      )
    },
    {
      key: 'marketPresence',
      title: t('marketPresence'),
      condition: report.marketPresence,
      content: <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.marketPresence}</p>
    },
    {
      key: 'productsAndServices',
      title: t('productsAndServices'),
      condition: report.productsAndServices,
      content: <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.productsAndServices}</p>
    },
    {
      key: 'strategicAnalysis',
      title: t('strategicAnalysis'),
      condition: report.strategicAnalysis,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">{t('strengths')}</h4>
            {renderList(report.strategicAnalysis.strengths, 'No strengths listed.')}
          </div>
          <div>
            <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-2">{t('weaknesses')}</h4>
            {renderList(report.strategicAnalysis.weaknesses, 'No weaknesses listed.')}
          </div>
          <div>
            <h4 className="font-bold text-sky-600 dark:text-sky-400 mb-2">{t('opportunities')}</h4>
            {renderList(report.strategicAnalysis.opportunities, 'No opportunities listed.')}
          </div>
          <div>
            <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-2">{t('threats')}</h4>
            {renderList(report.strategicAnalysis.threats, 'No threats listed.')}
          </div>
        </div>
      )
    },
    {
      key: 'reputationalRisk',
      title: t('reputationalRisk'),
      condition: report.reputationalRisk,
      content: (
        <div className="space-y-4">
            <div>
                <span className="font-bold text-slate-600 dark:text-slate-300">{t('sentiment')}: </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getSentimentBadgeClass(report.reputationalRisk.sentiment)}`}>
                    {report.reputationalRisk.sentiment || 'Unknown'}
                </span>
            </div>
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('reputationSummary')}</h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.reputationalRisk.summary}</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('keyMentions')}</h4>
                {renderList(report.reputationalRisk.keyMentions, 'No key media mentions found.')}
            </div>
        </div>
      )
    },
    {
      key: 'socialMediaPresence',
      title: t('socialMediaPresence'),
      condition: report.socialMediaPresence,
      content: (
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t('summary')}</h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.socialMediaPresence.summary}</p>
            </div>
            {report.socialMediaPresence.profiles?.length > 0 && (
                <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">{t('profiles')}</h4>
                    <div className="space-y-3">
                        {report.socialMediaPresence.profiles.map((profile, i) => (
                            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                <p className="font-bold">{profile.platform}</p>
                                <a href={profile.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:underline break-all">{profile.url}</a>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{profile.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )
    },
    {
      key: 'sources',
      title: t('sources'),
      condition: report.sources && (report.sources.web.length > 0 || report.sources.maps.length > 0),
      content: (
        <div className="space-y-4">
            {report.sources?.web.length > 0 && (
                <div>
                    <h4 className="font-bold mb-2">{t('webSources')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {report.sources.web.map((source, i) => (
                            <li key={i}><a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all">{source.title}</a></li>
                        ))}
                    </ul>
                </div>
            )}
            {report.sources?.maps.length > 0 && (
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
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4 print:hidden">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              {t('reportTitle')}
            </h1>
            <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{report.companySummary.name}</p>
          </div>
          <div className="flex gap-4">
            <button
                onClick={handleDownload}
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
          {report.executiveSummary && <ExecutiveSummarySection />}
          {report.goNoGoAssessment && <GoNoGoSection />}
          {sections.map(section => 
             (section.condition === undefined || section.condition) && renderSection(section.title, section.content, section.key)
          )}
        </div>
      </div>
    </div>
  );
};