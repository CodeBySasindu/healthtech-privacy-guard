HealthTech Privacy Guard 🛡️

Automated PII and PHI leakage detection for healthcare APIs using Playwright, TypeScript, and GitHub Actions.

In healthcare systems, a passing functional test suite is not enough. If your backend APIs are over-fetching data—returning unmasked Social Security Numbers (SSNs), diagnostic codes, or clinical notes that the frontend simply hides—your platform is exposing patients to privacy risks and violating HIPAA or GDPR regulations.

This repository provides a production-ready, continuous security regression test that intercepts outgoing network requests, flattens incoming JSON data, and checks against a strict blacklist of data variables before they can leak onto a client browser.

🚀 Key Features

Network-Level Interception: Audits raw network payloads directly in the browser layer using Playwright.

Deep JSON Key Flattening: Recursively flattens deeply nested structural objects to ensure no blacklisted fields escape detection.

Custom Blacklists: Configurable monitoring rules to look for PII (Personally Identifiable Information) and PHI (Protected Health Information).

Ready-to-Use CI/CD: Native integration with GitHub Actions (.github/workflows/playwright.yml) to automatically fail Pull Requests on data-exposure events.

Written in TypeScript: Fully typed implementation offering standard linting and IDE autocomplete support out of the box.

🛠️ Local Quickstart

Prerequisites

Ensure you have Node.js (LTS version) installed on your machine.

💡 Windows PowerShell Note: If you run into script execution errors when executing npm scripts on Windows, open PowerShell as an Administrator and execute: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser.

1. Clone the Repository

git clone [https://github.com/CodeBySasindu/healthtech-privacy-guard.git](https://github.com/CodeBySasindu/healthtech-privacy-guard.git)
cd healthtech-privacy-guard


2. Install Project Dependencies

npm install


3. Install Playwright Browsers

Download the required browser engines:

npx playwright install


4. Run the Privacy Validation Suite

Execute your test suite locally:

npx playwright test


To run the tests with a visible browser UI:

npx playwright test --headed


⚙️ Configuration & Tailoring

To audit your own healthcare applications, navigate to tests/api-privacy-guard.spec.ts and modify the following sections:

1. Add Custom Blacklist Rules

Add or remove sensitive database keys from the PII_BLACK_LIST array:

const PII_BLACK_LIST = [
  'ssn',
  'social_security',
  'patient_weight',
  'billing_card',
  'clinical_notes',
  'tax_id',
  'medical_history'
];


2. Define Your Network Target Filters

Update the URL intercept path to match your target backend endpoints:

// Intercepts traffic destined to any endpoint containing this relative path
if (response.url().includes('/api/v1/appointments')) {
  // ... test assertions
}


🔗 CI/CD Pipeline Integration

This repository comes preloaded with an automated GitHub Actions integration. The workflow is configured in .github/workflows/playwright.yml.

Every time a developer pushes code or creates a Pull Request, GitHub will:

Spin up a clean Ubuntu virtual container.

Initialize dependencies using npm ci.

Install the required headless browser clients.

Execute npx playwright test.

Block mergers if any API fails compliance checks.

To integrate this check into your current active codebase, simply copy the .github/ and tests/ directories directly into your project's root folder structure.

📜 License

Distributed under the MIT License. See LICENSE for more information.