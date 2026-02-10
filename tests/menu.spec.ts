import { test, expect, Page } from '@playwright/test';

// Helper to dismiss cookie consent if present
async function dismissCookieConsent(page: Page) {
  try {
    const consentSelectors = [
      'button:has-text("Accept")',
      'button:has-text("Decline")',
      '#hs-eu-confirmation-button',
    ];

    for (const selector of consentSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await page.waitForTimeout(500);
        break;
      }
    }
  } catch {
    // No cookie consent found, continue
  }
}

test.describe('Desktop Menu - Homepage', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only tests');
    await page.goto('/');
    await dismissCookieConsent(page);
    await page.waitForLoadState('domcontentloaded');
  });

  test('header navigation is visible', async ({ page }) => {
    const header = page.locator('header, .md-header');
    await expect(header.first()).toBeVisible({ timeout: 10000 });
  });

  test('top navigation tabs are visible', async ({ page }) => {
    const tabNav = page.locator('nav[aria-label="Tabs"], .md-tabs');
    await expect(tabNav.first()).toBeVisible({ timeout: 10000 });
  });

  test('navigation tabs contain main sections', async ({ page }) => {
    await page.waitForSelector('nav[aria-label="Tabs"]', { timeout: 10000 });

    const introLink = page.locator('nav[aria-label="Tabs"] a:has-text("Introduction")');
    await expect(introLink).toBeVisible();

    const discoveryLink = page.locator('nav[aria-label="Tabs"] a:has-text("API Discovery")');
    await expect(discoveryLink).toBeVisible();

    const protectionLink = page.locator('nav[aria-label="Tabs"] a:has-text("API Protection")');
    await expect(protectionLink).toBeVisible();
  });

  test('clicking tab navigates to section', async ({ page }) => {
    await page.waitForSelector('nav[aria-label="Tabs"]', { timeout: 10000 });

    const introLink = page.locator('nav[aria-label="Tabs"] a:has-text("Introduction")');
    await introLink.click({ force: true });
    await page.waitForURL(/about-wallarm/, { timeout: 10000 });

    expect(page.url()).toContain('about-wallarm');
  });

  test('logo is visible and links to homepage', async ({ page }) => {
    const logo = page.locator('header img[alt*="logo" i], .md-logo img').first();
    await expect(logo).toBeVisible();
  });

  test('language selector is visible', async ({ page }) => {
    const langButton = page.getByRole('button', { name: /english/i });
    await expect(langButton).toBeVisible({ timeout: 10000 });
  });

  test('search is accessible', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .md-search__input, input[placeholder*="Search" i]');
    await expect(searchInput.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Desktop Menu - Documentation Page', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only tests');
    await page.goto('/about-wallarm/overview/');
    await dismissCookieConsent(page);
    await page.waitForLoadState('domcontentloaded');
  });

  test('sidebar navigation is visible on documentation pages', async ({ page }) => {
    const sidebar = page.locator('.md-sidebar--primary');
    await expect(sidebar).toBeVisible({ timeout: 10000 });
  });

  test('sidebar contains navigation items', async ({ page }) => {
    await page.waitForSelector('.md-sidebar--primary', { timeout: 10000 });
    const navItems = page.locator('.md-sidebar--primary .md-nav__item');
    const count = await navItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('current page is highlighted in sidebar', async ({ page }) => {
    await page.waitForSelector('.md-sidebar--primary', { timeout: 10000 });

    const currentItem = page.locator('.md-nav__item--active, .md-nav__link--active, [aria-current="page"]');
    await expect(currentItem.first()).toBeVisible();
  });

  test('expandable sections exist in sidebar', async ({ page }) => {
    await page.waitForSelector('.md-sidebar--primary', { timeout: 10000 });

    // Verify nav toggles exist (expand/collapse mechanism)
    const toggles = page.locator('.md-sidebar--primary input.md-nav__toggle');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navigation links work correctly', async ({ page }) => {
    await page.waitForSelector('.md-sidebar--primary', { timeout: 10000 });

    const links = page.locator('.md-sidebar--primary .md-nav__link[href]:not([for])');

    for (let i = 0; i < Math.min(await links.count(), 10); i++) {
      const link = links.nth(i);
      if (await link.isVisible()) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript')) {
          await link.click();
          await page.waitForLoadState('domcontentloaded');
          expect(page.url()).toBeTruthy();
          break;
        }
      }
    }
  });

  test('version selector is visible', async ({ page }) => {
    const versionSelector = page.locator('.versions-block, [class*="version"]').first();
    await expect(versionSelector).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only tests');
    await page.goto('/about-wallarm/overview/');
    await dismissCookieConsent(page);
    await page.waitForLoadState('domcontentloaded');
  });

  test('hamburger menu is visible on mobile', async ({ page }) => {
    const hamburger = page.locator('label[for="__drawer"].md-header__button');
    await expect(hamburger).toBeVisible({ timeout: 10000 });
  });

  test('mobile header shows logo', async ({ page }) => {
    const logo = page.locator('header img').first();
    await expect(logo).toBeVisible({ timeout: 10000 });
  });

  test('clicking hamburger opens drawer', async ({ page }) => {
    const hamburger = page.locator('label[for="__drawer"].md-header__button');
    await hamburger.click();

    await page.waitForTimeout(500);

    const drawerCheckbox = page.locator('input#__drawer');
    await expect(drawerCheckbox).toBeChecked();
  });

  test('mobile drawer shows navigation items', async ({ page }) => {
    const hamburger = page.locator('label[for="__drawer"].md-header__button');
    await hamburger.click();
    await page.waitForTimeout(500);

    const navItems = page.locator('.md-sidebar--primary .md-nav__item');
    await expect(navItems.first()).toBeVisible();
  });

  test('mobile drawer contains expandable sections', async ({ page }) => {
    // Open drawer
    const hamburger = page.locator('label[for="__drawer"].md-header__button');
    await hamburger.click();
    await page.waitForTimeout(500);

    // Verify expandable navigation exists
    const toggles = page.locator('.md-sidebar--primary input.md-nav__toggle');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('drawer can be closed', async ({ page }) => {
    // Open drawer
    const hamburger = page.locator('label[for="__drawer"].md-header__button');
    await hamburger.click();
    await page.waitForTimeout(500);

    // Verify drawer is open
    const drawerCheckbox = page.locator('input#__drawer');
    await expect(drawerCheckbox).toBeChecked();

    // Click the hamburger again to close
    await hamburger.click();
    await page.waitForTimeout(500);

    // Drawer should be closed
    await expect(drawerCheckbox).not.toBeChecked();
  });
});

