import { db } from './schema';
import type { Event } from '../types';

export const seedEvents = async () => {
  try {
    // Récupérer les enseignants et classes pour les assignations
    const teachers = await db.users.where('type_utilisateur').equals('Enseignant').toArray();
    const classes = await db.classes.toArray();

    if (teachers.length === 0 || classes.length === 0) {
      console.log('⚠️ Aucun enseignant ou classe trouvé pour créer les événements');
      return { events: 0 };
    }

    const sampleEvents: Omit<Event, 'id'>[] = [
      {
        titre: 'Séance de sensibilisation - Lavage des mains',
        description: 'Formation interactive sur les techniques de lavage des mains et leur importance pour la santé.',
        type_activite: 'Sensibilisation',
        date_debut: new Date('2024-12-20'),
        heure_debut: '08:00',
        date_fin: new Date('2024-12-20'),
        heure_fin: '09:30',
        lieu: 'Salle polyvalente',
        responsable_id: teachers[0].id!,
        statut: 'Planifié',
        classes_concernees: [classes[0].id!, classes[1].id!],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        titre: 'Contrôle hygiène corporelle',
        description: 'Inspection hebdomadaire de la propreté des élèves et sensibilisation individuelle.',
        type_activite: 'Contrôle',
        date_debut: new Date('2024-12-18'),
        heure_debut: '07:30',
        date_fin: new Date('2024-12-18'),
        heure_fin: '08:30',
        lieu: 'Cour de récréation',
        responsable_id: teachers[1].id!,
        statut: 'En cours',
        classes_concernees: classes.map(c => c.id!),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        titre: 'Formation enseignants - Hygiène scolaire',
        description: 'Session de formation pour les enseignants sur les meilleures pratiques d\'hygiène à l\'école.',
        type_activite: 'Formation',
        date_debut: new Date('2024-12-22'),
        heure_debut: '14:00',
        date_fin: new Date('2024-12-22'),
        heure_fin: '16:00',
        lieu: 'Salle des professeurs',
        responsable_id: teachers[2] ? teachers[2].id! : teachers[0].id!,
        statut: 'Planifié',
        classes_concernees: [],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        titre: 'Journée mondiale du lavage des mains',
        description: 'Activité collective pour célébrer la journée mondiale du lavage des mains avec démonstrations et jeux éducatifs.',
        type_activite: 'Activité collective',
        date_debut: new Date('2024-10-15'),
        heure_debut: '09:00',
        date_fin: new Date('2024-10-15'),
        heure_fin: '11:30',
        lieu: 'Cour principale',
        responsable_id: teachers[0].id!,
        statut: 'Terminé',
        classes_concernees: classes.map(c => c.id!),
        created_at: new Date('2024-10-01'),
        updated_at: new Date('2024-10-16')
      },
      {
        titre: 'Atelier brossage des dents',
        description: 'Atelier pratique pour apprendre aux élèves les bonnes techniques de brossage des dents.',
        type_activite: 'Formation',
        date_debut: new Date('2024-12-25'),
        heure_debut: '10:00',
        date_fin: new Date('2024-12-25'),
        heure_fin: '11:00',
        lieu: 'Salle de classe CP1',
        responsable_id: teachers[1].id!,
        statut: 'Planifié',
        classes_concernees: [classes[2].id!, classes[3].id!],
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Ajouter les événements à la base de données
    const eventIds = await db.events.bulkAdd(sampleEvents, { allKeys: true });
    
    console.log(`✅ ${eventIds.length} événements de programmation ajoutés`);
    
    return { events: eventIds.length };
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des événements:', error);
    return { events: 0 };
  }
};