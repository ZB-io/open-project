import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 * It provides access to the main navigation elements, such as the Admin panel.
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
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Admin' link in the main navigation menu.
     * Alternative selectors:
     * - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * - page.locator('a').filter({ hasText: /^Admin$/ })
     * - page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.locator('xpath=//a[.//span[text()="Admin"]]');
  }

  /**
   * Clicks the 'Admin' link to navigate to the user management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} A new instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };