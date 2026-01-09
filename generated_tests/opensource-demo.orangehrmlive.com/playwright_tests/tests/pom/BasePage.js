/**
 * @class BasePage
 * @description Represents the base page object with common functionalities shared across all pages.
 * It provides methods for navigation, waiting for page loads, and retrieving page titles.
 */
class BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to the specified URL.
   * @param {string} url - The URL to navigate to.
   * @returns {Promise<void>}
   */
  async navigate(url) {
    await this.page.goto(url);
  }

  /**
   * Waits for the page to be in the 'networkidle' state.
   * This is useful to ensure all dynamic content has loaded.
   * @returns {Promise<void>}
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Retrieves the title of the current page.
   * @returns {Promise<string>} The page title.
   */
  async getPageTitle() {
    return await this.page.title();
  }
}

export { BasePage };