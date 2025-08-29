export class UserFlow {
  constructor(page) {
    this.page = page;
  }

  async createUser(userData) {
    await this.page.click('a[href="/users/create"]');
    await this.page.waitForSelector('form');
    
    const nomInput = await this.page.locator('label:has-text("Nom")').locator('..').locator('input');
    await nomInput.fill(userData.nom);
    await this.page.waitForTimeout(500);
    
    const prenomInput = await this.page.locator('label:has-text("Prénom")').locator('..').locator('input');
    await prenomInput.fill(userData.prenom);
    await this.page.waitForTimeout(500);
    
    const emailInput = await this.page.locator('label:has-text("Email")').locator('..').locator('input');
    await emailInput.fill(userData.email);
    await this.page.waitForTimeout(500);
    
    const passwordInput = await this.page.locator('label:has-text("Mot de passe")').locator('..').locator('input');
    await passwordInput.fill(userData.password);
    await this.page.waitForTimeout(500);
    
    const phoneInput = await this.page.locator('label:has-text("Téléphone")').locator('..').locator('input');
    await phoneInput.fill(userData.telephone);
    await this.page.waitForTimeout(500);
    
    const typeSelect = await this.page.locator('label:has-text("Type d\'utilisateur")').locator('..').locator('select');
    await typeSelect.selectOption(userData.type);
    await this.page.waitForTimeout(500);
    
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000);
  }

  async runUserTests(step) {
    const testData = {
      admin: { nom: 'Test', prenom: 'Admin', email: 'test.admin@gai.edu.cd', password: 'admin123', telephone: '+243999000000', type: 'Admin' },
      teacher: { nom: 'Kabongo', prenom: 'Pierre', email: 'pierre.kabongo@gai.edu.cd', password: 'teacher123', telephone: '+243999123458', type: 'Enseignant' },
      parent: { nom: 'Mukendi', prenom: 'Marie', email: 'marie.mukendi@gai.edu.cd', password: 'parent123', telephone: '+243999123457', type: 'Parent' },
      student: { nom: 'Mukendi', prenom: 'Jean', email: 'jean.mukendi@gai.edu.cd', password: 'student123', telephone: '+243999123456', type: 'Élève' }
    };

    await step('Créer Admin Test', async () => {
      await this.page.click('a[href="/users"]');
      await this.createUser(testData.admin);
    });

    await step('Créer Enseignant', async () => {
      await this.page.click('a[href="/users"]');
      await this.createUser(testData.teacher);
    });

    await step('Créer Parent', async () => {
      await this.page.click('a[href="/users"]');
      await this.createUser(testData.parent);
    });

    await step('Créer Élève', async () => {
      await this.page.click('a[href="/users"]');
      await this.createUser(testData.student);
    });

    return testData;
  }
}