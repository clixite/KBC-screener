// FIX: Full implementation of the Gemini service.
import { GoogleGenAI, Type } from '@google/genai';
import { Company, ComprehensiveReport, ReportSources } from '../types';
import { ProgressMessage } from '../components/NewLoadingStep';

// FIX: Initialize the GoogleGenAI client according to guidelines.
// The API key is provided via environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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

export const searchCompanies = async (query: string): Promise<Company[]> => {
    try {
        const response = await ai.models.generateContent({
            // FIX: Use a recommended model for structured data generation.
            model: 'gemini-2.5-pro',
            contents: `Find companies matching the query: "${query}". Provide official names, and if available, their registration number, address, website, and a brief description. If no companies are found, return an empty array.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: companySearchSchema,
            },
        });

        // FIX: Extract text using the 'text' property as per guidelines.
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && result.companies) {
            return result.companies;
        }
        return [];

    } catch (error) {
        console.error("Error searching for companies:", error);
        throw new Error('Failed to search for companies. The API may be unavailable or the query may be invalid.');
    }
};

const getGroundingConfig = () => ({
    // FIX: Use Google Search and Google Maps for grounding to get up-to-date information.
    tools: [{ googleSearch: {} }, { googleMaps: {} }],
});


const generateSection = async (
    prompt: string,
    onProgress: (status: ProgressMessage['status']) => void,
    isJson: boolean = false
): Promise<any> => {
    try {
        let fullPrompt = prompt;
        // FIX: Rely on prompt engineering for JSON when using grounding tools, as responseSchema is not allowed.
        if (isJson) {
            fullPrompt += '\n\nIMPORTANT: Respond ONLY with a valid JSON object that adheres to the structure described, without any markdown formatting, comments, or extra text.'
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt,
            config: getGroundingConfig(),
        });
        
        const text = response.text.trim();
        let data;
        if (isJson) {
             try {
                 data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse JSON response:", text, e);
                const jsonMatch = text.match(/```(json)?\n?([\s\S]*?)\n?```/);
                if (jsonMatch && jsonMatch[2]) {
                    try {
                        data = JSON.parse(jsonMatch[2]);
                    } catch (e2) {
                        console.error("Failed to parse JSON from markdown block:", jsonMatch[2], e2);
                        throw new Error('Received malformed JSON from API.');
                    }
                } else {
                     throw new Error('Received malformed JSON from API.');
                }
            }
        } else {
            data = { text };
        }
        
        // FIX: Extract grounding sources to display to the user.
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
        console.error("Error generating report section:", error);
        onProgress('error');
        throw error;
    }
};

export const generateComprehensiveReport = async (
    company: Company,
    onProgressUpdate: (key: string, status: ProgressMessage['status']) => void
): Promise<ComprehensiveReport> => {

    const companyIdentifier = `${company.name}` + (company.registrationNumber ? ` (Reg: ${company.registrationNumber})` : '');
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

    onProgressUpdate('companySummary', 'pending');
    const summaryResult = await generateSection(
        `Generate a detailed company summary and overview for ${companyIdentifier}. Respond with a JSON object containing a single key: "overview", which holds the detailed string summary.`,
        (status) => onProgressUpdate('companySummary', status),
        true
    );
    report.companySummary = { ...company, ...summaryResult.data };
    mergeSources(summaryResult.sources);

    onProgressUpdate('keyPersonnel', 'pending');
    const personnelResult = await generateSection(
        `Identify the key personnel (CEO, CTO, CFO, etc.) for ${companyIdentifier}. Respond with a JSON object containing a "personnel" key, which is an array of objects. Each object should have "name", "title", and "bio" keys.`,
        (status) => onProgressUpdate('keyPersonnel', status),
        true
    );
    report.keyPersonnel = personnelResult.data.personnel || [];
    mergeSources(personnelResult.sources);

    onProgressUpdate('financialHighlights', 'pending');
    const financialsResult = await generateSection(
        `Provide key financial highlights for ${companyIdentifier}. Include metrics like market capitalization, annual revenue, and stock price if applicable. Respond with a simple JSON object where keys are the financial metric and values are strings representing the figures.`,
        (status) => onProgressUpdate('financialHighlights', status),
        true
    );
    report.financialHighlights = financialsResult.data;
    mergeSources(financialsResult.sources);

    onProgressUpdate('marketPresence', 'pending');
    const marketResult = await generateSection(
        `Describe the market presence of ${companyIdentifier}. Include information on their target audience, key markets, and major competitors. Respond with plain text.`,
        (status) => onProgressUpdate('marketPresence', status)
    );
    report.marketPresence = marketResult.data.text;
    mergeSources(marketResult.sources);

    onProgressUpdate('productsAndServices', 'pending');
    const productsResult = await generateSection(
        `List and describe the main products and services offered by ${companyIdentifier}. Respond with plain text.`,
        (status) => onProgressUpdate('productsAndServices', status)
    );
    report.productsAndServices = productsResult.data.text;
    mergeSources(productsResult.sources);

    onProgressUpdate('strategicAnalysis', 'pending');
    const swotResult = await generateSection(
        `Conduct a SWOT analysis for ${companyIdentifier}. Respond with a JSON object with four keys: "strengths", "weaknesses", "opportunities", and "threats". Each key should hold an array of 3-5 descriptive strings.`,
        (status) => onProgressUpdate('strategicAnalysis', status),
        true
    );
    report.strategicAnalysis = swotResult.data;
    mergeSources(swotResult.sources);

    onProgressUpdate('compiling', 'pending');
    report.sources = allSources;
    onProgressUpdate('compiling', 'complete');

    return report as ComprehensiveReport;
};// services/geminiService.ts

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("Missing VITE_GEMINI_API_KEY, Gemini calls will fail.");
}

// tu adaptes l’URL à ton modèle Gemini
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
  API_KEY;

type GeminiPart = {
  text: string;
};

export async function askGemini(prompt: string): Promise<string> {
  if (!API_KEY) {
    return "Gemini API key is missing on this deployment.";
  }

  const body = {
    contents: [
      {
        parts: [{ text: prompt } as GeminiPart],
      },
    ],
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Gemini error", await res.text());
    throw new Error("Gemini call failed");
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "No response from Gemini";

  return text;
}
