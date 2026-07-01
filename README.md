HealthTech Privacy Guard 🛡️

Automated PII and PHI leakage detection for healthcare APIs using **Playwright**, **TypeScript**, and **GitHub Actions**.

In healthcare systems, a passing functional test suite is not enough. If your backend APIs are over fetching data, returning unmasked Social Security Numbers (SSNs), diagnostic codes, or clinical notes that the frontend simply hides, your platform is exposing patients to privacy risks and violating **HIPAA** or **GDPR** regulations.

This repository provides a production-ready, continuous security regression test that intercepts outgoing network requests, flattens incoming JSON data, and checks against a strict blacklist of data variables before they can leak onto a client browser.

---

## 🚀 Key Features

* **Network-Level Interception:** Audits raw network payloads directly in the browser layer using Playwright's \`page.route\` and \`page.waitForResponse\`.
* **Deep JSON Key Flattening:** Recursively flattens deeply nested structural objects to ensure no blacklisted fields escape detection inside nested payloads.
* **Sub-String Blacklist Matching:** Leverages advanced array checking to intercept partial matches (e.g., catching \`patient_ssn\` or \`ssn_number\` when blacklisting \`ssn\`).
* **Zero-Dependency Headless Testing:** Pre-configured with simulated routing so tests run and pass inside clean GitHub Actions runners without requiring a live database or running web server.
* **Ready-to-Use CI/CD:** Native integration with GitHub Actions (\`.github/workflows/playwright.yml\`) to automatically fail Pull Requests on data-exposure events.

---

## 🛠️ Local Quickstart

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (LTS version) installed on your machine.

> 💡 **Windows PowerShell Note:** If you run into script execution errors when executing \`npm\` scripts on Windows, open PowerShell as an Administrator and execute:
>
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### 1. Clone the Repository

Clone your target repository directly from GitHub

```bash
git clone https://github.com/CodeBySasindu/healthtech-privacy-guard.git
cd healthtech-privacy-guard
```

### 2. Install Project Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

Download the required browser engines:

```bash
npx playwright install
```

### 4. Run the Privacy Validation Suite

Execute your test suite locally:

```bash
npx playwright test
```

To run the tests with a visible browser UI:

```bash
npx playwright test --headed
```

---

## ⚙️ Configuration & Tailoring

To audit your own healthcare applications, navigate to \`tests/api-privacy-guard.spec.ts\` and customize the parameters:

### 1. Add Custom Blacklist Rules

Add or remove sensitive database keys from the \`PII_BLACK_LIST\` array:

```typescript
const PII_BLACK_LIST = [
  'ssn',
  'social_security',
  'patient_weight',
  'billing_card',
  'clinical_notes',
  'tax_id',
  'medical_history'
];
```

The matching mechanism evaluates substrings. For example, if \`'ssn'\` is blacklisted, keys like \`'patient_ssn'\`, \`'ssn_number'\`, or \`'ssn_hash'\` will be automatically caught and flagged.

### 2. Integrate with Your Active Dev/Staging Server

When you are ready to transition from mock telemetry to intercepting traffic on a live staging or production-level environment:

1. **Remove the local network mock:** Delete the \`page.route\` block in \`tests/api-privacy-guard.spec.ts\`.
2. **Update the navigation target:** Change the navigation route from \`https://example.com\` to your staging host or frontend router:

   ```typescript
   await page.goto('/dashboard/appointments/view?id=mock-992');
   ```

3. **Set your API target route:** Update your backend URL identifier inside the response checker:

   ```typescript
   if (response.url().includes('/api/v1/appointments')) { ... }
   ```

---

## 🔗 CI/CD Pipeline Integration

This repository comes preloaded with an automated **GitHub Actions** integration. The workflow is configured in \`.github/workflows/playwright.yml\`.

Every time a developer pushes code or creates a Pull Request, GitHub will:

1. Spin up a clean Ubuntu virtual container.
2. Initialize dependencies using \`npm ci\`.
3. Install the required headless browser clients.
4. Execute \`npx playwright test\`.
5. Block mergers if any API fails compliance checks.

To integrate this check into your current active codebase, simply copy the \`.github/\` and \`tests/\` directories directly into your project's root folder structure.

---

## 📜 License

Distributed under the [MIT License](LICENSE). See [LICENSE](LICENSE) for more information.
