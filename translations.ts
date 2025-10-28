import { Translations } from './types';

export const translations: Translations = {
  en: {
    // General
    language: 'Language',
    unknownCompany: 'Unknown Company',
    // SearchStep
    title: 'Company Due Diligence',
    subtitle: 'Get a comprehensive risk assessment report for any company worldwide.',
    companyNamePlaceholder: 'Enter company name...',
    searchButton: 'Search',
    searchingButton: 'Searching...',
    // SelectionStep
    selectCompanyTitle: 'Select a Company',
    regNumber: 'Reg. No.',
    selectCompanyButton: 'Generate Report',
    backToSearchButton: 'Back to Search',
    noCompaniesFound: 'No companies found. Please try a different name.',
    bestMatch: 'Best Match',
    // LoadingStep
    generatingReportTitle: 'Generating Comprehensive Report...',
    analyzingCompanyProfile: 'Analyzing company profile',
    screeningSanctionsLists: 'Screening international sanctions lists',
    checkingPEPs: 'Checking for Politically Exposed Persons (PEPs)',
    scanningAdverseMedia: 'Scanning for adverse media coverage',
    identifyingBeneficialOwners: 'Identifying ultimate beneficial owners',
    analyzingFinancials: 'Analyzing financial health and stability',
    evaluatingESG: 'Evaluating ESG performance',
    // ReportStep
    reportFor: 'Comprehensive Due Diligence Report for',
    downloadReport: 'Export to PDF',
    startOver: 'Start Over',
    companySummary: 'Company Summary',
    description: 'Description',
    registrationNumber: 'Registration Number',
    address: 'Address',
    website: 'Website',
    riskAssessment: 'Overall Risk Assessment',
    riskLevel: 'Risk Level',
    riskSummary: 'Summary',
    keyRiskFactors: 'Key Risk Factors',
    sanctionsScreening: 'Sanctions Screening',
    pepScreening: 'PEP Screening',
    adverseMedia: 'Adverse Media',
    status: 'Status',
    matchesFound: 'Matches Found',
    name: 'Name',
    list: 'List',
    reason: 'Reason',
    source: 'Source',
    role: 'Role',
    nationality: 'Nationality',
    pepStatus: 'PEP Status',
    ownershipStructure: 'Ownership & Structure',
    keyPeople: 'Key People',

    financialHealth: 'Financial Health',
    revenue: 'Revenue',
    profitability: 'Profitability',
    netIncome: 'Net Income',
    totalAssets: 'Total Assets',
    totalLiabilities: 'Total Liabilities',
    debtRatio: 'Debt Ratio',
    
    esgAnalysis: 'ESG Analysis',
    rating: 'Rating',
    environmental: 'Environmental',
    social: 'Social',
    governance: 'Governance',
    esgLeader: 'Leader',
    esgAverage: 'Average',
    esgLaggard: 'Laggard',

    certifications: 'Certifications & Licenses',
    issuingBody: 'Issuing Body',
    validUntil: 'Valid Until',
    noCertificationsFound: 'No certifications found.',
    
    sources: 'Data Sources',
    webSources: 'Web Sources',
    mapSources: 'Map Sources',
    noSourcesProvided: 'No sources provided.',

    // PDF Export Modal
    exportOptions: 'PDF Export Options',
    orientation: 'Orientation',
    portrait: 'Portrait',
    landscape: 'Landscape',
    includeSources: 'Include Data Sources',
    generatePdf: 'Generate PDF',
    cancel: 'Cancel',

    // Prompts
    findCompaniesPromptSystem: `You are an expert corporate investigator. Your task is to find companies based on a user's query.`,
    findCompaniesPromptUser: `Find companies matching the name`,
    findCompaniesPromptFormat: `Provide the results in a JSON array format, with each object containing 'id', 'name', 'registrationNumber', and 'address'. Ensure the 'id' is a unique string for each company. The response should only contain the JSON array inside a markdown code block. Example: \`\`\`json\n[{"id": "1", "name": "Google LLC", "registrationNumber": "12345", "address": "1600 Amphitheatre Parkway, Mountain View, CA"}]\n\`\`\``,
    generateReportPrompt: `
As a world-class compliance analyst conducting a high-stakes due diligence investigation for a major European bank, generate a comprehensive report for the company "{companyName}" (Registration Number: {registrationNumber}, Address: "{address}"). The accuracy, detail, and completeness of this report are of utmost importance for a critical financial decision.
The report MUST be in {language}.
Your response MUST be a single JSON object inside a markdown code block. The JSON object must strictly adhere to the 'ComprehensiveReport' TypeScript interface. **Failure to adhere to the schema and instructions will result in a rejected output.**

**CRITICAL INSTRUCTIONS:**
1.  Populate ALL fields based on publicly available, up-to-date information. Use your search capabilities extensively.
2.  If, after thorough searching, information for a specific field cannot be found, you MUST use the exact string "Not Available".
3.  Do NOT leave any field blank (""), null, or undefined. Arrays can be empty (e.g., "matches": []).

Here is a structural example demonstrating how to format the output and handle missing data:
\`\`\`json
{
  "companySummary": {
    "name": "Example Corp",
    "registrationNumber": "12345-67",
    "address": "123 Example Street, Example City, 12345",
    "website": "https://www.example.com",
    "description": "A brief but informative description of the company's primary activities and market position."
  },
  "riskAssessment": {
    "level": "Medium",
    "summary": "A concise summary explaining the overall risk level.",
    "factors": ["Identified political connections.", "Operations in high-risk jurisdictions."]
  },
  "sanctionsScreening": {
    "status": "Clear",
    "matches": []
  },
  "pepScreening": {
    "status": "Found",
    "matches": [{
      "name": "John Doe",
      "role": "Board Member",
      "nationality": "Not Available",
      "pepStatus": "Yes"
    }]
  },
  "adverseMedia": {
    "status": "Negative findings",
    "summary": "Found news articles related to labor disputes in 2022."
  },
  "ownershipStructure": {
    "summary": "The company is a subsidiary of Example Holdings Inc.",
    "keyPeople": [{
        "name": "Jane Smith",
        "role": "CEO",
        "nationality": "American",
        "pepStatus": "No"
      }]
  },
  "financialHealth": {
    "status": "Stable",
    "revenue": "Not Available",
    "profitability": "Not Available",
    "netIncome": "Not Available",
    "totalAssets": "Not Available",
    "totalLiabilities": "Not Available",
    "debtRatio": "Not Available",
    "summary": "Financial data is not publicly available for this private entity, but industry analysis suggests stable performance."
  },
  "esgAnalysis": {
    "rating": "Average",
    "summary": "The company has initiated some sustainability projects but lacks a formal, comprehensive ESG strategy.",
    "environmental": "Details on environmental impact.",
    "social": "Details on social impact.",
    "governance": "Details on governance."
  },
  "certifications": []
}
\`\`\`

Now, generate the complete report for "{companyName}". Your final output should only be the JSON object in a markdown block. Do not include any text before or after it.`
  },
  fr: {
    // General
    language: 'Langue',
    unknownCompany: 'Entreprise Inconnue',
    // SearchStep
    title: 'Diligence Raisonnable d\'Entreprise',
    subtitle: 'Obtenez un rapport complet d\'évaluation des risques pour n\'importe quelle entreprise dans le monde.',
    companyNamePlaceholder: 'Entrez le nom de l\'entreprise...',
    searchButton: 'Rechercher',
    searchingButton: 'Recherche...',
    // SelectionStep
    selectCompanyTitle: 'Sélectionnez une Entreprise',
    regNumber: 'N° d\'enreg.',
    selectCompanyButton: 'Générer le Rapport',
    backToSearchButton: 'Retour à la Recherche',
    noCompaniesFound: 'Aucune entreprise trouvée. Veuillez essayer un autre nom.',
    bestMatch: 'Meilleure Correspondance',
    // LoadingStep
    generatingReportTitle: 'Génération du rapport complet...',
    analyzingCompanyProfile: 'Analyse du profil de l\'entreprise',
    screeningSanctionsLists: 'Examen des listes de sanctions internationales',
    checkingPEPs: 'Vérification des Personnes Politiquement Exposées (PPE)',
    scanningAdverseMedia: 'Analyse de la couverture médiatique négative',
    identifyingBeneficialOwners: 'Identification des bénéficiaires effectifs ultimes',
    analyzingFinancials: 'Analyse de la santé et de la stabilité financières',
    evaluatingESG: 'Évaluation de la performance ESG',
    // ReportStep
    reportFor: 'Rapport de Diligence Raisonnable Complet pour',
    downloadReport: 'Exporter en PDF',
    startOver: 'Recommencer',
    companySummary: 'Résumé de l\'Entreprise',
    description: 'Description',
    registrationNumber: 'Numéro d\'Enregistrement',
    address: 'Adresse',
    website: 'Site Web',
    riskAssessment: 'Évaluation Globale des Risques',
    riskLevel: 'Niveau de Risque',
    riskSummary: 'Résumé',
    keyRiskFactors: 'Facteurs de Risque Clés',
    sanctionsScreening: 'Filtrage des Sanctions',
    pepScreening: 'Filtrage des PPE',
    adverseMedia: 'Médias Défavorables',
    status: 'Statut',
    matchesFound: 'Correspondances Trouvées',
    name: 'Nom',
    list: 'Liste',
    reason: 'Raison',
    source: 'Source',
    role: 'Rôle',
    nationality: 'Nationalité',
    pepStatus: 'Statut PPE',
    ownershipStructure: 'Propriété et Structure',
    keyPeople: 'Personnes Clés',
    financialHealth: 'Santé Financière',
    revenue: 'Chiffre d\'affaires',
    profitability: 'Rentabilité',
    netIncome: 'Résultat Net',
    totalAssets: 'Total des Actifs',
    totalLiabilities: 'Total des Passifs',
    debtRatio: 'Ratio d\'Endettement',
    esgAnalysis: 'Analyse ESG',
    rating: 'Évaluation',
    environmental: 'Environnemental',
    social: 'Social',
    governance: 'Gouvernance',
    esgLeader: 'Leader',
    esgAverage: 'Moyen',
    esgLaggard: 'À la traîne',
    certifications: 'Certifications et Licences',
    issuingBody: 'Organisme Émetteur',
    validUntil: 'Valide Jusqu\'au',
    noCertificationsFound: 'Aucune certification trouvée.',
    sources: 'Sources de Données',
    webSources: 'Sources Web',
    mapSources: 'Sources Cartographiques',
    noSourcesProvided: 'Aucune source fournie.',
    
    // PDF Export Modal
    exportOptions: 'Options d\'exportation PDF',
    orientation: 'Orientation',
    portrait: 'Portrait',
    landscape: 'Paysage',
    includeSources: 'Inclure les sources de données',
    generatePdf: 'Générer le PDF',
    cancel: 'Annuler',

    // Prompts
    findCompaniesPromptSystem: `Vous êtes un enquêteur d'entreprise expert. Votre tâche est de trouver des entreprises en fonction de la requête d'un utilisateur.`,
    findCompaniesPromptUser: `Trouver les entreprises correspondant au nom`,
    findCompaniesPromptFormat: `Fournissez les résultats dans un format de tableau JSON, chaque objet contenant 'id', 'name', 'registrationNumber' et 'address'. Assurez-vous que l''id' est une chaîne unique pour chaque entreprise. La réponse ne doit contenir que le tableau JSON à l'intérieur d'un bloc de code markdown. Exemple: \`\`\`json\n[{"id": "1", "name": "Google LLC", "registrationNumber": "12345", "address": "1600 Amphitheatre Parkway, Mountain View, CA"}]\n\`\`\``,
    generateReportPrompt: `
En tant qu'analyste de conformité de classe mondiale menant une enquête de diligence à haut risque pour une grande banque européenne, générez un rapport complet pour l'entreprise "{companyName}" (Numéro d'enregistrement : {registrationNumber}, Adresse : "{address}"). La précision, le détail et l'exhaustivité de ce rapport sont de la plus haute importance pour une décision financière critique.
Le rapport DOIT être en {language}.
Votre réponse DOIT être un unique objet JSON à l'intérieur d'un bloc de code markdown. L'objet JSON doit adhérer strictement à l'interface TypeScript 'ComprehensiveReport'. **Le non-respect du schéma et des instructions entraînera un résultat rejeté.**

**INSTRUCTIONS CRITIQUES :**
1.  Remplissez TOUS les champs en vous basant sur des informations publiques à jour. Utilisez vos capacités de recherche de manière extensive.
2.  Si, après une recherche approfondie, une information pour un champ spécifique ne peut être trouvée, vous DEVEZ utiliser la chaîne de caractères exacte "Non disponible".
3.  Ne laissez AUCUN champ vide (""), nul ou indéfini. Les tableaux peuvent être vides (par ex., "matches": []).

Voici un exemple structurel démontrant comment formater la sortie et gérer les données manquantes :
\`\`\`json
{
  "companySummary": {
    "name": "Example Corp",
    "registrationNumber": "12345-67",
    "address": "123 Example Street, Example City, 12345",
    "website": "https://www.example.com",
    "description": "Une description brève mais informative des activités principales et de la position sur le marché de l'entreprise."
  },
  "riskAssessment": {
    "level": "Medium",
    "summary": "Un résumé concis expliquant le niveau de risque global.",
    "factors": ["Connexions politiques identifiées.", "Opérations dans des juridictions à haut risque."]
  },
  "sanctionsScreening": {
    "status": "Clear",
    "matches": []
  },
  "pepScreening": {
    "status": "Found",
    "matches": [{
      "name": "John Doe",
      "role": "Membre du conseil",
      "nationality": "Non disponible",
      "pepStatus": "Yes"
    }]
  },
  "adverseMedia": {
    "status": "Negative findings",
    "summary": "Articles de presse trouvés concernant des conflits de travail en 2022."
  },
  "ownershipStructure": {
    "summary": "L'entreprise est une filiale de Example Holdings Inc.",
    "keyPeople": [{
        "name": "Jane Smith",
        "role": "PDG",
        "nationality": "Américaine",
        "pepStatus": "No"
      }]
  },
  "financialHealth": {
    "status": "Stable",
    "revenue": "Non disponible",
    "profitability": "Non disponible",
    "netIncome": "Non disponible",
    "totalAssets": "Non disponible",
    "totalLiabilities": "Non disponible",
    "debtRatio": "Non disponible",
    "summary": "Les données financières ne sont pas publiques pour cette entité privée, mais l'analyse du secteur suggère une performance stable."
  },
  "esgAnalysis": {
    "rating": "Average",
    "summary": "L'entreprise a lancé quelques projets de durabilité mais n'a pas de stratégie ESG formelle et complète.",
    "environmental": "Détails sur l'impact environnemental.",
    "social": "Détails sur l'impact social.",
    "governance": "Détails sur la gouvernance."
  },
  "certifications": []
}
\`\`\`

Maintenant, générez le rapport complet pour "{companyName}". Votre sortie finale ne doit contenir que l'objet JSON dans un bloc de markdown. N'incluez aucun texte avant ou après.`
  },
  nl: {
    // General
    language: 'Taal',
    unknownCompany: 'Onbekend Bedrijf',
    // SearchStep
    title: 'Bedrijfs Due Diligence',
    subtitle: 'Ontvang een uitgebreid risicobeoordelingsrapport voor elk bedrijf wereldwijd.',
    companyNamePlaceholder: 'Voer bedrijfsnaam in...',
    searchButton: 'Zoeken',
    searchingButton: 'Zoeken...',
    // SelectionStep
    selectCompanyTitle: 'Selecteer een Bedrijf',
    regNumber: 'Reg. nr.',
    selectCompanyButton: 'Rapport Genereren',
    backToSearchButton: 'Terug naar Zoeken',
    noCompaniesFound: 'Geen bedrijven gevonden. Probeer een andere naam.',
    bestMatch: 'Beste Match',
    // LoadingStep
    generatingReportTitle: 'Uitgebreid rapport genereren...',
    analyzingCompanyProfile: 'Bedrijfsprofiel analyseren',
    screeningSanctionsLists: 'Internationale sanctielijsten screenen',
    checkingPEPs: 'Controleren op politiek prominente personen (PEP\'s)',
    scanningAdverseMedia: 'Scannen op negatieve media-aandacht',
    identifyingBeneficialOwners: 'Uiteindelijke begunstigden identificeren',
    analyzingFinancials: 'Financiële gezondheid en stabiliteit analyseren',
    evaluatingESG: 'ESG-prestaties evalueren',
    // ReportStep
    reportFor: 'Uitgebreid Due Diligence Rapport voor',
    downloadReport: 'Exporteren naar PDF',
    startOver: 'Opnieuw Beginnen',
    companySummary: 'Bedrijfsoverzicht',
    description: 'Beschrijving',
    registrationNumber: 'Registratienummer',
    address: 'Adres',
    website: 'Website',
    riskAssessment: 'Algehele Risicobeoordeling',
    riskLevel: 'Risiconiveau',
    riskSummary: 'Samenvatting',
    keyRiskFactors: 'Belangrijkste Risicofactoren',
    sanctionsScreening: 'Sanctiescreening',
    pepScreening: 'PEP-screening',
    adverseMedia: 'Negatieve Media',
    status: 'Status',
    matchesFound: 'Gevonden Overeenkomsten',
    name: 'Naam',
    list: 'Lijst',
    reason: 'Reden',
    source: 'Bron',
    role: 'Rol',
    nationality: 'Nationaliteit',
    pepStatus: 'PEP-status',
    ownershipStructure: 'Eigendom & Structuur',
    keyPeople: 'Sleutelfiguren',
    financialHealth: 'Financiële Gezondheid',
    revenue: 'Omzet',
    profitability: 'Winstgevendheid',
    netIncome: 'Netto-inkomen',
    totalAssets: 'Totaal Activa',
    totalLiabilities: 'Totaal Passiva',
    debtRatio: 'Schuldratio',
    esgAnalysis: 'ESG-analyse',
    rating: 'Beoordeling',
    environmental: 'Milieu',
    social: 'Sociaal',
    governance: 'Bestuur',
    esgLeader: 'Leider',
    esgAverage: 'Gemiddeld',
    esgLaggard: 'Achterblijver',
    certifications: 'Certificeringen & Licenties',
    issuingBody: 'Uitgevende Instantie',
    validUntil: 'Geldig Tot',
    noCertificationsFound: 'Geen certificeringen gevonden.',
    sources: 'Gegevensbronnen',
    webSources: 'Webbronnen',
    mapSources: 'Kaartbronnen',
    noSourcesProvided: 'Geen bronnen verstrekt.',

    // PDF Export Modal
    exportOptions: 'PDF-exportopties',
    orientation: 'Oriëntatie',
    portrait: 'Portret',
    landscape: 'Landschap',
    includeSources: 'Gegevensbronnen opnemen',
    generatePdf: 'PDF genereren',
    cancel: 'Annuleren',

    // Prompts
    findCompaniesPromptSystem: `U bent een deskundige bedrijfsrechercheur. Uw taak is om bedrijven te vinden op basis van de zoekopdracht van een gebruiker.`,
    findCompaniesPromptUser: `Vind bedrijven die overeenkomen met de naam`,
    findCompaniesPromptFormat: `Geef de resultaten in een JSON-arrayformaat, waarbij elk object 'id', 'name', 'registrationNumber' en 'address' bevat. Zorg ervoor dat de 'id' een unieke string is for elk bedrijf. Het antwoord mag alleen de JSON-array bevatten in een markdown-codeblok. Voorbeeld: \`\`\`json\n[{"id": "1", "name": "Google LLC", "registrationNumber": "12345", "address": "1600 Amphitheatre Parkway, Mountain View, CA"}]\n\`\`\``,
    generateReportPrompt: `
Als een eersteklas compliance-analist die een hoog-risico due diligence-onderzoek uitvoert voor een grote Europese bank, genereer een uitgebreid rapport voor het bedrijf "{companyName}" (Registratienummer: {registrationNumber}, Adres: "{address}"). De nauwkeurigheid, detail en volledigheid van dit rapport zijn van het grootste belang voor een kritieke financiële beslissing.
Het rapport MOET in het {language} zijn.
Uw antwoord MOET een enkel JSON-object zijn binnen een markdown-codeblok. Het JSON-object moet strikt voldoen aan de 'ComprehensiveReport' TypeScript-interface. **Het niet naleven van het schema en de instructies leidt tot een afgekeurde uitvoer.**

**KRITIEKE INSTRUCTIES:**
1. Vul ALLE velden in op basis van openbaar beschikbare, actuele informatie. Gebruik uw zoekmogelijkheden uitgebreid.
2. Als na grondig zoeken informatie voor een specifiek veld niet kan worden gevonden, MOET u de exacte tekenreeks "Niet beschikbaar" gebruiken.
3. Laat GEEN enkel veld leeg (""), null of ongedefinieerd. Arrays kunnen leeg zijn (bijv. "matches": []).

Hier is een structureel voorbeeld dat laat zien hoe de uitvoer moet worden opgemaakt en hoe om te gaan met ontbrekende gegevens:
\`\`\`json
{
  "companySummary": {
    "name": "Example Corp",
    "registrationNumber": "12345-67",
    "address": "123 Example Street, Example City, 12345",
    "website": "https://www.example.com",
    "description": "Een korte maar informatieve beschrijving van de primaire activiteiten en marktpositie van het bedrijf."
  },
  "riskAssessment": {
    "level": "Medium",
    "summary": "Een beknopte samenvatting die het algehele risiconiveau uitlegt.",
    "factors": ["Geïdentificeerde politieke connecties.", "Activiteiten in rechtsgebieden met een hoog risico."]
  },
  "sanctionsScreening": {
    "status": "Clear",
    "matches": []
  },
  "pepScreening": {
    "status": "Found",
    "matches": [{
      "name": "John Doe",
      "role": "Bestuurslid",
      "nationality": "Niet beschikbaar",
      "pepStatus": "Yes"
    }]
  },
  "adverseMedia": {
    "status": "Negative findings",
    "summary": "Nieuwsartikelen gevonden met betrekking tot arbeidsconflicten in 2022."
  },
  "ownershipStructure": {
    "summary": "Het bedrijf is een dochteronderneming van Example Holdings Inc.",
    "keyPeople": [{
        "name": "Jane Smith",
        "role": "CEO",
        "nationality": "Amerikaans",
        "pepStatus": "No"
      }]
  },
  "financialHealth": {
    "status": "Stable",
    "revenue": "Niet beschikbaar",
    "profitability": "Niet beschikbaar",
    "netIncome": "Niet beschikbaar",
    "totalAssets": "Niet beschikbaar",
    "totalLiabilities": "Niet beschikbaar",
    "debtRatio": "Niet beschikbaar",
    "summary": "Financiële gegevens zijn niet openbaar beschikbaar voor deze particuliere entiteit, maar industrieanalyse suggereert stabiele prestaties."
  },
  "esgAnalysis": {
    "rating": "Average",
    "summary": "Het bedrijf heeft enkele duurzaamheidsprojecten gestart maar mist een formele, uitgebreide ESG-strategie.",
    "environmental": "Details over de milieueffecten.",
    "social": "Details over de sociale impact.",
    "governance": "Details over het bestuur."
  },
  "certifications": []
}
\`\`\`

Genereer nu het volledige rapport voor "{companyName}". Uw uiteindelijke uitvoer mag alleen het JSON-object in een markdown-blok bevatten. Voeg geen tekst toe voor of na het blok.`
  }
};