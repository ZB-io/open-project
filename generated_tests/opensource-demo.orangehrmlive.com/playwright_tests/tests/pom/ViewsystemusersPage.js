import { BasePage } from './BasePage.js';

/**
 * @class ViewsystemusersPage
 * @description Represents the Admin > User Management > System Users page.
 */
class ViewsystemusersPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Locators for the System Users page
    // Alternative selectors:
    // - page.getByRole('button', { name: 'Add' })
    // - page.locator('button[data-v-10d463b7]').nth(2)
    // - page.getByText('Add')
    // - page.locator('button.oxd-button').nth(2)
    this.addButton = page.getByRole('button', { name: ' Add' });
  }

  /**
   * Clicks the 'Add' button to navigate to the Add User page.
   * @returns {Promise<import('./SavesystemuserPage.js').SavesystemuserPage>} A new SavesystemuserPage instance.
   */
  async navigateToAddUserPage() {
    await this.addButton.click();
    const { SavesystemuserPage } = await import('./SavesystemuserPage.js');
    return new SavesystemuserPage(this.page);
  }
}

export { ViewsystemusersPage };