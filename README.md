# KYC Business Screener

An application to conduct comprehensive AML, KYC, PEP, and financial health screenings for businesses. It identifies the correct company, performs a detailed analysis using the Gemini API, and generates an exportable PDF report.

## Features

- Interactive company search with location-awareness.
- Multi-step report generation with real-time progress.
- Comprehensive analysis including:
  - Executive Summary & Overall Risk
  - AML Risk Assessment with EU standards
  - Politically Exposed Person (PEP) Screening
  - Ultimate Beneficial Ownership (UBO) investigation
  - Financial Health, Reputational Risk, and more.
- Interactive Due Diligence Checklist.
- Professional, downloadable PDF report.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Google Gemini API (`@google/genai`)

## Local Development

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd kbc-screener
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env.local` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
    Open `.env.local` and add your Google Gemini API key:
    ```
    VITE_GEMINI_API_KEY=your-gemini-api-key-here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## Deployment on Vercel

Follow these steps to deploy the application on Vercel:

1.  **Connect your Git repository** to a new Vercel project.
2.  **Configure the project settings**:
    -   **Framework Preset**: `Vite`
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
3.  **Add Environment Variables**:
    -   In the project settings on Vercel, go to "Environment Variables".
    -   Add a new variable with the name `VITE_GEMINI_API_KEY` and paste your Gemini API key as the value.
4.  **Deploy**.

> **Note**: If the `VITE_GEMINI_API_KEY` is not provided, the application will still build and run, but any attempt to search for a company will result in an error message indicating that the API key is missing.
