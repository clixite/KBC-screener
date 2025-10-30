// services/geminiService.ts
import { GoogleGenAI, Type } from '@google/genai';
import { Company, ComprehensiveReport, ReportSources } from '../types';
import { ProgressMessage } from '../components/NewLoadingStep';

// Per coding guidelines, initialize GoogleGenAI with process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const companySearchSchema = {
    type: Type.OBJECT,
    properties: {
        companies: {
            type: Type.ARRAY,
            description: "List of companies found.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Official company name." },
                    registrationNumber: { type: Type.STRING, description: "Official business registration number, if available." },
                    address: { type: Type.STRING, description: "Full headquarters address." },
                    website: { type: Type.STRING, description: "Official company website URL." },
                    description: { type: Type.STRING, description: "A brief, one-sentence description of the company's primary business." },
                },
                required: ["name"]
            }
        }
    },
    required: ["companies"]
};

export const searchCompanies = async (query: string, location: { latitude: number; longitude: number } | null): Promise<Company[]> => {
    try {
        let prompt = `Find companies matching the query: "${query}". Provide official names, and if available, their registration number, address, website, and a brief description.`;

        if (location) {
            prompt += ` Prioritize results geographically relevant to the user's location at latitude ${location.latitude}, longitude ${location.longitude}. However, still include major international companies if they are a strong match.`;
        }

        prompt += ` If no companies are found, return an empty array.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: companySearchSchema,
            },
        });

        const jsonText = response.text?.trim();
        if (!jsonText) {
            return [];
        }
        
        const result = JSON.parse(jsonText);

        if (result && result.companies) {
            return result.companies;
        }
        return [];

    } catch (error) {
        console.error("Error searching for companies:", error);
        throw new Error('searchCompaniesError');
    }
};

const getGroundingConfig = () => ({
    tools: [{ googleSearch: {} }, { googleMaps: {} }],
});


const generateSection = async (
    prompt: string,
    onProgress: (status: ProgressMessage['status']) => void,
    isJson: boolean = false,
    defaultValue: any = null
): Promise<any> => {
    const MAX_RETRIES = 3;
    let attempt = 0;

    let fullPrompt = prompt;
    if (isJson) {
        fullPrompt += '\n\nIMPORTANT: Respond ONLY with a valid JSON object that adheres to the structure described, without any markdown formatting, comments, or extra text. If you cannot find sufficient information for any part of the request, you MUST still return a valid JSON object with empty strings, empty arrays, or appropriate default values for the corresponding keys. DO NOT return an explanation in plain text instead of the JSON.'
    }

    const config = {
        ...getGroundingConfig(),
        systemInstruction: "You are a world-class financial and compliance analyst. Your sole mission is to conduct KYC/AML due diligence with the highest level of factual accuracy, strictly adhering to EU regulations. You MUST base your answers exclusively on the verifiable public information provided in the grounded search results. Under no circumstances should you speculate, infer information not present in the sources, or provide unverified data. If reliable information is not available for a specific point, you must explicitly state that the information is 'not available' or 'could not be verified' within the requested JSON structure. Your work is subject to audit, and accuracy is paramount.",
    };
    
    while (attempt < MAX_RETRIES) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: config,
            });
            
            const text = response.text?.trim() || '';
            let data;
            if (isJson) {
                const jsonMatch = text.match(/```(json)?\n?([\s\S]*?)\n?```/);
                const stringToParse = jsonMatch && jsonMatch[2] ? jsonMatch[2].trim() : text;
                
                try {
                     data = JSON.parse(stringToParse);
                } catch (e) {
                    console.warn(`Could not parse JSON for a section. The API returned: "${text}". Using the default value instead.`, e);
                    data = defaultValue;
                    if (data === null) {
                        console.error("JSON parsing failed and no default value was provided. This section will be empty.");
                        data = {};
                    }
                }
            } else {
                data = { text };
            }
            
            const sources: ReportSources = { web: [], maps: [] };
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                for (const chunk of groundingChunks) {
                    if (chunk.web && chunk.web.uri) {
                        sources.web.push({ title: chunk.web.title || chunk.web.uri, uri: chunk.web.uri });
                    }
                    if (chunk.maps && chunk.maps.uri) {
                        sources.maps.push({ title: chunk.maps.title || 'Map View', uri: chunk.maps.uri });
                    }
                }
            }
    
            onProgress('complete');
            return { data, sources };
        } catch (error) {
            attempt++;
            console.warn(`Attempt ${attempt} failed for a report section. Retrying...`, error);
            if (attempt >= MAX_RETRIES) {
                console.error(`Error generating report section after ${MAX_RETRIES} retries:`, error);
                onProgress('error');
                // Instead of throwing, gracefully return a structure with the default data.
                const defaultData = defaultValue !== null 
                    ? defaultValue 
                    : isJson 
                        ? {} 
                        : { text: 'Information could not be retrieved due to a server error.' };
                return { 
                    data: defaultData, 
                    sources: { web: [], maps: [] } 
                };
            }
            // Exponential backoff: wait 1s, then 2s
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }

    // This part should be unreachable but serves as a fallback.
    onProgress('error');
    return {
        data: defaultValue || (isJson ? {} : { text: 'Information unavailable due to an error.' }),
        sources: { web: [], maps: [] }
    };
};

const getSectionDefinitions = (companyIdentifier: string) => [
  {
    key: 'executiveSummary',
    isJson: true,
    prompt: `Based on all available and verifiable public information for ${companyIdentifier}, generate a concise executive summary for a KYC/AML report. This summary must include an overall risk assessment ('Low', 'Medium', 'High', 'Unknown'), and a bulleted list of the 3-5 most critical findings related to AML, PEP, UBO, regulatory, or reputational risks. Respond with a JSON object with keys: "summary" (string), "overallRisk" (string: 'Low', 'Medium', 'High', or 'Unknown'), and "keyFindings" (array of strings).`,
    defaultValue: { summary: 'An executive summary could not be generated due to insufficient data.', overallRisk: 'Unknown', keyFindings: [] },
  },
  {
    key: 'companySummary',
    isJson: true,
    prompt: `Generate a detailed company summary and overview for ${companyIdentifier}, based strictly on verifiable public information. Respond with a JSON object containing a single key: "overview", which holds the detailed string summary.`,
    defaultValue: { overview: 'A detailed company overview could not be retrieved from public sources.' },
  },
  {
    key: 'keyPersonnel',
    isJson: true,
    prompt: `Identify the key personnel (CEO, CTO, CFO, etc.) for ${companyIdentifier} based on verifiable public sources. Respond with a JSON object containing a "personnel" key, which is an array of objects. Each object should have "name", "title", and "bio" keys.`,
    defaultValue: { personnel: [] },
  },
  {
    key: 'beneficialOwnership',
    isJson: true,
    prompt: `Based on verifiable public records, investigate the Ultimate Beneficial Ownership (UBO) structure for ${companyIdentifier}, as defined by EU AML directives (individuals with over 25% ownership or control). Identify these individuals and describe the overall corporate structure, including parent companies and significant subsidiaries. Respond with a JSON object with keys: "summary" (string describing the corporate and ownership structure) and "ubos" (an array of objects with "name", "ownershipPercentage", and "nationality").`,
    defaultValue: { summary: 'Information on the beneficial ownership structure could not be verified from public sources.', ubos: [] },
  },
  {
    key: 'pepScreening',
    isJson: true,
    prompt: `Conduct a thorough Politically Exposed Person (PEP) screening based on credible public sources for the key personnel and UBOs of ${companyIdentifier}, according to FATF and EU definitions. Identify direct PEPs, their family members, or close associates. Respond with a JSON object with keys: "isPEPInvolved" (boolean) and "details" (an array of objects with "name", "title", "reason" for PEP classification, and an optional "relationship" key describing the connection, e.g., "Spouse of [PEP's Name]").`,
    defaultValue: { isPEPInvolved: false, details: [] },
  },
  {
    key: 'amlRiskAssessment',
    isJson: true,
    prompt: `Conduct an Anti-Money Laundering (AML) risk assessment for ${companyIdentifier} based on verifiable public information, EU's 6th AMLD, and FATF standards. The response MUST be a JSON object.

The JSON should contain:
1. "riskLevel": An overall assessment ('Low', 'Medium', 'High', 'Unknown').
2. "summary": A justification for the overall risk level, based only on verified facts.
3. "redFlags": An array of specific red flag findings based on public data.
4. "detailedBreakdown": An object containing a breakdown of risk factors:
    a. "jurisdictionRisk": An object with "riskLevel" and a "summary" explaining the risk based on the company's operating countries and official FATF/EU high-risk lists.
    b. "industryRisk": An object with "riskLevel" and a "summary" explaining the inherent risk based on the company's specific industry sector.
    c. "sanctionsMatches": An object with "riskLevel", a "summary" stating if any matches were found on official lists, and a "matches" array. Your primary focus must be on the EU Consolidated Financial Sanctions List. Also, check other major international lists like the OFAC SDN and UN Consolidated List. Each match object must have: "name" (the matched entity), "list" (the full name of the sanctions list), and "details" (summary of why the entity is listed). If no matches are found, this array must be empty.
5. "crimeTypologies": An array of potential financial crime typologies the company could be exposed to, based on its verified industry and operations (e.g., "Trade-Based Money Laundering").
6. "mitigationStrategies": An array of actionable mitigation strategies recommended to address the identified risks and red flags.`,
    defaultValue: { 
        riskLevel: 'Unknown', 
        summary: 'An AML risk assessment could not be performed due to insufficient verifiable information.', 
        redFlags: [],
        detailedBreakdown: {
            jurisdictionRisk: { riskLevel: 'Unknown', summary: 'Analysis not performed.' },
            industryRisk: { riskLevel: 'Unknown', summary: 'Analysis not performed.' },
            sanctionsMatches: { riskLevel: 'Unknown', summary: 'Sanctions screening could not be completed.', matches: [] }
        },
        crimeTypologies: [],
        mitigationStrategies: [],
    },
  },
  {
    key: 'regulatoryCompliance',
    isJson: true,
    prompt: `Assess the regulatory and legal standing of ${companyIdentifier}, focusing on compliance within the European Union. Base the assessment on official regulatory filings and credible news sources. Look for reports of fines, sanctions, litigation, or regulatory actions from EU bodies or national authorities. Respond with a JSON object with keys: "summary" (string overview), "legalIssues" (array of strings), and "regulatoryActions" (array of strings).`,
    defaultValue: { summary: 'No verifiable information on regulatory or legal standing was found in public sources.', legalIssues: [], regulatoryActions: [] },
  },
  {
    key: 'financialHealthAnalysis',
    isJson: true,
    prompt: `Provide a financial health analysis for ${companyIdentifier} based on publicly available financial statements or credible financial data providers. Include key metrics like market capitalization, annual revenue, net income, debt-to-equity ratio, and current ratio, and provide a summary analysis for solvency, liquidity, and profitability. Respond with a simple, flat JSON object where each key is a financial metric or analysis category and the value is ALWAYS a single string.`,
    defaultValue: { status: "Financial data not publicly available or could not be retrieved." },
  },
  {
    key: 'marketPresence',
    isJson: false,
    prompt: `Describe the market presence of ${companyIdentifier} based on public information and market analysis reports. Include information on their target audience, key markets, and major competitors. Respond with plain text.`,
  },
  {
    key: 'productsAndServices',
    isJson: false,
    prompt: `List and describe the main products and services offered by ${companyIdentifier}, based on the company's official website and public documentation. Respond with plain text.`,
  },
  {
    key: 'strategicAnalysis',
    isJson: true,
    prompt: `Conduct a SWOT analysis for ${companyIdentifier}, basing each point on documented facts and market realities from verifiable sources. Respond with a JSON object with four keys: "strengths", "weaknesses", "opportunities", and "threats". Each key should hold an array of 3-5 descriptive strings.`,
    defaultValue: { strengths: ["SWOT analysis could not be performed due to insufficient data."], weaknesses: [], opportunities: [], threats: [] },
  },
  {
    key: 'reputationalRisk',
    isJson: true,
    prompt: `Analyze the reputational risk for ${companyIdentifier} by searching for adverse media. Base the analysis on a review of credible, grounded news and media sources. Focus on verified allegations related to financial crimes, bribery, corruption, fraud, or significant ESG concerns. Respond with a JSON object with keys: "summary" (string overview), "sentiment" (string: "Positive", "Neutral", "Negative", or "Mixed"), and "keyMentions" (array of strings summarizing key adverse media findings).`,
    defaultValue: { summary: 'Reputational risk analysis could not be performed due to a lack of significant media coverage.', sentiment: 'Unknown', keyMentions: [] },
  },
  {
    key: 'socialMediaPresence',
    isJson: true,
    prompt: `Analyze the social media presence of ${companyIdentifier} based on publicly accessible profiles. Identify their main platforms, and for each, provide the URL and a brief summary of their activity. Respond with a JSON object with two keys: "summary" (an overall summary) and "profiles" (an array of objects, where each object has "platform", "url", and "summary" keys).`,
    defaultValue: { summary: 'No significant social media presence was identified from public sources.', profiles: [] },
  },
  {
    key: 'certifications',
    isJson: true,
    prompt: `Research and identify all official certifications held by ${companyIdentifier} from verifiable public sources or official registries. This includes quality management (e.g., ISO 9001), environmental standards (e.g., ISO 14001), information security (e.g., ISO 27001), and other notable accreditations. Respond with a JSON object containing a "certifications" key, which is an array of objects. Each object should have "name", "issuingBody", and "description" keys.`,
    defaultValue: { certifications: [] },
  },
  {
    key: 'dueDiligenceReport',
    isJson: true,
    prompt: `Act as a senior compliance officer completing a final due diligence report for ${companyIdentifier}. Based ONLY on the verifiable public and grounded information, provide a comprehensive summary. Your response MUST be a JSON object with three keys:
1. "verificationSummary": An object confirming the company's existence. It MUST contain these keys: "companyName" (string), "legalStatus" (string, e.g., 'Active'), "registrationDetails" (string, e.g., 'Registered under number X in Y'), "regulatoryOversight" (string, summary of who regulates them), and "existenceConfirmed" (boolean, true if details were found in official registries).
2. "riskConsolidation": A consolidated summary of the most significant risks identified across all other areas (AML, PEP, Sanctions, Reputational, etc.). Synthesize these verified findings into a coherent risk profile.
3. "finalRecommendation": A concluding recommendation. Based strictly on the verified information and consolidated risks, state whether to 'Proceed with caution', 'Proceed', or 'Reject and escalate for further investigation', and provide a brief justification.`,
    defaultValue: { 
        verificationSummary: {
            companyName: 'N/A',
            legalStatus: 'Unknown',
            registrationDetails: 'Could not be verified from public sources.',
            regulatoryOversight: 'N/A',
            existenceConfirmed: false
        }, 
        riskConsolidation: 'Analysis could not be performed.', 
        finalRecommendation: 'A recommendation cannot be determined at this time.' 
    },
  },
  {
    key: 'goNoGoAssessment',
    isJson: true,
    prompt: `Act as a senior Belgian banking compliance officer for ${companyIdentifier}. Based on all previously gathered verified information (AML, PEP, Sanctions, UBO, Reputational Risk), provide a final 'Go / No-Go' assessment for onboarding this vendor. Your assessment must strictly adhere to the bare minimum AML/KYC regulations applicable to the Belgian banking sector. The response MUST be a JSON object with two keys:
1. "recommendation": A single string value from this list: 'Go', 'Go with conditions', or 'No-Go'.
2. "justification": A detailed string explaining your reasoning based on specific findings and how they relate to Belgian banking regulations.`,
    defaultValue: { recommendation: 'No-Go', justification: 'A final recommendation could not be determined due to insufficient or conflicting information.' },
  },
];

