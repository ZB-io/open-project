import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main dashboard page after a user logs in.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Locators for the Dashboard page
    // Alternative selectors:
    // - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
    // - page.locator('#app').getByRole('link', { name: 'Admin' })
    // - page.locator('a').filter({ hasText: /^Admin$/ })
    // - page.locator('xpath=html/body/div/div[1]/div[1]/aside/nav/div[2]/ul/li[1]/a')
    this.adminLink = page.getByRole('link', { name: 'Admin' });
  }

  /**
   * Navigates to the Admin User Management page.
   * @returns {Promise<import('./ViewsystemusersPage.js').ViewsystemusersPage>} A new ViewsystemusersPage instance.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewsystemusersPage } = await import('./ViewsystemusersPage.js');
    return new ViewsystemusersPage(this.page);
  }
}

export { DashboardPage };