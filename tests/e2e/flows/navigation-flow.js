export class NavigationFlow {
  constructor(page) {
    this.page = page;
  }

  async runNavigationTests(step) {
    await step('Navigation Dashboard', async () => {
      await this.page.click('a[href="/"]');
      await this.page.waitForSelector('h1', { timeout: 5000 });
    });

    await step('Navigation Utilisateurs', async () => {
      await this.page.click('a[href="/users"]');
      await this.page.waitForSelector('h1', { timeout: 5000 });
    });

    await step('Navigation Classes', async () => {
      await this.page.click('a[href="/classes"]');
      await this.page.waitForSelector('h1', { timeout: 5000 });
    });

    await step('Navigation Rappels', async () => {
      await this.page.click('a[href="/reminders"]');
      await this.page.waitForSelector('h1', { timeout: 5000 });
    });

    await step('Navigation Notifications', async () => {
      await this.page.click('a[href="/notifications"]');
      await this.page.waitForSelector('h1', { timeout: 5000 });
    });

    await step('Navigation Administration', async () => {
      await this.page.click('a[href="/admin"]');
      await this.page.waitForSelector('h1', { timeout: 5000 });
    });

    await step('Retour Dashboard', async () => {
      await this.page.click('a[href="/"]');
      await this.page.waitForSelector('h1', { timeout: 5000 });
    });
  }
}