// services/pdfService.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ComprehensiveReport } from '../types';
import { Translations } from '../contexts/LocalizationContext';

type jsPDFWithLastAutoTable = jsPDF & {
  lastAutoTable: {
    finalY: number;
  };
};

// --- LAYOUT CONSTANTS for a professional and consistent design ---
const FONT_SIZE_H1 = 20;
const FONT_SIZE_H2 = 14;
const FONT_SIZE_H4 = 11;
const FONT_SIZE_BODY = 10;
const LINE_HEIGHT = 5;

const MARGIN = 15;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const HEADER_HEIGHT = 20;
const FOOTER_HEIGHT = 20;
const CONTENT_END_Y = PAGE_HEIGHT - FOOTER_HEIGHT;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

const SPACE_AFTER_H2 = 8;
const SPACE_AFTER_H4 = 4;
const SPACE_AFTER_P = 6;
const SPACE_AFTER_TABLE = 10;
const SPACE_AFTER_LIST = 8;
const MIN_CONTENT_AFTER_HEADER = 20; // Min space required to avoid orphan headers

// --- COLOR PALETTE ---
const INDIGO_COLOR: [number, number, number] = [67, 56, 202];
const SLATE_COLOR_DARK: [number, number, number] = [30, 41, 59];
const SLATE_COLOR_LIGHT: [number, number, number] = [226, 232, 240];
const TEXT_COLOR_BODY: [number, number, number] = [30, 41, 59];


class PdfBuilder {
  doc: jsPDFWithLastAutoTable;
  yPos: number;
  t: (key: keyof Translations) => string;
  report: ComprehensiveReport;

  constructor(report: ComprehensiveReport, t: (key: keyof Translations) => string) {
    this.doc = new jsPDF() as jsPDFWithLastAutoTable;
    this.yPos = HEADER_HEIGHT;
    this.t = t;
    this.report = report;
  }

  ensureSpace(heightNeeded: number) {
    if (this.yPos + heightNeeded > CONTENT_END_Y) {
      this.doc.addPage();
      this.yPos = HEADER_HEIGHT;
    }
  }

