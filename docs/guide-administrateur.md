# Guide Administrateur - Application GAI Rappels d'Hygiène

## Table des Matières
1. [Vue d'Ensemble](#vue-densemble)
2. [Gestion des Utilisateurs](#gestion-des-utilisateurs)
3. [Administration de la Base de Données](#administration-de-la-base-de-données)
4. [Système de Sauvegarde](#système-de-sauvegarde)
5. [Synchronisation Cloud](#synchronisation-cloud)
6. [Monitoring et Maintenance](#monitoring-et-maintenance)
7. [Sécurité et Permissions](#sécurité-et-permissions)

---

## Vue d'Ensemble

En tant qu'administrateur de l'Application GAI Rappels d'Hygiène, vous disposez d'un accès complet à toutes les fonctionnalités du système hybride offline-first. Ce guide détaille vos responsabilités et les outils à votre disposition.

### Responsabilités Principales
- Gestion complète des comptes utilisateurs
- Administration de la base de données hybride (IndexedDB + Supabase)
- Configuration des sauvegardes automatiques
- Monitoring des performances système et synchronisation
- Maintenance et mises à jour
- Support utilisateur de niveau 2
- Gestion de la synchronisation offline/online

### Accès Administrateur
- **Email** : `admin@gai.cd`
- **Mot de passe** : `admin`
- **Permissions** : Accès complet (canAccessAdmin: true)

---

## Gestion des Utilisateurs

### Création d'Utilisateurs

#### Processus Standard
1. **Navigation** : Accédez à Utilisateurs > Nouvel utilisateur
2. **Informations obligatoires** :
   - Nom et prénom
   - Email (unique dans le système)
   - Type d'utilisateur (Élève, Parent, Enseignant)
3. **Informations optionnelles** :
   - Numéro de téléphone
   - Mot de passe personnalisé (sinon généré automatiquement)

#### Types d'Utilisateurs et Permissions

**Élève (Student)**
```typescript
permissions: {
  canViewUsers: false,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canViewClasses: false,
  canManageClasses: false,
  canCreateReminders: false,
  canViewReports: false,
  canViewEvents: false,
  canCreateEvents: false,
  canAccessAdmin: false
}
```

**Parent**
```typescript
permissions: {
  canViewUsers: false,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canViewClasses: false,
  canManageClasses: false,
  canCreateReminders: false,
  canViewReports: false,
  canViewEvents: false,
  canCreateEvents: false,
  canAccessAdmin: false
}
```

**Enseignant (Teacher)**
```typescript
permissions: {
  canViewUsers: true,
  canCreateUsers: true,
  canEditUsers: true,
  canDeleteUsers: false,
  canViewClasses: true,
  canManageClasses: true,
  canCreateReminders: true,
  canViewReports: true,
  canViewEvents: true,
  canCreateEvents: true,
  canAccessAdmin: false
}
```

**Administrateur**
```typescript
permissions: {
  canViewUsers: true,
  canCreateUsers: true,
  canEditUsers: true,
  canDeleteUsers: true,
  canViewClasses: true,
  canManageClasses: true,
  canCreateReminders: true,
  canViewReports: true,
  canViewEvents: true,
  canCreateEvents: true,
  canAccessAdmin: true
}
```

### Gestion des Relations Parent-Élève

#### Assignation Automatique
- Lors de la création d'un élève, le système propose d'assigner un parent
- Recherche par nom/email dans la liste des parents existants
- Création automatique de la relation dans la table `students`

#### Modification des Relations
1. Accédez au profil de l'élève
2. Cliquez sur "Assigner un parent"
3. Sélectionnez le nouveau parent dans la liste
4. Confirmez la modification

### Réinitialisation de Mots de Passe

#### Processus Sécurisé
1. Accédez au profil utilisateur
2. Cliquez sur "Changer le mot de passe"
3. Générez un nouveau mot de passe temporaire
4. Communiquez-le à l'utilisateur de manière sécurisée
5. Demandez à l'utilisateur de le changer lors de sa prochaine connexion

---

## Administration de la Base de Données

### Interface d'Administration

Accédez via **Administration > Base de données** pour :

#### Gestionnaire de Données (DataManager)
- **Export complet** : Téléchargement de toutes les données en JSON (IndexedDB + Supabase)
- **Import de données** : Import vers IndexedDB et synchronisation Supabase
- **Validation** : Vérification de l'intégrité des données importées
- **Statistiques** : Vue d'ensemble des données locales et cloud

#### Statut Système (SystemStatus)
- **Statut IndexedDB** : État du stockage local
- **Connexion Supabase** : État de la connexion cloud
- **Synchronisation** : Statut des opérations en attente
- **Performance** : Temps de réponse local vs cloud
- **Intégrité** : Vérification des relations entre tables
- **Santé générale** : Indicateurs offline-first + cloud sync

### Structure de la Base de Données Supabase

#### Tables Principales (PostgreSQL)
```sql
-- Utilisateurs
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR NOT NULL,
  prenom VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  telephone VARCHAR,
  password VARCHAR NOT NULL,
  type_utilisateur VARCHAR CHECK (type_utilisateur IN ('Élève', 'Parent', 'Enseignant', 'Admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Classes
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  nom_classe VARCHAR NOT NULL,
  niveau VARCHAR NOT NULL,
  enseignant_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Relations élève-classe-parent
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  utilisateur_id INTEGER REFERENCES users(id),
  classe_id INTEGER REFERENCES classes(id),
  parent_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rappels d'hygiène
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  titre VARCHAR NOT NULL,
  description TEXT,
  categorie VARCHAR CHECK (categorie IN ('Lavage mains', 'Brossage dents', 'Hygiène corporelle', 'Personnalisé')),
  recurrence VARCHAR CHECK (recurrence IN ('Quotidien', 'Hebdomadaire', 'Mensuel', 'Unique')),
  date_debut DATE NOT NULL,
  heure TIME NOT NULL,
  statut VARCHAR CHECK (statut IN ('Actif', 'Inactif', 'Terminé')),
  createur_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Assignations de rappels
CREATE TABLE reminder_assignments (
  id SERIAL PRIMARY KEY,
  rappel_id INTEGER REFERENCES reminders(id),
  utilisateur_id INTEGER REFERENCES users(id),
  classe_id INTEGER REFERENCES classes(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR DEFAULT 'reminder',
  status VARCHAR DEFAULT 'pending',
  recipient_id INTEGER REFERENCES users(id),
  reminder_id INTEGER REFERENCES reminders(id),
  scheduled_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Maintenance de la Base de Données Hybride

#### Nettoyage Périodique
- **Notifications anciennes** : Suppression automatique IndexedDB + Supabase
- **Opérations en attente** : Nettoyage des opérations synchronisées
- **Cache local** : Optimisation de l'espace IndexedDB
- **Logs système** : Gestion via Supabase Dashboard

#### Optimisation des Performances
- **IndexedDB** : Optimisation des index locaux
- **Supabase** : Optimisation des requêtes PostgreSQL
- **Synchronisation** : Gestion intelligente des conflits
- **Cache hybride** : Stratégie offline-first optimisée

---

## Système de Sauvegarde

### Configuration des Sauvegardes Automatiques

#### Interface BackupManager
Accédez via **Administration > Base de données > Gestionnaire de Sauvegarde**

#### Options de Planification
- **Quotidienne** : Sauvegarde chaque jour à 2h00
- **Hebdomadaire** : Sauvegarde chaque dimanche à 3h00
- **Mensuelle** : Sauvegarde le 1er de chaque mois à 4h00

#### Configuration Avancée
```typescript
backupConfig: {
  frequency: 'daily' | 'weekly' | 'monthly'
  maxBackups: number // Nombre maximum de sauvegardes à conserver
  compressionEnabled: boolean
  includeUserData: boolean
  includeSystemLogs: boolean
}
```

### Gestion du Stockage

#### Surveillance de l'Espace
- **Quota disponible** : Vérification de l'espace localStorage
- **Utilisation actuelle** : Taille des sauvegardes existantes
- **Alertes** : Notifications quand l'espace devient critique

#### Rotation Automatique
- Suppression des sauvegardes les plus anciennes
- Conservation des sauvegardes importantes (mensuelle)
- Optimisation de l'espace de stockage

### Restauration de Données

#### Processus de Restauration
1. **Sélection** : Choisir la sauvegarde à restaurer
2. **Validation** : Vérification de l'intégrité du fichier
3. **Confirmation** : Avertissement sur la perte des données actuelles
4. **Restauration** : Remplacement des données existantes
5. **Redémarrage** : Rechargement de l'application

#### Sauvegardes d'Urgence
- Création automatique avant toute restauration
- Possibilité d'annuler une restauration récente
- Conservation des sauvegardes critiques

---

## Synchronisation Cloud

### Architecture Hybride Offline-First

#### Configuration Automatique
L'application utilise automatiquement :
- **IndexedDB** : Stockage local principal (offline-first)
- **Supabase** : Synchronisation cloud automatique
- **File d'attente** : Opérations en attente de synchronisation

#### Paramètres de Connexion
```typescript
offlineConfig: {
  indexedDBEnabled: true,
  supabaseURL: string,
  supabaseKey: string,
  syncInterval: number, // Intervalle de synchronisation
  offlineMode: boolean // Mode hors ligne forcé
}
```

#### Processus de Synchronisation
1. **Opérations locales** : Toujours exécutées en premier
2. **File d'attente** : Opérations mises en queue si hors ligne
3. **Synchronisation auto** : Dès que la connexion est rétablie
4. **Résolution conflits** : Priorité aux données locales

### Gestion Offline-First

#### Stratégies de Fonctionnement
- **Offline-First** : Toutes les opérations fonctionnent hors ligne
- **Synchronisation transparente** : Sync automatique en arrière-plan
- **File d'attente intelligente** : Opérations mises en queue automatiquement
- **Résilience** : Aucune interruption de service

#### Monitoring de la Synchronisation
- **Indicateur de statut** : En ligne/Hors ligne dans l'interface
- **Opérations en attente** : Nombre d'opérations à synchroniser
- **Historique des syncs** : Log des synchronisations réussies/échouées
- **Métriques hybrides** : Performance locale vs cloud

### Sécurité Cloud

#### Chiffrement des Données
- **Transit** : HTTPS/TLS pour toutes les communications
- **Stockage** : Chiffrement au niveau de Supabase
- **Authentification** : JWT tokens sécurisés

#### Contrôle d'Accès
- **Row Level Security** : Politiques de sécurité au niveau ligne
- **Permissions granulaires** : Contrôle fin des accès
- **Audit trail** : Traçabilité de toutes les modifications

---

## Monitoring et Maintenance

### Surveillance Système

#### Métriques Clés
- **Performance** : Temps de réponse des requêtes
- **Utilisation** : Espace de stockage occupé
- **Erreurs** : Taux d'erreur et types d'exceptions
- **Utilisateurs** : Nombre d'utilisateurs actifs

#### Alertes Automatiques
- **Espace critique** : < 10% d'espace libre
- **Erreurs fréquentes** : > 5% de taux d'erreur
- **Synchronisation échouée** : Échec de sync cloud
- **Sauvegarde manquée** : Échec de sauvegarde automatique

### Maintenance Préventive

#### Tâches Quotidiennes
- Vérification des sauvegardes automatiques
- Contrôle de l'espace de stockage
- Surveillance des erreurs système
- Validation de la synchronisation cloud

#### Tâches Hebdomadaires
- Nettoyage des données temporaires
- Optimisation des performances
- Mise à jour des statistiques
- Vérification de l'intégrité des données

#### Tâches Mensuelles
- Analyse des tendances d'utilisation
- Planification des mises à jour
- Révision des permissions utilisateurs
- Audit de sécurité

### Résolution de Problèmes

#### Problèmes Courants

**Lenteur de l'Application**
```bash
# Diagnostic
1. Vérifier l'utilisation IndexedDB
2. Analyser les opérations en attente
3. Nettoyer le cache navigateur
4. Optimiser les index locaux et cloud

# Solutions
- Nettoyage des données anciennes (local + cloud)
- Optimisation des requêtes hybrides
- Synchronisation manuelle forcée
- Mise à jour du navigateur
```

**Échec de Synchronisation**
```bash
# Diagnostic
1. Vérifier la connectivité internet
2. Contrôler les paramètres Supabase
3. Analyser la file d'attente des opérations
4. Vérifier l'intégrité IndexedDB

# Solutions
- Les opérations continuent hors ligne
- Synchronisation automatique au retour en ligne
- Nettoyage de la file d'attente si nécessaire
- Réinitialisation IndexedDB en dernier recours
```

**Corruption de Données**
```bash
# Diagnostic
1. Vérifier l'intégrité des relations
2. Analyser les logs d'erreur
3. Contrôler les sauvegardes récentes
4. Identifier la source de corruption

# Solutions
- Restauration depuis sauvegarde
- Réparation manuelle des données
- Resynchronisation cloud
```

---

## Sécurité et Permissions

### Gestion des Accès

#### Principe de Moindre Privilège
- Chaque utilisateur n'a accès qu'aux données nécessaires
- Permissions granulaires par fonctionnalité
- Révision périodique des droits d'accès

#### Audit des Permissions
```typescript
// Vérification des permissions utilisateur
const auditUserPermissions = (userId: number) => {
  // Contrôle des accès effectifs
  // Comparaison avec les permissions théoriques
  // Détection des anomalies
  // Génération de rapport d'audit
}
```

### Protection des Données

#### Données Sensibles
- **Mots de passe** : Hachage sécurisé (bcrypt)
- **Informations personnelles** : Chiffrement local
- **Logs système** : Anonymisation des données sensibles

#### Conformité RGPD
- **Consentement** : Gestion des préférences utilisateur
- **Droit à l'oubli** : Suppression complète des données
- **Portabilité** : Export des données personnelles
- **Transparence** : Information sur l'utilisation des données

### Sauvegardes Sécurisées

#### Chiffrement des Sauvegardes
- **Algorithme** : AES-256 pour les sauvegardes sensibles
- **Gestion des clés** : Stockage sécurisé des clés de chiffrement
- **Rotation** : Changement périodique des clés

#### Stockage Sécurisé
- **Local** : Protection par permissions système
- **Cloud** : Chiffrement côté client avant upload
- **Transport** : HTTPS/TLS pour tous les transferts

---

## Conclusion

En tant qu'administrateur de l'Application GAI Rappels d'Hygiène, vous disposez d'outils puissants pour gérer efficacement le système. Ce guide vous fournit les connaissances nécessaires pour :

- Administrer les utilisateurs et leurs permissions
- Maintenir la base de données en bon état
- Configurer et surveiller les sauvegardes
- Gérer la synchronisation cloud
- Assurer la sécurité et la conformité

N'hésitez pas à consulter régulièrement ce guide et à le mettre à jour selon l'évolution de vos besoins et des fonctionnalités de l'application.

**Administration efficace = Système fiable ! 🛡️**