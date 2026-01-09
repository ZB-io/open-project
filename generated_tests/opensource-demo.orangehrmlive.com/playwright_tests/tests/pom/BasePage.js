/**
 * @class BasePage
 * @description Represents the base page object with common functionalities shared across all pages.
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
   * Waits for the page to be fully loaded.
   * @param {'load' | 'domcontentloaded' | 'networkidle' | 'commit'} [state='networkidle'] - The load state to wait for.
   * @returns {Promise<void>}
   */
  async waitForPageLoad(state = 'networkidle') {
    await this.page.waitForLoadState(state);
  }

  /**
   * Retrieves the title of the current page.
   * @returns {Promise<string>} The page title.
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Retrieves the URL of the current page.
   * @returns {string} The current page URL.
   */
  getPageUrl() {
    return this.page.url();
  }
}

export { BasePage };