  addCoverPage() {
    this.doc.setFillColor(...INDIGO_COLOR);
    this.doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(28);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(this.t('pdf_cover_title'), PAGE_WIDTH / 2, PAGE_HEIGHT / 2 - 20, { align: 'center' });
    
    this.doc.setFontSize(16);
    this.doc.text(this.t('pdf_cover_for'), PAGE_WIDTH / 2, PAGE_HEIGHT / 2, { align: 'center' });
    
    this.doc.setFontSize(22);
    this.doc.text(this.report.companySummary.name, PAGE_WIDTH / 2, PAGE_HEIGHT / 2 + 10, { align: 'center' });

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(12);
    this.doc.text(`${this.t('pdf_cover_date')}: ${new Date().toLocaleDateString()}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 30, { align: 'center' });

    this.doc.addPage();
  }


  addTitle(title: string, subtitle: string) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(FONT_SIZE_H1);
    this.doc.setTextColor(...INDIGO_COLOR);
    this.doc.text(title, PAGE_WIDTH / 2, this.yPos, { align: 'center' });
    this.yPos += 8;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(12);
    this.doc.setTextColor(...SLATE_COLOR_DARK);
    this.doc.text(subtitle, PAGE_WIDTH / 2, this.yPos, { align: 'center' });
    this.yPos += 15;
  }
  
  addH2(title: string) {
    const headerHeight = 14; // Approximate height for H2 + line + space
    this.ensureSpace(headerHeight + MIN_CONTENT_AFTER_HEADER); // Orphan prevention
    
    this.doc.setFontSize(FONT_SIZE_H2);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...INDIGO_COLOR);
    this.doc.text(title, MARGIN, this.yPos);
    this.yPos += 6;
    
    this.doc.setDrawColor(...SLATE_COLOR_LIGHT);
    this.doc.line(MARGIN, this.yPos, PAGE_WIDTH - MARGIN, this.yPos);
    this.yPos += SPACE_AFTER_H2;
    
    this.doc.setTextColor(...TEXT_COLOR_BODY);
    this.doc.setFont('helvetica', 'normal');
  }

  addH4(title: string) {
    const headerHeight = 7;
    this.ensureSpace(headerHeight);
    
    this.doc.setFontSize(FONT_SIZE_H4);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...SLATE_COLOR_DARK);
    this.doc.text(title, MARGIN, this.yPos);
    this.yPos += SPACE_AFTER_H4;
    
    this.doc.setFont('helvetica', 'normal');
  }
  
  addBodyText(text: string | undefined) {
    this.doc.setFontSize(FONT_SIZE_BODY);
    this.doc.setTextColor(...TEXT_COLOR_BODY);
    const splitText = this.doc.splitTextToSize(text || 'N/A', CONTENT_WIDTH);
    
    this.ensureSpace(splitText.length * LINE_HEIGHT);
    this.doc.text(splitText, MARGIN, this.yPos);
    this.yPos += splitText.length * LINE_HEIGHT + SPACE_AFTER_P;
  }
  
  addList(items: string[] | undefined, emptyMessageKey: keyof Translations) {
    this.doc.setFontSize(FONT_SIZE_BODY);
    this.doc.setTextColor(...TEXT_COLOR_BODY);
    if (!items || items.length === 0) {
        this.addBodyText(`- ${this.t(emptyMessageKey)}`);
        return;
    }
    items.forEach(item => {
        const splitItem = this.doc.splitTextToSize(item, CONTENT_WIDTH - 5);
        this.ensureSpace(splitItem.length * LINE_HEIGHT);
        this.doc.text('\u2022', MARGIN + 2, this.yPos + 3.5);
        this.doc.text(splitItem, MARGIN + 5, this.yPos + 3.5);
        this.yPos += splitItem.length * LINE_HEIGHT + 2;
    });
    this.yPos += SPACE_AFTER_LIST;
  }

  addKeyValue(key: string, value: string | undefined) {
    this.doc.setFontSize(FONT_SIZE_BODY);
    const formattedValue = value || 'N/A';
    
    const keyWidth = this.doc.getTextWidth(key + ':') + 2;
    const valueX = MARGIN + keyWidth;
    const valueWidth = CONTENT_WIDTH - keyWidth;
    
    const splitValue = this.doc.splitTextToSize(formattedValue, valueWidth);
    this.ensureSpace(splitValue.length * LINE_HEIGHT);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...SLATE_COLOR_DARK);
    this.doc.text(key + ':', MARGIN, this.yPos);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...TEXT_COLOR_BODY);
    this.doc.text(splitValue, valueX, this.yPos);

    this.yPos += splitValue.length * LINE_HEIGHT + 3;
  }
  
  addTable(head: string[][], body: (string | null | undefined)[][]) {
    this.ensureSpace(20); // Ensure there's at least some space for the table header
    autoTable(this.doc, {
      startY: this.yPos,
      head: head,
      body: body.map(row => row.map(cell => cell || 'N/A')),
      theme: 'grid',
      headStyles: { 
        fillColor: INDIGO_COLOR,
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        overflow: 'linebreak',
      },
      didDrawPage: () => {
        this.yPos = HEADER_HEIGHT;
      }
    });
    this.yPos = this.doc.lastAutoTable.finalY + SPACE_AFTER_TABLE;
  }

  addHeaderAndFooter() {
    const pageCount = this.doc.internal.getNumberOfPages();
    for (let i = 2; i <= pageCount; i++) {
        this.doc.setPage(i);
        
        // Header
        this.doc.setFontSize(9);
        this.doc.setTextColor(100, 116, 139);
        const headerText = `KYC Business Screener | ${this.report.companySummary.name}`;
        this.doc.text(headerText, MARGIN, 10);
        this.doc.setDrawColor(...SLATE_COLOR_LIGHT);
        this.doc.line(MARGIN, 14, PAGE_WIDTH - MARGIN, 14);

        // Footer
        this.doc.line(MARGIN, PAGE_HEIGHT - 12, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 12);
        const footerText = `Page ${i - 1} of ${pageCount - 1}`;
        this.doc.text(footerText, MARGIN, PAGE_HEIGHT - 8);
        this.doc.text(new Date().toLocaleDateString(), PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 8, { align: 'right' });
    }
  }
  
  save(filename: string) {
    this.addHeaderAndFooter();
    this.doc.save(filename);
  }
}

export const exportReportAsPDF = (report: ComprehensiveReport, t: (key: keyof Translations) => string) => {
    const builder = new PdfBuilder(report, t);
    
    builder.addCoverPage();
    builder.addTitle(t('reportTitle'), report.companySummary.name);
    
    builder.addH2(t('executiveSummary'));
    builder.addKeyValue(t('overallRisk'), report.executiveSummary.overallRisk);
    builder.addBodyText(report.executiveSummary.summary);
    builder.addH4(t('keyFindings'));
    builder.addList(report.executiveSummary.keyFindings, 'na');

    if (report.goNoGoAssessment) {
        builder.addH2(t('goNoGoAssessment'));
        builder.addKeyValue(t('finalRecommendation'), report.goNoGoAssessment.recommendation);
        builder.addH4(t('justification'));
        builder.addBodyText(report.goNoGoAssessment.justification);
    }

    builder.addH2(t('companySummary'));
    builder.addBodyText(report.companySummary.overview);
    builder.addKeyValue(t('registrationNumber'), report.companySummary.registrationNumber);
    builder.addKeyValue(t('address'), report.companySummary.address);
    builder.addKeyValue(t('website'), report.companySummary.website);

    builder.addH2(t('amlRiskAssessment'));
    builder.addKeyValue(t('riskLevel'), report.amlRiskAssessment.riskLevel);
    builder.addH4(t('summary'));
    builder.addBodyText(report.amlRiskAssessment.summary);

    const breakdown = report.amlRiskAssessment.detailedBreakdown;
    if (breakdown) {
        builder.addH4(t('riskFactorsBreakdown'));
        builder.addKeyValue(`${t('jurisdictionRisk')} (${breakdown.jurisdictionRisk.riskLevel})`, breakdown.jurisdictionRisk.summary);
        builder.addKeyValue(`${t('industryRisk')} (${breakdown.industryRisk.riskLevel})`, breakdown.industryRisk.summary);
        
        builder.addH4(t('sanctionsMatches'));
        builder.addBodyText(breakdown.sanctionsMatches.summary);
        if (breakdown.sanctionsMatches.matches && breakdown.sanctionsMatches.matches.length > 0) {
            builder.addTable(
                [[t('pdf_sanction_name'), t('pdf_sanction_list'), t('pdf_sanction_details')]],
                breakdown.sanctionsMatches.matches.map(m => [m.name, m.list, m.details])
            );
        }
    }
    
    builder.addH4(t('redFlags'));
    builder.addList(report.amlRiskAssessment.redFlags, 'noRedFlags');

    builder.addH4(t('crimeTypologies'));
    builder.addList(report.amlRiskAssessment.crimeTypologies, 'noTypologies');

    builder.addH4(t('mitigationStrategies'));
    builder.addList(report.amlRiskAssessment.mitigationStrategies, 'noMitigations');

    if (report.dueDiligenceReport) {
        builder.addH2(t('dueDiligenceReport'));
        const vs = report.dueDiligenceReport.verificationSummary;
        if (vs) {
            builder.addH4(t('verificationSummary'));
            builder.addKeyValue('Company Name', vs.companyName);
            builder.addKeyValue('Legal Status', vs.legalStatus);
            builder.addKeyValue('Registration Details', vs.registrationDetails);
            builder.addKeyValue('Regulatory Oversight', vs.regulatoryOversight);
            builder.addKeyValue('Existence Confirmed', vs.existenceConfirmed ? t('yes') : t('no'));
        }
        builder.addH4(t('riskConsolidation'));
        builder.addBodyText(report.dueDiligenceReport.riskConsolidation);
        builder.addH4(t('finalRecommendation'));
        builder.addBodyText(report.dueDiligenceReport.finalRecommendation);
    }
    
    builder.addH2(t('pepScreening'));
    builder.addKeyValue(t('pepInvolved'), report.pepScreening.isPEPInvolved ? t('yes') : t('no'));
    if (report.pepScreening.isPEPInvolved && report.pepScreening.details.length > 0) {
        builder.addTable(
            [[t('pdf_name'), t('pdf_title'), t('pdf_relationship'), t('pdf_reason')]],
            report.pepScreening.details.map(p => [p.name, p.title, p.relationship, p.reason])
        );
    }
    
    builder.addH2(t('beneficialOwnership'));
    builder.addBodyText(report.beneficialOwnership.summary);
    if (report.beneficialOwnership.ubos?.length > 0) {
        builder.addTable(
            [[t('pdf_name'), t('pdf_ownership'), t('pdf_nationality')]],
            report.beneficialOwnership.ubos.map(u => [u.name, u.ownershipPercentage, u.nationality])
        );
    }
    
    builder.addH2(t('regulatoryCompliance'));
    builder.addBodyText(report.regulatoryCompliance.summary);
    builder.addH4(t('legalIssues'));
    builder.addList(report.regulatoryCompliance.legalIssues, 'noLegalIssues');
    builder.addH4(t('regulatoryActions'));
    builder.addList(report.regulatoryCompliance.regulatoryActions, 'noRegulatoryActions');

    if (report.certifications && report.certifications.length > 0) {
        builder.addH2(t('certifications'));
        builder.addTable(
            [[t('pdf_cert_name'), t('pdf_cert_body'), t('pdf_cert_desc')]],
            report.certifications.map(c => [c.name, c.issuingBody, c.description])
        );
    }

    builder.addH2(t('reputationalRisk'));
    builder.addKeyValue(t('sentiment'), report.reputationalRisk.sentiment);
    builder.addBodyText(report.reputationalRisk.summary);
    builder.addH4(t('keyMentions'));
    builder.addList(report.reputationalRisk.keyMentions, 'noKeyMentions');

    if (report.socialMediaPresence) {
      builder.addH2(t('socialMediaPresence'));
      builder.addBodyText(report.socialMediaPresence.summary);
      if (report.socialMediaPresence.profiles?.length > 0) {
          builder.addTable(
              [[t('pdf_platform'), t('pdf_url'), t('pdf_summary')]],
              report.socialMediaPresence.profiles.map(p => [p.platform, p.url, p.summary])
          );
      }
    }

    builder.addH2(t('keyPersonnel'));
    if(report.keyPersonnel?.length > 0) {
        builder.addTable(
            [[t('pdf_name'), t('pdf_title'), t('pdf_biography')]],
            report.keyPersonnel.map(p => [p.name, p.title, p.bio])
        );
    } else {
        builder.addBodyText('No key personnel identified.');
    }
    
    builder.addH2(t('financialHealthAnalysis'));
    builder.addTable(
        [[t('pdf_metric'), t('pdf_value')]],
        Object.entries(report.financialHealthAnalysis).map(([key, value]) => [key, value])
    );
    
    builder.addH2(t('marketPresence'));
    builder.addBodyText(report.marketPresence);

    builder.addH2(t('productsAndServices'));
    builder.addBodyText(report.productsAndServices);
    
    builder.addH2(t('strategicAnalysis'));
    builder.addH4(t('strengths'));
    builder.addList(report.strategicAnalysis.strengths, 'na');
    builder.addH4(t('weaknesses'));
    builder.addList(report.strategicAnalysis.weaknesses, 'na');
    builder.addH4(t('opportunities'));
    builder.addList(report.strategicAnalysis.opportunities, 'na');
    builder.addH4(t('threats'));
    builder.addList(report.strategicAnalysis.threats, 'na');
    
    if(report.sources && (report.sources.web.length > 0 || report.sources.maps.length > 0)) {
        builder.addH2(t('sources'));
        if (report.sources.web.length > 0) {
            builder.addH4(t('webSources'));
            report.sources.web.forEach(s => builder.addBodyText(`${s.title}: ${s.uri}`));
        }
        if (report.sources.maps.length > 0) {
            builder.addH4(t('mapSources'));
            report.sources.maps.forEach(s => builder.addBodyText(`${s.title}: ${s.uri}`));
        }
    }
    
    builder.save(`KYC-Report-${report.companySummary.name.replace(/[\s.]/g, '_')}.pdf`);
};