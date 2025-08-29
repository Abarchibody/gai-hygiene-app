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

-- Table des assignations de rappels
CREATE TABLE reminder_assignments (
  id BIGSERIAL PRIMARY KEY,
  rappel_id BIGINT NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
  utilisateur_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  classe_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_assignment CHECK (
    (utilisateur_id IS NOT NULL AND classe_id IS NULL) OR
    (utilisateur_id IS NULL AND classe_id IS NOT NULL)
  )
);

-- Table des notifications
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('reminder', 'alert', 'info')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'sent', 'read', 'failed')),
  recipient_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  reminder_id BIGINT REFERENCES reminders(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Table de suivi de synchronisation
CREATE TABLE sync_status (
  id BIGSERIAL PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL UNIQUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_sync_direction VARCHAR(20) CHECK (last_sync_direction IN ('to_cloud', 'from_cloud', 'bidirectional')),
  sync_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paramètres de l'application
CREATE TABLE app_settings (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour améliorer les performances
CREATE INDEX idx_users_type ON users(type_utilisateur);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_classes_enseignant ON classes(enseignant_id);
CREATE INDEX idx_students_utilisateur ON students(utilisateur_id);
CREATE INDEX idx_students_classe ON students(classe_id);
CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_reminders_createur ON reminders(createur_id);
CREATE INDEX idx_reminder_assignments_rappel ON reminder_assignments(rappel_id);
CREATE INDEX idx_reminder_assignments_user ON reminder_assignments(utilisateur_id);
CREATE INDEX idx_reminder_assignments_class ON reminder_assignments(classe_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_at);
CREATE INDEX idx_events_responsable ON events(responsable_id);
CREATE INDEX idx_sync_status_table ON sync_status(table_name);
CREATE INDEX idx_app_settings_key ON app_settings(key);
CREATE INDEX idx_app_settings_category ON app_settings(category);

-- Politiques de sécurité RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Politique simple : accès complet pour tous les utilisateurs authentifiés
CREATE POLICY "Enable all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON classes FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON students FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON reminders FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON reminder_assignments FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON notifications FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON events FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON sync_status FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON app_settings FOR ALL USING (true);

-- Insérer les paramètres par défaut
INSERT INTO app_settings (key, value, category, description) VALUES
('theme', '"system"', 'ui', 'Thème de l''interface (light, dark, system)'),
('language', '"fr"', 'ui', 'Langue de l''interface'),
('notifications_enabled', 'true', 'notifications', 'Notifications activées'),
('sync_enabled', 'false', 'sync', 'Synchronisation cloud activée'),
('sync_interval', '5', 'sync', 'Intervalle de synchronisation en minutes'),
('auto_backup', 'true', 'backup', 'Sauvegarde automatique activée'),
('backup_frequency', '"daily"', 'backup', 'Fréquence de sauvegarde (daily, weekly, monthly)');

-- Initialiser le statut de sync pour chaque table
INSERT INTO sync_status (table_name, sync_count) VALUES
('users', 0),
('classes', 0),
('students', 0),
('reminders', 0),
('reminder_assignments', 0),
('notifications', 0),
('events', 0),
('app_settings', 0);