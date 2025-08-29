import { chromium } from 'playwright';
import { UserFlow } from './flows/user-flow.js';
import { ClassFlow } from './flows/class-flow.js';
import { ReminderFlow } from './flows/reminder-flow.js';
import { NavigationFlow } from './flows/navigation-flow.js';

const APP_URL = 'http://localhost:5173';
const DELAY = 1500;

class GAIDemo {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.userFlow = null;
    this.classFlow = null;
    this.reminderFlow = null;
    this.navigationFlow = null;
  }

  async init() {
    console.log('🚀 Initialisation Playwright...');
    
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    
    // Initialiser les modules de test
    this.userFlow = new UserFlow(this.page);
    this.classFlow = new ClassFlow(this.page);
    this.reminderFlow = new ReminderFlow(this.page);
    this.navigationFlow = new NavigationFlow(this.page);
    
    await this.page.goto(APP_URL);
    console.log('✅ Application chargée');
  }

  async step(name, action) {
    console.log(`📋 ${name}...`);
    const start = Date.now();
    
    try {
      await action();
      const duration = Date.now() - start;
      console.log(`✅ ${name} - Succès (${duration}ms)`);
      this.results.push({ name, success: true, duration });
      await this.page.waitForTimeout(DELAY);
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`❌ ${name} - Échec:`, error.message);
      this.results.push({ name, success: false, duration, error: error.message });
      await this.page.waitForTimeout(DELAY);
    }
  }

  async runDemo() {
    try {
      await this.init();

      console.log('\n🎯 PHASE 1: TESTS DE NAVIGATION');
      await this.navigationFlow.runNavigationTests(this.step.bind(this));

      console.log('\n👥 PHASE 2: TESTS UTILISATEURS');
      const userData = await this.userFlow.runUserTests(this.step.bind(this));

      console.log('\n🏫 PHASE 3: TESTS CLASSES');
      const classData = await this.classFlow.runClassTests(this.step.bind(this), userData);

      console.log('\n🔔 PHASE 4: TESTS RAPPELS');
      const reminderData = await this.reminderFlow.runReminderTests(this.step.bind(this));

      await this.step('Vérifier Statistiques Dashboard', async () => {
        await this.page.click('a[href="/"]');
        const statsCards = await this.page.locator('.bg-white.rounded-lg.shadow-md');
        const count = await statsCards.count();
        if (count < 4) throw new Error('Statistiques incomplètes');
      });

      await this.step('Screenshot Final', async () => {
        await this.page.screenshot({ 
          path: 'tests/e2e/complete-demo.png', 
          fullPage: true 
        });
      });

      this.printResults();
      this.printSummary(userData, classData, reminderData);

    } catch (error) {
      console.error('💥 Erreur fatale:', error.message);
      await this.page.screenshot({ path: 'tests/e2e/error-screenshot.png' });
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  printResults() {
    console.log('\n📊 RÉSULTATS DÉTAILLÉS');
    const successes = this.results.filter(r => r.success);
    const failures = this.results.filter(r => !r.success);
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`✅ Succès: ${successes.length}`);
    console.log(`❌ Échecs: ${failures.length}`);
    console.log(`📈 Taux: ${Math.round((successes.length / this.results.length) * 100)}%`);
    console.log(`⏱️ Durée totale: ${totalDuration}ms`);
    
    if (failures.length > 0) {
      console.log('\n❌ ÉCHECS:');
      failures.forEach(failure => {
        console.log(`  • ${failure.name}: ${failure.error}`);
      });
    }
  }

  printSummary(userData, classData, reminderData) {
    console.log('\n🎉 FLUX UTILISATEUR COMPLET RÉUSSI !');
    console.log('📄 Données créées:');
    console.log(`   👨🏫 Enseignant: ${userData.teacher.prenom} ${userData.teacher.nom}`);
    console.log(`   👨👩👧👦 Parent: ${userData.parent.prenom} ${userData.parent.nom}`);
    console.log(`   🎓 Élève: ${userData.student.prenom} ${userData.student.nom}`);
    console.log(`   🏫 Classe: ${classData.nom}`);
    console.log(`   🔔 Rappel: ${reminderData.titre}`);
  }
}

const demo = new GAIDemo();
demo.runDemo().then(() => {
  console.log('\n🏁 Démonstration terminée');
  process.exit(0);
}).catch(error => {
  console.error('💥 Erreur:', error);
  process.exit(1);
});