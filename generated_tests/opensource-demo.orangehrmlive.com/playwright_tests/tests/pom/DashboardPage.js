import { BasePage } from './BasePage.js';

/**
 * Represents the main Dashboard Page.
 * This page is the main landing page after a successful login.
 */
class DashboardPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Locators for the Dashboard Page
    // Selector for the 'Admin' link in the main navigation menu.
    // Optional selectors:
    // - page.getByRole('link', { name: 'Admin' })
    // - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
    // - page.locator('#app').getByRole('link', { name: 'Admin' })
    // - page.locator('a').filter({ hasText: /^Admin$/ })
    this.adminLink = page.getByRole('link', { name: 'Admin' });
  }

  /**
   * Clicks the 'Admin' link in the navigation menu to go to the User Management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} An instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };