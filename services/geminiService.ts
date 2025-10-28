import { GoogleGenAI, Type } from '@google/genai';
import { Company, ComprehensiveReport, Language } from '../types';
import { translations } from '../translations';

// FIX: Initialize GoogleGenAI with the apiKey from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonFromMarkdown = <T>(markdown: string): T | null => {
  try {
    const jsonString = markdown.match(/```json\n([\s\S]*?)\n```/)?.[1];
    if (jsonString) {
      return JSON.parse(jsonString) as T;
    }
    return JSON.parse(markdown) as T;
  } catch (error) {
    console.error('Failed to parse JSON from markdown:', error);
    return null;
  }
};

export const findCompanies = async (companyName: string, language: Language): Promise<Company[]> => {
  const model = 'gemini-2.5-flash';
  const t = (key: string) => translations[language][key] || translations['en'][key];

  const prompt = `
    ${t('findCompaniesPromptSystem')}
    ${t('findCompaniesPromptUser')} "${companyName}".
    ${t('findCompaniesPromptFormat')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const companies = parseJsonFromMarkdown<Company[]>(response.text);
    return companies || [];

  } catch (error) {
    console.error('Error finding companies:', error);
    return [];
  }
};

export const generateComprehensiveReport = async (company: Company, language: Language): Promise<ComprehensiveReport | null> => {
  const model = 'gemini-2.5-pro';
  const t = (key: string) => translations[language][key] || translations['en'][key];
  
  const prompt = t('generateReportPrompt')
    .replace('{companyName}', company.name)
    .replace('{registrationNumber}', company.registrationNumber)
    .replace('{address}', company.address)
    .replace('{language}', language.toUpperCase());
    
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      },
    });

    const report = parseJsonFromMarkdown<ComprehensiveReport>(response.text);

    if (report) {
      const webSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(c => c.web)
        .map(c => ({ title: c.web!.title, uri: c.web!.uri })) || [];
      const mapSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(c => c.maps)
        .map(c => ({ title: c.maps!.title, uri: c.maps!.uri })) || [];
      
      report.sources = { web: webSources, maps: mapSources };
      return report;
    }

    return null;

  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    return null;
  }
};