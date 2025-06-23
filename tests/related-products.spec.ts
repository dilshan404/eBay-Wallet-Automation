import { test, expect } from '@playwright/test';

const PRODUCT_URL = 'https://www.ebay.com/itm/405838590558';

test('TC001 - Related section appears on wallet product page', async ({ page }) => {
  await page.goto(PRODUCT_URL);

  await page.waitForTimeout(3000); // Wait for the section to load
  const section = page.locator('section:has-text("Similar sponsored items")');

  await expect(section).toBeVisible();
});


test('TC002 - All related items belong to wallet category', async ({ page }) => {
  await page.goto(PRODUCT_URL);
  const links = await page.locator('section[aria-label*="Similar sponsored items"] a.s-item__link').elementHandles();
  for (const linkHandle of links) {
    const href = await linkHandle.getAttribute('href');
    if (href) {
      const newTab = await page.context().newPage();
      await newTab.goto(href);
      const breadcrumb = await newTab.locator('nav[aria-label="Breadcrumb"]').textContent();
      expect(breadcrumb?.toLowerCase()).toContain('wallet');
      await newTab.close();
    }
  }
});

test('TC003 - Prices of related items fall within $20 - $30 range', async ({ page }) => {
  await page.goto(PRODUCT_URL);
  const prices = await page.locator('section[aria-label*="Similar sponsored items"] span.s-item__price').allTextContents();
  for (const priceText of prices) {
    const match = priceText.match(/\$([\d,.]+)/);
    if (match) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      expect(price).toBeGreaterThanOrEqual(20);
      expect(price).toBeLessThanOrEqual(30);
    }
  }
});

test('TC004 - Only 6 or fewer related products are displayed', async ({ page }) => {
  await page.goto(PRODUCT_URL);

  const count = await page.locator('section[aria-label*="Similar sponsored items"] li.s-item').count();
  expect(count).toBeLessThanOrEqual(6);
});


test('TC009 - Related section does not show duplicate items', async ({ page }) => {
  await page.goto(PRODUCT_URL);
  const titles = await page.locator('section[aria-label*="Similar sponsored items"] h3.s-item__title').allTextContents();
  const unique = new Set(titles.map(t => t.trim().toLowerCase()));
  expect(unique.size).toBe(titles.length);
});
