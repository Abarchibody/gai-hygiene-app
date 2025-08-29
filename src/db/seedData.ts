import { db } from './schema';
import type { User, Class } from '../types';

// Données de test pour les utilisateurs
const sampleUsers: Omit<User, 'id'>[] = [
  // Enseignants
  {
    nom: 'Mukendi',
    prenom: 'Jean-Pierre',
    email: 'jp.mukendi@gai-school.cd',
    telephone: '+243 81 234 5678',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15')
  },
  {
    nom: 'Kabongo',
    prenom: 'Marie-Claire',
    email: 'mc.kabongo@gai-school.cd',
    telephone: '+243 82 345 6789',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20')
  },
  {
    nom: 'Tshilanda',
    prenom: 'Paul',
    email: 'p.tshilanda@gai-school.cd',
    telephone: '+243 83 456 7890',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01')
  },

  // Parents
  {
    nom: 'Mbuyi',
    prenom: 'Françoise',
    email: 'f.mbuyi@gmail.com',
    telephone: '+243 84 567 8901',
    type_utilisateur: 'Parent',
    created_at: new Date('2024-02-10'),
    updated_at: new Date('2024-02-10')
  },
  {
    nom: 'Kasongo',
    prenom: 'Robert',
    email: 'r.kasongo@yahoo.fr',
    telephone: '+243 85 678 9012',
    type_utilisateur: 'Parent',
    created_at: new Date('2024-02-15'),
    updated_at: new Date('2024-02-15')
  },
  {
    nom: 'Ngandu',
    prenom: 'Célestine',
    email: 'c.ngandu@hotmail.com',
    telephone: '+243 86 789 0123',
    type_utilisateur: 'Parent',
    created_at: new Date('2024-02-20'),
    updated_at: new Date('2024-02-20')
  },
  {
    nom: 'Ilunga',
    prenom: 'Joseph',
    email: 'j.ilunga@gmail.com',
    telephone: '+243 87 890 1234',
    type_utilisateur: 'Parent',
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01')
  },

  // Élèves
  {
    nom: 'Mbuyi',
    prenom: 'Grace',
    email: '',
    telephone: '',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-05'),
    updated_at: new Date('2024-03-05')
  },
  {
    nom: 'Mbuyi',
    prenom: 'David',
    email: '',
    telephone: '',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-05'),
    updated_at: new Date('2024-03-05')
  },
  {
    nom: 'Kasongo',
    prenom: 'Sarah',
    email: '',
    telephone: '',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-10'),
    updated_at: new Date('2024-03-10')
  },
  {
    nom: 'Ngandu',
    prenom: 'Emmanuel',
    email: '',
    telephone: '',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-12'),
    updated_at: new Date('2024-03-12')
  },
  {
    nom: 'Ngandu',
    prenom: 'Esther',
    email: '',
    telephone: '',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-12'),
    updated_at: new Date('2024-03-12')
  },
  {
    nom: 'Ilunga',
    prenom: 'Samuel',
    email: '',
    telephone: '',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-15'),
    updated_at: new Date('2024-03-15')
  }
];

// Données de test pour les classes
const sampleClasses: Omit<Class, 'id' | 'enseignant_id'>[] = [
  {
    nom_classe: '6ème A',
    niveau: 'Secondaire',
    created_at: new Date('2024-01-25'),
    updated_at: new Date('2024-01-25')
  },
  {
    nom_classe: '5ème B',
    niveau: 'Secondaire',
    created_at: new Date('2024-01-30'),
    updated_at: new Date('2024-01-30')
  },
  {
    nom_classe: 'CP1',
    niveau: 'Primaire',
    created_at: new Date('2024-02-05'),
    updated_at: new Date('2024-02-05')
  },
  {
    nom_classe: 'CP2',
    niveau: 'Primaire',
    created_at: new Date('2024-02-08'),
    updated_at: new Date('2024-02-08')
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Début du seeding de la base de données...');

    // Vider les tables existantes
    await db.students.clear();
    await db.classes.clear();
    await db.users.clear();

    // Ajouter les utilisateurs
    const userIds = await db.users.bulkAdd(sampleUsers, { allKeys: true });
    console.log(`✅ ${userIds.length} utilisateurs ajoutés`);

    // Récupérer les IDs des enseignants pour les assigner aux classes
    const teachers = await db.users.where('type_utilisateur').equals('Enseignant').toArray();
    
    // Ajouter les classes avec enseignants assignés
    const classesWithTeachers: Omit<Class, 'id'>[] = sampleClasses.map((classe, index) => ({
      ...classe,
      enseignant_id: teachers[index % teachers.length]?.id
    }));

    const classIds = await db.classes.bulkAdd(classesWithTeachers, { allKeys: true });
    console.log(`✅ ${classIds.length} classes ajoutées`);

    // Créer les relations parent-élève et élève-classe
    const parents = await db.users.where('type_utilisateur').equals('Parent').toArray();
    const students = await db.users.where('type_utilisateur').equals('Élève').toArray();
    const classes = await db.classes.toArray();

    const studentRelations = [];

    // Relations parent-élève basées sur les noms de famille
    for (const student of students) {
      const parent = parents.find(p => p.nom === student.nom);
      const assignedClass = classes[Math.floor(Math.random() * classes.length)];
      
      studentRelations.push({
        utilisateur_id: student.id!,
        classe_id: assignedClass.id!,
        parent_id: parent?.id,
        created_at: new Date()
      });
    }

    await db.students.bulkAdd(studentRelations);
    console.log(`✅ ${studentRelations.length} relations élève-classe-parent créées`);

    console.log('🎉 Seeding terminé avec succès !');
    
    return {
      users: userIds.length,
      classes: classIds.length,
      relations: studentRelations.length
    };
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
};

export const clearDatabase = async () => {
  try {
    console.log('🗑️ Suppression de toutes les données...');
    
    await db.students.clear();
    await db.classes.clear();
    await db.users.clear();
    
    console.log('✅ Base de données vidée');
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  }
};