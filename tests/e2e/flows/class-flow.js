export class ClassFlow {
  constructor(page) {
    this.page = page;
  }

  async createClass(classData, teacherId) {
    await this.page.click('a[href="/classes/create"]');
    await this.page.waitForSelector('form');
    
    const nomInput = await this.page.locator('label:has-text("Nom de la classe")').locator('..').locator('input');
    await nomInput.fill(classData.nom);
    await this.page.waitForTimeout(500);
    
    const niveauInput = await this.page.locator('label:has-text("Niveau")').locator('..').locator('input');
    await niveauInput.fill(classData.niveau);
    await this.page.waitForTimeout(500);
    
    const teacherSelect = await this.page.locator('label:has-text("Enseignant responsable")').locator('..').locator('select');
    await teacherSelect.selectOption(teacherId);
    await this.page.waitForTimeout(500);
    
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000);
  }

  async runClassTests(step, userData) {
    const classData = { nom: '6ème Primaire A', niveau: 'Primaire' };

    await step('Créer Classe', async () => {
      await this.page.click('a[href="/classes"]');
      const teacherOption = await this.page.locator(`option:has-text("${userData.teacher.prenom} ${userData.teacher.nom}")`);
      const teacherId = await teacherOption.getAttribute('value');
      await this.createClass(classData, teacherId);
    });

    return classData;
  }
}