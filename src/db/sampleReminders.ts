import { db } from './schema';
import type { Reminder } from '../types';

// Données de test pour les rappels d'hygiène
const sampleReminders: Omit<Reminder, 'id'>[] = [
  {
    titre: 'Lavage des mains avant le repas',
    description: 'Se laver soigneusement les mains avec du savon pendant au moins 20 secondes avant de prendre le repas.',
    categorie: 'Lavage mains',
    recurrence: 'Quotidien',
    date_debut: new Date('2025-08-30'),
    heure: '11:45',
    statut: 'Actif',
    createur_id: 1,
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    titre: 'Brossage des dents après le déjeuner',
    description: 'Brosser les dents pendant 2 minutes après le repas de midi pour maintenir une bonne hygiène bucco-dentaire.',
    categorie: 'Brossage dents',
    recurrence: 'Quotidien',
    date_debut: new Date('2025-08-30'),
    heure: '13:30',
    statut: 'Actif',
    createur_id: 2,
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    titre: 'Contrôle hygiène corporelle',
    description: 'Vérification hebdomadaire de la propreté des ongles, des cheveux et des vêtements.',
    categorie: 'Hygiène corporelle',
    recurrence: 'Hebdomadaire',
    date_debut: new Date('2025-09-02'),
    heure: '08:00',
    statut: 'Actif',
    createur_id: 3,
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    titre: 'Désinfection des mains - Entrée école',
    description: 'Application de gel hydroalcoolique à l\'entrée de l\'établissement chaque matin.',
    categorie: 'Lavage mains',
    recurrence: 'Quotidien',
    date_debut: new Date('2025-08-30'),
    heure: '07:30',
    statut: 'Actif',
    createur_id: 1,
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    titre: 'Sensibilisation hygiène mensuelle',
    description: 'Séance de sensibilisation sur l\'importance de l\'hygiène personnelle et collective.',
    categorie: 'Personnalisé',
    recurrence: 'Mensuel',
    date_debut: new Date('2025-09-15'),
    heure: '14:00',
    statut: 'Actif',
    createur_id: 2,
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    titre: 'Lavage mains après récréation',
    description: 'Rappel de se laver les mains après chaque pause récréative.',
    categorie: 'Lavage mains',
    recurrence: 'Quotidien',
    date_debut: new Date('2025-08-30'),
    heure: '10:15',
    statut: 'Actif',
    createur_id: 3,
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    titre: 'Vérification uniforme scolaire',
    description: 'Contrôle quotidien de la propreté et de l\'état de l\'uniforme scolaire.',
    categorie: 'Hygiène corporelle',
    recurrence: 'Quotidien',
    date_debut: new Date('2025-08-30'),
    heure: '07:45',
    statut: 'Actif',
    createur_id: 4,
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    titre: 'Nettoyage des espaces de classe',
    description: 'Participation des élèves au nettoyage de leur salle de classe en fin de journée.',
    categorie: 'Personnalisé',
    recurrence: 'Quotidien',
    date_debut: new Date('2025-08-30'),
    heure: '15:30',
    statut: 'Actif',
    createur_id: 5,
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  }
];

