export type UserType = 'Élève' | 'Parent' | 'Enseignant';

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  type_utilisateur: UserType;
  created_at: Date;
  updated_at: Date;
}

export interface Class {
  id?: number;
  nom_classe: string;
  niveau: string;
  enseignant_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Student {
  id?: number;
  utilisateur_id: number;
  classe_id?: number;
  parent_id?: number;
  created_at: Date;
}

export type ReminderCategory = 'Lavage mains' | 'Brossage dents' | 'Hygiène corporelle' | 'Personnalisé';
export type ReminderRecurrence = 'Quotidien' | 'Hebdomadaire' | 'Mensuel' | 'Unique';
export type ReminderStatus = 'Actif' | 'Inactif' | 'Terminé';

export interface Reminder {
  id?: number;
  titre: string;
  description?: string;
  categorie: ReminderCategory;
  recurrence: ReminderRecurrence;
  date_debut: Date;
  heure: string;
  statut: ReminderStatus;
  createur_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ReminderAssignment {
  id?: number;
  rappel_id: number;
  utilisateur_id?: number;
  classe_id?: number;
  created_at: Date;
}

export type NotificationType = 'reminder' | 'alert' | 'info';
export type NotificationStatus = 'pending' | 'sent' | 'read' | 'failed';

export interface Notification {
  id?: number;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  recipient_id?: number;
  reminder_id?: number;
  scheduled_at: Date;
  sent_at?: Date;
  read_at?: Date;
  created_at: Date;
}