export const generateComprehensiveReport = async (
    company: Company,
    onProgressUpdate: (key: string, status: ProgressMessage['status']) => void
): Promise<ComprehensiveReport> => {
    const companyIdentifier = `${company.name}` + (company.registrationNumber ? ` (Reg: ${company.registrationNumber})` : '');
    
    const sectionDefinitions = getSectionDefinitions(companyIdentifier);

    const promises = sectionDefinitions.map(def => {
        onProgressUpdate(def.key, 'pending');
        return generateSection(
            def.prompt,
            (status) => onProgressUpdate(def.key, status),
            def.isJson,
            (def as any).defaultValue
        ).then(result => ({ ...result, key: def.key as keyof ComprehensiveReport }));
    });

    const results = await Promise.all(promises);
    
    const report: Partial<ComprehensiveReport> = {};
    const allSources: ReportSources = { web: [], maps: [] };

    const mergeSources = (newSources: ReportSources) => {
        const existingWebUris = new Set(allSources.web.map(s => s.uri));
        newSources.web.forEach(s => {
            if (s.uri && !existingWebUris.has(s.uri)) {
                allSources.web.push(s);
                existingWebUris.add(s.uri);
            }
        });
        const existingMapUris = new Set(allSources.maps.map(s => s.uri));
        newSources.maps.forEach(s => {
            if (s.uri && !existingMapUris.has(s.uri)) {
                allSources.maps.push(s);
                existingMapUris.add(s.uri);
            }
        });
    };

    results.forEach(result => {
        mergeSources(result.sources);
        switch (result.key) {
            case 'companySummary':
                report.companySummary = { ...company, ...result.data };
                break;
            case 'keyPersonnel':
                report.keyPersonnel = result.data.personnel || [];
                break;
            case 'certifications':
                report.certifications = result.data.certifications || [];
                break;
            case 'marketPresence':
            case 'productsAndServices':
                report[result.key] = result.data.text;
                break;
            default:
                (report as any)[result.key] = result.data;
        }
    });
    
    report.sources = allSources;

    return report as ComprehensiveReport;
};