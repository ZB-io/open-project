import { BasePage } from './BasePage.js';

/**
 * @class ViewsystemusersPage
 * @description Represents the System Users page within the Admin section.
 */
class ViewsystemusersPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the System Users page
    /**
     * @private
     * @description The 'Add' button to create a new user.
     * @type {import('@playwright/test').Locator}
     * @example
     * // page.getByRole('button', { name: ' Add' })
     * // page.getByRole('button', { name: 'Add' })
     * // page.locator('button.oxd-button--secondary')
     * // page.getByText('Add')
     * // page.locator('xpath=//button[normalize-space()="Add"]')
     */
    this.addUserButton = page.getByRole('button', { name: ' Add' });
  }

  /**
   * Clicks the 'Add' button to navigate to the Add User form.
   * @returns {Promise<import('./SavesystemuserPage.js').SavesystemuserPage>} A new SavesystemuserPage instance.
   */
  async clickAddUser() {
    await this.addUserButton.click();
    const { SavesystemuserPage } = await import('./SavesystemuserPage.js');
    return new SavesystemuserPage(this.page);
  }
}

export { ViewsystemusersPage };