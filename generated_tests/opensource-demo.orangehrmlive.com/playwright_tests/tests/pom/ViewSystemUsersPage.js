import { BasePage } from './BasePage.js';

/**
 * Represents the System Users page within the Admin section.
 * This page allows for viewing, adding, and managing system users.
 */
class ViewSystemUsersPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Locators for the View System Users Page
    // Selector for the 'Add' button to create a new user.
    // Optional selectors:
    // - page.getByRole('button', { name: 'Add' })
    // - page.locator('button[data-v-10d463b7]')
    // - page.getByText('Add')
    // - page.locator('#app').getByRole('button', { name: 'Add' })
    this.addButton = page.getByRole('button', { name: ' Add' });
  }

  /**
   * Clicks the 'Add' button to navigate to the user creation form.
   * @returns {Promise<import('./SaveSystemUserPage.js').SaveSystemUserPage>} An instance of the SaveSystemUserPage.
   */
  async clickAddUser() {
    await this.addButton.click();
    const { SaveSystemUserPage } = await import('./SaveSystemUserPage.js');
    return new SaveSystemUserPage(this.page);
  }
}

export { ViewSystemUsersPage };