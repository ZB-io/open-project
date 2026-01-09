import { BasePage } from './BasePage.js';

/**
 * @class ViewSystemUsersPage
 * @description Represents the System Users page within the Admin section.
 * This page allows for viewing, searching, and adding system users.
 */
class ViewSystemUsersPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the View System Users page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Add' button to create a new user.
     * Alternative selectors:
     * - page.getByRole('button', { name: 'Add' })
     * - page.locator('button.oxd-button')
     * - page.getByText('Add')
     */
    this.addUserButton = page.getByRole('button', { name: ' Add' });
  }

  /**
   * Clicks the 'Add' button to navigate to the form for creating a new user.
   * @returns {Promise<import('./SaveSystemUserPage.js').SaveSystemUserPage>} A new instance of the SaveSystemUserPage.
   */
  async clickAddUser() {
    await this.addUserButton.click();
    const { SaveSystemUserPage } = await import('./SaveSystemUserPage.js');
    return new SaveSystemUserPage(this.page);
  }
}

export { ViewSystemUsersPage };