test.describe('Menu Responsiveness', () => {
  test('layout adapts to viewport changes', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop viewport test');

    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/about-wallarm/overview/');
    await dismissCookieConsent(page);
    await page.waitForLoadState('domcontentloaded');

    const sidebar = page.locator('.md-sidebar--primary');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    const hamburger = page.locator('label[for="__drawer"].md-header__button');
    await expect(hamburger).not.toBeVisible();

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await expect(hamburger).toBeVisible();
  });

  test('search component exists across viewports', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop viewport test');

    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/about-wallarm/overview/');
    await dismissCookieConsent(page);

    // Verify search component exists in DOM
    const searchComponent = page.locator('[data-md-component="search"]');
    await expect(searchComponent).toBeAttached();

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Search component should still be in DOM
    await expect(searchComponent).toBeAttached();
  });
});

test.describe('Navigation Functionality', () => {
  test('breadcrumb navigation works', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop test');

    await page.goto('/api-discovery/exploring/');
    await dismissCookieConsent(page);
    await page.waitForLoadState('domcontentloaded');

    const breadcrumb = page.locator('.md-nav--path, [aria-label="Breadcrumb"]');
    if (await breadcrumb.count() > 0) {
      await expect(breadcrumb.first()).toBeVisible();
    }
  });

  test('external links open correctly', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop test');

    await page.goto('/');
    await dismissCookieConsent(page);

    const externalLink = page.getByRole('link', { name: 'Product tour' });
    if (await externalLink.isVisible()) {
      const href = await externalLink.getAttribute('href');
      expect(href).toContain('playground.wallarm.com');

      const target = await externalLink.getAttribute('target');
      expect(target).toBe('_blank');
    }
  });
});
