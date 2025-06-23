import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    baseURL: 'https://www.ebay.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
