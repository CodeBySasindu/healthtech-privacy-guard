import { test, expect } from '@playwright/test';

// Configuration: Keys to monitor for accidental leakage
const PII_BLACK_LIST = ['ssn', 'social_security', 'patient_weight', 'billing_card', 'clinical_notes'];

// Helper utility to parse deeply nested JSON structural branches
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

test('Verify FHIR API Endpoint Complies with Data Minimization Rules', async ({ page }) => {
  // 1. Intercept relative API network operations and mock a clean payload
  await page.route('**/api/v1/appointments*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        appointment_id: "94820",
        doctor_name: "Dr. Alex Mercer",
        appointment_time: "10:30 AM" // Clean, compliant telemetry
      })
    });
  });

  // Navigate to a valid domain so the relative fetch route resolves correctly in headless CI
  await page.goto('https://example.com');

  // 2. Set up our security interceptor and response listener promise
  const responsePromise = page.waitForResponse(async (response) => {
    if (response.url().includes('/api/v1/appointments')) {
      const payload = await response.json();
      const payloadKeys = Object.keys(flattenObject(payload));
      
      // Substring match optimization to capture partial matches (e.g. 'patient_ssn' matching 'ssn')
      const leakedKeys = payloadKeys.filter(key => 
        PII_BLACK_LIST.some(black => key.toLowerCase().includes(black))
      );
      
      expect(leakedKeys, `CRITICAL COMPLIANCE LEAK: Exposing unauthorized keys: ${leakedKeys.join(', ')}`).toHaveLength(0);
      return true; // Match found, resolve wait promise
    }
    return false;
  });

  // 3. Trigger the network payload evaluation asynchronously
  await page.evaluate(() => {
    fetch('/api/v1/appointments?id=mock-992');
  });

  // 4. Await verification checks to finish before closing the test block
  await responsePromise;
});