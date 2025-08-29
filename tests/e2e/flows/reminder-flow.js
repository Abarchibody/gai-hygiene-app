export class ReminderFlow {
  constructor(page) {
    this.page = page;
  }

  async createReminder(reminderData) {
    await this.page.click('a[href="/reminders/create"]');
    await this.page.waitForSelector('form');
    
    const titreInput = await this.page.locator('label:has-text("Titre")').locator('..').locator('input');
    await titreInput.fill(reminderData.titre);
    await this.page.waitForTimeout(500);
    
    const descInput = await this.page.locator('label:has-text("Description")').locator('..').locator('textarea');
    await descInput.fill(reminderData.description);
    await this.page.waitForTimeout(500);
    
    const catSelect = await this.page.locator('label:has-text("Catégorie")').locator('..').locator('select');
    await catSelect.selectOption(reminderData.categorie);
    await this.page.waitForTimeout(500);
    
    const recSelect = await this.page.locator('label:has-text("Récurrence")').locator('..').locator('select');
    await recSelect.selectOption(reminderData.recurrence);
    await this.page.waitForTimeout(500);
    
    const heureInput = await this.page.locator('label:has-text("Heure")').locator('..').locator('input');
    await heureInput.fill(reminderData.heure);
    await this.page.waitForTimeout(500);
    
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000);
  }

  async runReminderTests(step) {
    const reminderData = {
      titre: 'Lavage des mains avant le repas',
      description: 'Se laver les mains avec du savon pendant 20 secondes',
      categorie: 'Lavage mains',
      recurrence: 'Quotidien',
      heure: '11:30'
    };

    await step('Créer Rappel d\'Hygiène', async () => {
      await this.page.click('a[href="/reminders"]');
      await this.createReminder(reminderData);
    });

    return reminderData;
  }
}