import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Dashboard page
    /**
     * @private
     * @description Admin link in the main navigation menu.
     * @type {import('@playwright/test').Locator}
     * @example
     * // page.getByRole('link', { name: 'Admin' })
     * // page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * // page.locator('a').filter({ hasText: /^Admin$/ })
     * // page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.getByRole('link', { name: 'Admin' });
  }

  /**
   * Clicks the 'Admin' link in the navigation menu to go to the User Management page.
   * @returns {Promise<import('./ViewsystemusersPage.js').ViewsystemusersPage>} A new ViewsystemusersPage instance.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewsystemusersPage } = await import('./ViewsystemusersPage.js');
    return new ViewsystemusersPage(this.page);
  }
}

export { DashboardPage };