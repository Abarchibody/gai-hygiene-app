-- Schéma Supabase pour GAI Hygiène
-- Exécuter ces commandes dans l'éditeur SQL de Supabase

-- Table des utilisateurs
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  telephone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  type_utilisateur VARCHAR(20) NOT NULL CHECK (type_utilisateur IN ('Élève', 'Parent', 'Enseignant', 'Admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des classes
CREATE TABLE classes (
  id BIGSERIAL PRIMARY KEY,
  nom_classe VARCHAR(50) NOT NULL,
  niveau VARCHAR(50) NOT NULL,
  enseignant_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des relations élève-classe-parent
CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  utilisateur_id BIGINT NOT NULL REFERENCES users(id),
  classe_id BIGINT REFERENCES classes(id),
  parent_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des rappels d'hygiène
CREATE TABLE reminders (
  id BIGSERIAL PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  description TEXT,
  categorie VARCHAR(50) NOT NULL CHECK (categorie IN ('Lavage mains', 'Brossage dents', 'Hygiène corporelle', 'Personnalisé')),
  recurrence VARCHAR(20) NOT NULL CHECK (recurrence IN ('Quotidien', 'Hebdomadaire', 'Mensuel', 'Unique')),
  date_debut DATE NOT NULL,
  heure TIME NOT NULL,
  statut VARCHAR(20) NOT NULL CHECK (statut IN ('Actif', 'Inactif', 'Terminé')),
  createur_id BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des événements de programmation
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  description TEXT,
  type_activite VARCHAR(50) NOT NULL CHECK (type_activite IN ('Sensibilisation', 'Formation', 'Contrôle', 'Activité collective', 'Personnalisé')),
  date_debut DATE NOT NULL,
  heure_debut TIME NOT NULL,
  date_fin DATE NOT NULL,
  heure_fin TIME NOT NULL,
  lieu VARCHAR(100),
  responsable_id BIGINT NOT NULL REFERENCES users(id),
  statut VARCHAR(20) NOT NULL CHECK (statut IN ('Planifié', 'En cours', 'Terminé', 'Annulé')),
  participants BIGINT[],
  classes_concernees BIGINT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour améliorer les performances
CREATE INDEX idx_users_type ON users(type_utilisateur);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_classes_enseignant ON classes(enseignant_id);
CREATE INDEX idx_students_utilisateur ON students(utilisateur_id);
CREATE INDEX idx_reminders_createur ON reminders(createur_id);
CREATE INDEX idx_events_responsable ON events(responsable_id);

-- Politiques de sécurité RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Politique simple : accès complet pour tous les utilisateurs authentifiés
CREATE POLICY "Enable all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON classes FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON students FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON reminders FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON events FOR ALL USING (true);