export const seedReminders = async () => {
  try {
    console.log('🔔 Ajout des rappels d\'hygiène de test...');

    const teachers = await db.users.where('type_utilisateur').equals('Enseignant').toArray();
    if (teachers.length === 0) {
      console.log('⚠️ Aucun enseignant trouvé, impossible d\'ajouter les rappels');
      return { reminders: 0 };
    }

    await db.reminderAssignments.clear();
    await db.reminders.clear();

    const remindersWithValidCreators = sampleReminders.map((reminder, index) => ({
      ...reminder,
      createur_id: teachers[index % teachers.length].id!
    }));

    const reminderIds = await db.reminders.bulkAdd(remindersWithValidCreators, { allKeys: true });
    console.log(`✅ ${reminderIds.length} rappels d'hygiène ajoutés`);

    // Créer des assignations complètes
    const users = await db.users.toArray();
    const classes = await db.classes.toArray();
    const students = users.filter(u => u.type_utilisateur === 'Élève');
    const parents = users.filter(u => u.type_utilisateur === 'Parent');
    const assignments = [];

    // Rappel 1: Lavage mains avant repas - TOUS les élèves
    if (reminderIds.length > 0) {
      for (const student of students) {
        assignments.push({
          rappel_id: reminderIds[0] as number,
          utilisateur_id: student.id!,
          created_at: new Date()
        });
      }
    }

    // Rappel 2: Brossage dents - TOUTES les classes
    if (reminderIds.length > 1) {
      for (const classe of classes) {
        assignments.push({
          rappel_id: reminderIds[1] as number,
          classe_id: classe.id!,
          created_at: new Date()
        });
      }
    }

    // Rappel 3: Hygiène corporelle - Classes primaires + parents
    if (reminderIds.length > 2) {
      const primaryClasses = classes.filter(c => c.niveau === 'Primaire');
      for (const classe of primaryClasses) {
        assignments.push({
          rappel_id: reminderIds[2] as number,
          classe_id: classe.id!,
          created_at: new Date()
        });
      }
      for (const parent of parents.slice(0, 5)) {
        assignments.push({
          rappel_id: reminderIds[2] as number,
          utilisateur_id: parent.id!,
          created_at: new Date()
        });
      }
    }

    // Rappel 4: Désinfection entrée - Classes secondaires + élèves spécifiques
    if (reminderIds.length > 3) {
      const secondaryClasses = classes.filter(c => c.niveau === 'Secondaire');
      for (const classe of secondaryClasses) {
        assignments.push({
          rappel_id: reminderIds[3] as number,
          classe_id: classe.id!,
          created_at: new Date()
        });
      }
      // Grace et autres élèves spécifiques
      const specificStudents = students.filter(s => 
        s.email?.includes('grace.mbuyi') || 
        s.email?.includes('david.mbuyi') ||
        s.email?.includes('sarah.kasongo')
      );
      for (const student of specificStudents) {
        assignments.push({
          rappel_id: reminderIds[3] as number,
          utilisateur_id: student.id!,
          created_at: new Date()
        });
      }
    }

    // Rappel 5: Sensibilisation - Tous les parents + enseignants
    if (reminderIds.length > 4) {
      const allTeachers = users.filter(u => u.type_utilisateur === 'Enseignant');
      for (const parent of parents) {
        assignments.push({
          rappel_id: reminderIds[4] as number,
          utilisateur_id: parent.id!,
          created_at: new Date()
        });
      }
      for (const teacher of allTeachers) {
        assignments.push({
          rappel_id: reminderIds[4] as number,
          utilisateur_id: teacher.id!,
          created_at: new Date()
        });
      }
    }

    // Rappel 6: Lavage après récréation - Élèves aléatoires
    if (reminderIds.length > 5) {
      for (const student of students.slice(0, 10)) {
        assignments.push({
          rappel_id: reminderIds[5] as number,
          utilisateur_id: student.id!,
          created_at: new Date()
        });
      }
    }

    // Rappel 7: Uniforme - Toutes les classes
    if (reminderIds.length > 6) {
      for (const classe of classes) {
        assignments.push({
          rappel_id: reminderIds[6] as number,
          classe_id: classe.id!,
          created_at: new Date()
        });
      }
    }

    // Rappel 8: Nettoyage classe - Classes spécifiques
    if (reminderIds.length > 7) {
      for (const classe of classes.slice(0, 4)) {
        assignments.push({
          rappel_id: reminderIds[7] as number,
          classe_id: classe.id!,
          created_at: new Date()
        });
      }
    }

    if (assignments.length > 0) {
      await db.reminderAssignments.bulkAdd(assignments);
      console.log(`✅ ${assignments.length} assignations de rappels créées`);
    }

    return {
      reminders: reminderIds.length,
      assignments: assignments.length
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des rappels:', error);
    throw error;
  }
};