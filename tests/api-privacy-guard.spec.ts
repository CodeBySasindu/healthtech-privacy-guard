import { test, expect } from '@playwright/test';

// Blacklist of sensitive data keys that should never be over-fetched
const PII_BLACK_LIST = ['ssn', 'social_security', 'patient_weight', 'billing_card', 'clinical_notes'];

test('Verify FHIR API Endpoint Complies with Data Minimization Rules', async ({ page }) => {
  // 1. Hook up the background network response interceptor
  page.on('response', async (response) => {
    // Customize this path pattern to match your health app's routing API structures
    if (response.url().includes('/api/v1/appointments')) {
      const status = response.status();
      
      if (status === 200) {
        const payload = await response.json();
        
        // Flatten nested objects down to access all keys sequentially
        const payloadKeys = Object.keys(flattenObject(payload));
        
        // Check for intersection against our privacy blacklist
        const leakedKeys = payloadKeys.filter(key => PII_BLACK_LIST.includes(key.toLowerCase()));
        
        // Throw clear, diagnostic compliance errors if keys leak
        expect(leakedKeys, `CRITICAL COMPLIANCE LEAK DETECTED! Exposing unauthorized backend keys: ${leakedKeys.join(', ')}`).toHaveLength(0);
      }
    }
  });

  // 2. Instruct the browser to navigate to the target component page
  // Note: For real applications, authenticate before this step or pass cookies
  await page.goto('/dashboard/appointments/view?id=mock-992');
});

// Structural helper utility to flatten nested JSON payload properties
function flattenObject(obj: any, prefix = ''): Record {
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