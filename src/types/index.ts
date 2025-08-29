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