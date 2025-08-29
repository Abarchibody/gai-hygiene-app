import { db } from './schema';
import type { Reminder } from '../types';

// Données de test pour les rappels d'hygiène
const sampleReminders: Omit<Reminder, 'id'>[] = [
  {
    titre: 'Lavage des mains avant le repas',
    description: 'Se laver soigneusement les mains avec du savon pendant au moins 20 secondes avant de prendre le repas.',
    categorie: 'Lavage mains',
    recurrence: 'Quotidien',
    date_debut: new Date('2024-03-01'),
    heure: '11:45',
    statut: 'Actif',
    createur_id: 1, // Premier enseignant
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01')
  },
  {
    titre: 'Brossage des dents après le déjeuner',
    description: 'Brosser les dents pendant 2 minutes après le repas de midi pour maintenir une bonne hygiène bucco-dentaire.',
    categorie: 'Brossage dents',
    recurrence: 'Quotidien',
    date_debut: new Date('2024-03-01'),
    heure: '13:30',
    statut: 'Actif',
    createur_id: 2, // Deuxième enseignant
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01')
  },
  {
    titre: 'Contrôle hygiène corporelle',
    description: 'Vérification hebdomadaire de la propreté des ongles, des cheveux et des vêtements.',
    categorie: 'Hygiène corporelle',
    recurrence: 'Hebdomadaire',
    date_debut: new Date('2024-03-04'), // Lundi
    heure: '08:00',
    statut: 'Actif',
    createur_id: 3, // Troisième enseignant
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01')
  },
  {
    titre: 'Désinfection des mains - Entrée école',
    description: 'Application de gel hydroalcoolique à l\'entrée de l\'établissement chaque matin.',
    categorie: 'Lavage mains',
    recurrence: 'Quotidien',
    date_debut: new Date('2024-03-01'),
    heure: '07:30',
    statut: 'Actif',
    createur_id: 1,
    created_at: new Date('2024-03-02'),
    updated_at: new Date('2024-03-02')
  },
  {
    titre: 'Sensibilisation hygiène mensuelle',
    description: 'Séance de sensibilisation sur l\'importance de l\'hygiène personnelle et collective.',
    categorie: 'Personnalisé',
    recurrence: 'Mensuel',
    date_debut: new Date('2024-03-15'),
    heure: '14:00',
    statut: 'Actif',
    createur_id: 2,
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01')
  },
  {
    titre: 'Lavage mains après récréation',
    description: 'Rappel de se laver les mains après chaque pause récréative.',
    categorie: 'Lavage mains',
    recurrence: 'Quotidien',
    date_debut: new Date('2024-03-01'),
    heure: '10:15',
    statut: 'Inactif',
    createur_id: 3,
    created_at: new Date('2024-03-03'),
    updated_at: new Date('2024-03-10')
  }
];

export const seedReminders = async () => {
  try {
    console.log('🔔 Ajout des rappels d\'hygiène de test...');

    // Vérifier qu'il y a des enseignants
    const teachers = await db.users.where('type_utilisateur').equals('Enseignant').toArray();
    if (teachers.length === 0) {
      console.log('⚠️ Aucun enseignant trouvé, impossible d\'ajouter les rappels');
      return { reminders: 0 };
    }

    // Vider les rappels existants
    await db.reminderAssignments.clear();
    await db.reminders.clear();

    // Ajuster les créateurs selon les enseignants disponibles
    const remindersWithValidCreators = sampleReminders.map((reminder, index) => ({
      ...reminder,
      createur_id: teachers[index % teachers.length].id!
    }));

    const reminderIds = await db.reminders.bulkAdd(remindersWithValidCreators, { allKeys: true });
    console.log(`✅ ${reminderIds.length} rappels d'hygiène ajoutés`);

    return {
      reminders: reminderIds.length
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des rappels:', error);
    throw error;
  }
};