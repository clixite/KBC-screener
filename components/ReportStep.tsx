import React from 'react';
import { ComprehensiveReport, GroundingSource, Person, SanctionMatch } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { DownloadIcon } from './icons/DownloadIcon';

// This is required to extend the window object with the jsPDF types
declare global {
    interface Window {
        jspdf: any;
    }
}

interface ReportStepProps {
  report: ComprehensiveReport;
  onStartOver: () => void;
}

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden ${className}`}>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h2>
        </div>
        <div className="p-4 md:p-6">
            {children}
        </div>
    </div>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
    <div className="mb-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <div className="text-base text-slate-800 dark:text-slate-100">{value}</div>
    </div>
);

const RiskBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
    const levelClasses = {
        Low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${levelClasses[level]}`}>{level}</span>;
}

const StatusBadge: React.FC<{ status: 'Clear' | 'Found' | 'Negative findings' }> = ({ status }) => {
    const statusClasses = {
        Clear: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Found: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'Negative findings': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClasses[status]}`}>{status}</span>;
}

const EsgBadge: React.FC<{ rating: 'Leader' | 'Average' | 'Laggard' }> = ({ rating }) => {
    const { t } = useLocalization();
    const ratingClasses = {
        Leader: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        Average: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
        Laggard: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    };
    const ratingText = {
        Leader: t('esgLeader'),
        Average: t('esgAverage'),
        Laggard: t('esgLaggard'),
    };
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${ratingClasses[rating]}`}>{ratingText[rating]}</span>;
}

const PdfExportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onExport: (options: { orientation: 'portrait' | 'landscape'; includeSources: boolean }) => void;
    t: (key: string) => string;
}> = ({ isOpen, onClose, onExport, t }) => {
    const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait');
    const [includeSources, setIncludeSources] = React.useState(true);

    if (!isOpen) return null;

    const handleExportClick = () => {
        onExport({ orientation, includeSources });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{t('exportOptions')}</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('orientation')}</label>
                        <select
                            value={orientation}
                            onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                            className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="portrait">{t('portrait')}</option>
                            <option value="landscape">{t('landscape')}</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="include-sources"
                            type="checkbox"
                            checked={includeSources}
                            onChange={(e) => setIncludeSources(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="include-sources" className="ml-3 block text-sm text-slate-700 dark:text-slate-300">{t('includeSources')}</label>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-4 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800">
                        {t('cancel')}
                    </button>
                    <button onClick={handleExportClick} className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800">
                        {t('generatePdf')}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const ReportStep: React.FC<ReportStepProps> = ({ report, onStartOver }) => {
    const { t } = useLocalization();
    const [showPdfModal, setShowPdfModal] = React.useState(false);

    const handleExportPdf = (options: { orientation: 'portrait' | 'landscape', includeSources: boolean }) => {
        setShowPdfModal(false);
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: options.orientation, unit: 'pt', format: 'a4' });
    
        const isDark = document.documentElement.classList.contains('dark');
        const headingColor = isDark ? '#F1F5F9' : '#0F172A';
        const textColor = isDark ? '#E2E8F0' : '#1E293B';
        const secondaryTextColor = isDark ? '#94A3B8' : '#64748B';
        const tableHeaderBg = isDark ? '#334155' : '#F1F5F9';
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        const margin = 40;
        let y = 0;

        const addHeaderAndFooter = () => {
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(18).setTextColor(headingColor).text(t('reportFor'), margin, margin);
                doc.setFontSize(16).setTextColor(isDark ? '#818CF8' : '#4F46E5').text(report.companySummary?.name ?? 'N/A', margin, margin + 20);
                doc.setFontSize(8).setTextColor(secondaryTextColor).text(`Page ${i} / ${pageCount} | Confidential`, pageWidth / 2, pageHeight - 20, { align: 'center' });
            }
        };

        const checkPageBreak = (spaceNeeded: number) => {
            if (y + spaceNeeded > pageHeight - 50) {
                doc.addPage();
                y = margin + 40;
            }
        };

        const addSectionTitle = (title: string) => {
            checkPageBreak(40);
            y += (y === margin + 40) ? 0 : 20; // No extra space on new page
            doc.setFontSize(14).setTextColor(headingColor).text(title, margin, y);
            y += 20;
        };

        const addDetailItem = (label: string, value: string) => {
            checkPageBreak(30);
            doc.setFontSize(9).setTextColor(secondaryTextColor).text(label + ':', margin, y);
            const splitValue = doc.splitTextToSize(value || '-', pageWidth - margin * 2 - 80);
            doc.setFontSize(10).setTextColor(textColor).text(splitValue, margin + 80, y, { lineHeightFactor: 1.2 });
            y += (splitValue.length * 12) + 5;
        };
        
        y = margin + 40;

        // --- PDF CONTENT ---
        const sections = [
            { title: t('companySummary'), content: () => {
                addDetailItem(t('registrationNumber'), report.companySummary?.registrationNumber ?? 'N/A');
                addDetailItem(t('address'), report.companySummary?.address ?? 'N/A');
                addDetailItem(t('website'), report.companySummary?.website ?? 'N/A');
                addDetailItem(t('description'), report.companySummary?.description ?? 'N/A');
            }},
            { title: t('riskAssessment'), content: () => {
                addDetailItem(t('riskLevel'), report.riskAssessment?.level ?? 'N/A');
                addDetailItem(t('riskSummary'), report.riskAssessment?.summary ?? 'N/A');
                addDetailItem(t('keyRiskFactors'), '• ' + (report.riskAssessment?.factors ?? []).join('\n• '));
            }},
            { title: t('sanctionsScreening'), content: () => {
                addDetailItem(t('status'), report.sanctionsScreening?.status ?? 'N/A');
                const matches = report.sanctionsScreening?.matches ?? [];
                if (matches.length > 0) {
                    y += 5;
                    doc.autoTable({ startY: y, head: [[t('name'), t('list'), t('reason'), t('source')]], body: matches.map(m => [m.name, m.list, m.reason, m.source]), theme: 'grid', headStyles: { fillColor: tableHeaderBg, textColor: headingColor }, styles: { textColor: textColor, cellPadding: 4, fontSize: 8 }, didDrawPage: (data: any) => y = data.cursor.y });
                }
            }},
            { title: t('pepScreening'), content: () => {
                addDetailItem(t('status'), report.pepScreening?.status ?? 'N/A');
                const matches = report.pepScreening?.matches ?? [];
                if (matches.length > 0) {
                    y += 5;
                    doc.autoTable({ startY: y, head: [[t('name'), t('role'), t('nationality')]], body: matches.map(p => [p.name, p.role, p.nationality]), theme: 'grid', headStyles: { fillColor: tableHeaderBg, textColor: headingColor }, styles: { textColor: textColor, cellPadding: 4, fontSize: 9 }, didDrawPage: (data: any) => y = data.cursor.y });
                }
            }},
            { title: t('adverseMedia'), content: () => {
                addDetailItem(t('status'), report.adverseMedia?.status ?? 'N/A');
                addDetailItem(t('summary'), report.adverseMedia?.summary ?? 'N/A');
            }},
            { title: t('ownershipStructure'), content: () => {
                addDetailItem(t('summary'), report.ownershipStructure?.summary ?? 'N/A');
                const keyPeople = report.ownershipStructure?.keyPeople ?? [];
                if (keyPeople.length > 0) {
                    y += 5;
                    doc.autoTable({ startY: y, head: [[t('name'), t('role'), t('nationality'), t('pepStatus')]], body: keyPeople.map(p => [p.name, p.role, p.nationality, p.pepStatus]), theme: 'grid', headStyles: { fillColor: tableHeaderBg, textColor: headingColor }, styles: { textColor: textColor, cellPadding: 4, fontSize: 9 }, didDrawPage: (data: any) => y = data.cursor.y });
                }
            }},
            { title: t('financialHealth'), content: () => {
                addDetailItem(t('status'), report.financialHealth?.status ?? 'N/A');
                addDetailItem(t('revenue'), report.financialHealth?.revenue ?? 'N/A');
                addDetailItem(t('profitability'), report.financialHealth?.profitability ?? 'N/A');
                addDetailItem(t('netIncome'), report.financialHealth?.netIncome ?? 'N/A');
                addDetailItem(t('totalAssets'), report.financialHealth?.totalAssets ?? 'N/A');
                addDetailItem(t('totalLiabilities'), report.financialHealth?.totalLiabilities ?? 'N/A');
                addDetailItem(t('debtRatio'), report.financialHealth?.debtRatio ?? 'N/A');
                addDetailItem(t('summary'), report.financialHealth?.summary ?? 'N/A');
            }},
            { title: t('esgAnalysis'), content: () => {
                addDetailItem(t('rating'), report.esgAnalysis?.rating ?? 'N/A');
                addDetailItem(t('summary'), report.esgAnalysis?.summary ?? 'N/A');
                addDetailItem(t('environmental'), report.esgAnalysis?.environmental ?? 'N/A');
                addDetailItem(t('social'), report.esgAnalysis?.social ?? 'N/A');
                addDetailItem(t('governance'), report.esgAnalysis?.governance ?? 'N/A');
            }},
            { title: t('certifications'), content: () => {
                const certifications = report.certifications ?? [];
                if (certifications.length > 0) {
                    doc.autoTable({ startY: y, head: [[t('name'), t('issuingBody'), t('validUntil')]], body: certifications.map(c => [c.name, c.issuingBody, c.validUntil]), theme: 'grid', headStyles: { fillColor: tableHeaderBg, textColor: headingColor }, styles: { textColor: textColor, cellPadding: 4, fontSize: 9 }, didDrawPage: (data: any) => y = data.cursor.y });
                } else {
                    addDetailItem('', t('noCertificationsFound'));
                }
            }},
            ...(options.includeSources ? [{ title: t('sources'), content: () => {
                const webSources = report.sources?.web ?? [];
                if (webSources.length > 0) {
                    checkPageBreak(30);
                    doc.setFontSize(11).setTextColor(headingColor).text(t('webSources'), margin, y);
                    y += 15;
                    webSources.forEach(s => {
                        checkPageBreak(15);
                        doc.setFontSize(9).setTextColor(isDark ? '#818CF8' : '#4F46E5').textWithLink(s.title, margin, y, { url: s.uri });
                        y += 15;
                    });
                }
            }}] : [])
        ];
        
        sections.forEach(section => {
            addSectionTitle(section.title);
            section.content();
        });

        addHeaderAndFooter();
        doc.save(`${(report.companySummary?.name ?? 'Company').replace(/\s/g, '_')}_Report.pdf`);
    };
  
    const webSources = report.sources?.web ?? [];
    const mapSources = report.sources?.maps ?? [];

    return (
    <>
    <PdfExportModal isOpen={showPdfModal} onClose={() => setShowPdfModal(false)} onExport={handleExportPdf} t={t} />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-8 transition-colors">
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('reportFor')}</h1>
                        <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{report.companySummary?.name ?? t('unknownCompany')}</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setShowPdfModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all">
                            <DownloadIcon className="w-5 h-5" />
                            <span>{t('downloadReport')}</span>
                        </button>
                        <button onClick={onStartOver} className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all">
                            {t('startOver')}
                        </button>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title={t('companySummary')}>
                        <DetailItem label={t('registrationNumber')} value={report.companySummary?.registrationNumber ?? '-'} />
                        <DetailItem label={t('address')} value={report.companySummary?.address ?? '-'} />
                        <DetailItem label={t('website')} value={
                            report.companySummary?.website && report.companySummary.website !== 'Not Available' ? 
                            <a href={report.companySummary.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{report.companySummary.website}</a>
                            : '-'
                        } />
                        <DetailItem label={t('description')} value={report.companySummary?.description ?? '-'} />
                    </Card>

                    <Card title={t('ownershipStructure')}>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{report.ownershipStructure?.summary ?? '-'}</p>
                        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('keyPeople')}</h3>
                        <div className="space-y-3">
                            {(report.ownershipStructure?.keyPeople ?? []).map((person: Person, index) => (
                                <div key={index} className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{person.name} - <span className="font-normal text-slate-600 dark:text-slate-300">{person.role}</span></p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('nationality')}: {person.nationality} | {t('pepStatus')}: {person.pepStatus}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title={t('sanctionsScreening')}>
                            <DetailItem label={t('status')} value={report.sanctionsScreening?.status && <StatusBadge status={report.sanctionsScreening.status} />} />
                            {(report.sanctionsScreening?.matches ?? []).length > 0 && (
                                <>
                                <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">{t('matchesFound')}</h3>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {(report.sanctionsScreening?.matches ?? []).map((match: SanctionMatch, index) => (
                                        <div key={index} className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md text-sm">
                                            <p className="font-semibold">{match.name}</p>
                                            <p>{t('list')}: {match.list}</p>
                                            <p>{t('reason')}: {match.reason}</p>
                                            <p>{t('source')}: <a href={match.source} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{match.source}</a></p>
                                        </div>
                                    ))}
                                </div>
                                </>
                            )}
                        </Card>
                        <Card title={t('pepScreening')}>
                            <DetailItem label={t('status')} value={report.pepScreening?.status && <StatusBadge status={report.pepScreening.status} />} />
                             {(report.pepScreening?.matches ?? []).length > 0 && (
                                <>
                                <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">{t('matchesFound')}</h3>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {(report.pepScreening?.matches ?? []).map((match: Person, index) => (
                                        <div key={index} className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md text-sm">
                                            <p className="font-semibold">{match.name}</p>
                                            <p>{t('role')}: {match.role}</p>
                                            <p>{t('nationality')}: {match.nationality}</p>
                                        </div>
                                    ))}
                                </div>
                                </>
                            )}
                        </Card>
                    </div>

                    <Card title={t('adverseMedia')}>
                        <DetailItem label={t('status')} value={report.adverseMedia?.status && <StatusBadge status={report.adverseMedia.status} />} />
                        <p className="mt-2 text-slate-600 dark:text-slate-300">{report.adverseMedia?.summary ?? '-'}</p>
                    </Card>

                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Card title={t('riskAssessment')}>
                        <DetailItem label={t('riskLevel')} value={report.riskAssessment?.level && <RiskBadge level={report.riskAssessment.level} />} />
                        <DetailItem label={t('riskSummary')} value={report.riskAssessment?.summary ?? '-'} />
                        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">{t('keyRiskFactors')}</h3>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
                            {(report.riskAssessment?.factors ?? []).map((factor, index) => <li key={index}>{factor}</li>)}
                        </ul>
                    </Card>

                    <Card title={t('financialHealth')}>
                        <DetailItem label={t('status')} value={report.financialHealth?.status ?? '-'} />
                        <DetailItem label={t('revenue')} value={report.financialHealth?.revenue ?? '-'} />
                        <DetailItem label={t('profitability')} value={report.financialHealth?.profitability ?? '-'} />
                        <DetailItem label={t('netIncome')} value={report.financialHealth?.netIncome ?? '-'} />
                        <DetailItem label={t('totalAssets')} value={report.financialHealth?.totalAssets ?? '-'} />
                        <DetailItem label={t('totalLiabilities')} value={report.financialHealth?.totalLiabilities ?? '-'} />
                        <DetailItem label={t('debtRatio')} value={report.financialHealth?.debtRatio ?? '-'} />
                        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">{report.financialHealth?.summary ?? '-'}</p>
                    </Card>

                    <Card title={t('esgAnalysis')}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('rating')}</p>
                                {report.esgAnalysis?.rating && <EsgBadge rating={report.esgAnalysis.rating} />}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-4 text-base">{report.esgAnalysis?.summary ?? '-'}</p>
                        <div className="space-y-3">
                             <DetailItem label={t('environmental')} value={report.esgAnalysis?.environmental ?? '-'} />
                             <DetailItem label={t('social')} value={report.esgAnalysis?.social ?? '-'} />
                             <DetailItem label={t('governance')} value={report.esgAnalysis?.governance ?? '-'} />
                        </div>
                    </Card>
                    
                     <Card title={t('certifications')}>
                        {(report.certifications ?? []).length > 0 ? (
                             <div className="space-y-3">
                                {report.certifications.map((cert, index) => (
                                    <div key={index} className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{cert.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{t('issuingBody')}: {cert.issuingBody} | {t('validUntil')}: {cert.validUntil}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-slate-500 dark:text-slate-400">{t('noCertificationsFound')}</p>}
                    </Card>

                    <Card title={t('sources')}>
                        {webSources.length > 0 && (
                            <>
                                <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('webSources')}</h3>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {webSources.map((source: GroundingSource, index) => (
                                        <li key={`web-${index}`}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{source.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {mapSources.length > 0 && (
                             <>
                                <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">{t('mapSources')}</h3>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {mapSources.map((source: GroundingSource, index) => (
                                        <li key={`map-${index}`}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{source.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                         {webSources.length === 0 && mapSources.length === 0 && (
                             <p className="text-slate-500 dark:text-slate-400">{t('noSourcesProvided')}</p>
                         )}
                    </Card>

                </div>

            </main>
        </div>
    </div>
    </>
  );
};