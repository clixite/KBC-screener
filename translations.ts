// FIX: Full implementation of translation strings for the application.
export const translations = {
  en: {
    // SearchStep
    searchTitle: 'Company Report Generator',
    searchSubtitle: 'Enter a company name to find potential matches and generate a comprehensive report.',
    searchPlaceholder: 'e.g., "Google" or "Tesla, Inc."',
    searchHint: 'The more specific the name, the better the results.',
    recentSearches: 'Recent Searches',
    clearHistory: 'Clear',

    // SelectionStep
    selectCompanyTitle: 'Select a Company',
    selectCompanySubtitle: 'We found the following companies matching your query. Please select one to proceed.',
    generateReport: 'Generate Report',
    noResults: 'No Companies Found',
    noResultsHint: 'Please try a different search term or check for typos.',
    backToSearch: 'Back to Search',

    // LoadingStep & NewLoadingStep
    generatingReport: 'Generating Your Report...',
    loadingSubtitle: 'This may take a moment. We are gathering and analyzing the latest data.',
    progress_summary: 'Analyzing company summary',
    progress_personnel: 'Identifying key personnel',
    progress_financials: 'Compiling financial highlights',
    progress_market: 'Assessing market presence',
    progress_products: 'Reviewing products and services',
    progress_swot: 'Conducting strategic analysis',
    progress_compiling: 'Compiling final report',
    
    // ReportStep
    reportTitle: 'Comprehensive Company Report',
    downloadReport: 'Download',
    newSearch: 'New Search',
    companySummary: 'Company Summary',
    registrationNumber: 'Registration No.',
    address: 'Address',
    website: 'Website',
    keyPersonnel: 'Key Personnel',
    financialHighlights: 'Financial Highlights',
    marketPresence: 'Market Presence',
    productsAndServices: 'Products and Services',
    strategicAnalysis: 'Strategic Analysis (SWOT)',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    opportunities: 'Opportunities',
    threats: 'Threats',
    sources: 'Sources',
    webSources: 'Web Sources',
    mapSources: 'Map Sources',

    // Errors
    genericError: 'An unexpected error occurred. Please try again.',
    apiKeyError: 'API key is not configured correctly. Please check your environment variables.',
    apiTimeoutError: 'The request timed out. Please check your connection and try again.',
  },
  es: {
    // SearchStep
    searchTitle: 'Generador de Informes de Empresas',
    searchSubtitle: 'Ingrese el nombre de una empresa para encontrar posibles coincidencias y generar un informe completo.',
    searchPlaceholder: 'p. ej., "Google" o "Tesla, Inc."',
    searchHint: 'Cuanto más específico sea el nombre, mejores serán los resultados.',
    recentSearches: 'Búsquedas Recientes',
    clearHistory: 'Limpiar',

    // SelectionStep
    selectCompanyTitle: 'Seleccione una Empresa',
    selectCompanySubtitle: 'Encontramos las siguientes empresas que coinciden con su búsqueda. Por favor, seleccione una para continuar.',
    generateReport: 'Generar Informe',
    noResults: 'No se Encontraron Empresas',
    noResultsHint: 'Por favor, intente con un término de búsqueda diferente o revise si hay errores de tipeo.',
    backToSearch: 'Volver a la Búsqueda',

    // LoadingStep & NewLoadingStep
    generatingReport: 'Generando su Informe...',
    loadingSubtitle: 'Esto puede tomar un momento. Estamos recopilando y analizando los datos más recientes.',
    progress_summary: 'Analizando resumen de la empresa',
    progress_personnel: 'Identificando personal clave',
    progress_financials: 'Compilando datos financieros destacados',
    progress_market: 'Evaluando presencia en el mercado',
    progress_products: 'Revisando productos y servicios',
    progress_swot: 'Realizando análisis estratégico',
    progress_compiling: 'Compilando informe final',

    // ReportStep
    reportTitle: 'Informe Empresarial Completo',
    downloadReport: 'Descargar',
    newSearch: 'Nueva Búsqueda',
    companySummary: 'Resumen de la Empresa',
    registrationNumber: 'Nº de Registro',
    address: 'Dirección',
    website: 'Sitio Web',
    keyPersonnel: 'Personal Clave',
    financialHighlights: 'Datos Financieros Destacados',
    marketPresence: 'Presencia en el Mercado',
    productsAndServices: 'Productos y Servicios',
    strategicAnalysis: 'Análisis Estratégico (FODA)',
    strengths: 'Fortalezas',
    weaknesses: 'Debilidades',
    opportunities: 'Oportunidades',
    threats: 'Amenazas',
    sources: 'Fuentes',
    webSources: 'Fuentes Web',
    mapSources: 'Fuentes de Mapas',

    // Errors
    genericError: 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
    apiKeyError: 'La clave de API no está configurada correctamente. Por favor, revise sus variables de entorno.',
    apiTimeoutError: 'La solicitud expiró. Por favor, revise su conexión e inténtelo de nuevo.',
  },
};
