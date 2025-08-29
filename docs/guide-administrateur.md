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

En tant qu'administrateur de l'Application GAI Rappels d'Hygiène, vous disposez d'un accès complet à toutes les fonctionnalités du système. Ce guide détaille vos responsabilités et les outils à votre disposition.

### Responsabilités Principales
- Gestion complète des comptes utilisateurs
- Administration de la base de données
- Configuration des sauvegardes automatiques
- Monitoring des performances système
- Maintenance et mises à jour
- Support utilisateur de niveau 2

### Accès Administrateur
- **Email** : `admin@gai.cd`
- **Mot de passe** : `admin123`
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
- **Export complet** : Téléchargement de toutes les données en JSON
- **Import de données** : Restauration depuis un fichier JSON
- **Validation** : Vérification de l'intégrité des données importées
- **Statistiques** : Vue d'ensemble des données stockées

#### Statut Système (SystemStatus)
- **Utilisation du stockage** : Espace occupé par IndexedDB
- **Performance** : Temps de réponse des requêtes
- **Intégrité** : Vérification des relations entre tables
- **Santé générale** : Indicateurs de bon fonctionnement

### Structure de la Base de Données

#### Tables Principales
```typescript
// Utilisateurs
users: {
  id: number (auto-increment)
  nom: string
  prenom: string
  email: string (unique)
  telephone?: string
  type_utilisateur: 'Élève' | 'Parent' | 'Enseignant'
  password_hash: string
  created_at: Date
  updated_at: Date
}

// Classes
classes: {
  id: number (auto-increment)
  nom_classe: string
  niveau: string
  enseignant_id: number (FK users)
  created_at: Date
  updated_at: Date
}

// Relations élève-classe-parent
students: {
  id: number (auto-increment)
  utilisateur_id: number (FK users)
  classe_id: number (FK classes)
  parent_id: number (FK users)
  created_at: Date
}

// Rappels d'hygiène
reminders: {
  id: number (auto-increment)
  titre: string
  description?: string
  categorie: 'Lavage mains' | 'Brossage dents' | 'Hygiène corporelle' | 'Personnalisé'
  recurrence: 'Quotidien' | 'Hebdomadaire' | 'Mensuel' | 'Unique'
  date_debut: Date
  heure: string
  statut: 'Actif' | 'Inactif' | 'Terminé'
  createur_id: number (FK users)
  created_at: Date
}

// Assignations de rappels
reminderAssignments: {
  id: number (auto-increment)
  rappel_id: number (FK reminders)
  utilisateur_id: number (FK users)
  created_at: Date
}
```

### Maintenance de la Base de Données

#### Nettoyage Périodique
- **Notifications anciennes** : Suppression automatique après 30 jours
- **Logs système** : Rotation des fichiers de log
- **Cache obsolète** : Nettoyage des données temporaires

#### Optimisation des Performances
- **Indexation** : Vérification des index sur les clés étrangères
- **Requêtes** : Optimisation des jointures complexes
- **Stockage** : Compression des données anciennes

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

### Configuration Supabase

#### Paramètres de Connexion
Accédez via **Administration > Gestionnaire de Synchronisation**

```typescript
supabaseConfig: {
  url: string // URL de votre instance Supabase
  anonKey: string // Clé publique Supabase
  serviceRoleKey: string // Clé de service (admin)
}
```

#### Activation de la Synchronisation
1. **Configuration** : Saisie des paramètres Supabase
2. **Test de connexion** : Vérification de la connectivité
3. **Synchronisation initiale** : Upload des données locales
4. **Activation** : Démarrage de la sync bidirectionnelle

### Gestion des Conflits

#### Stratégies de Résolution
- **Local First** : Priorité aux données locales en cas de conflit
- **Timestamp** : Résolution basée sur la date de modification
- **Manuel** : Interface de résolution manuelle des conflits

#### Monitoring de la Synchronisation
- **Statut en temps réel** : Indicateur de connexion cloud
- **Historique des syncs** : Log des synchronisations réussies/échouées
- **Métriques** : Nombre d'enregistrements synchronisés

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
1. Vérifier l'utilisation du stockage
2. Analyser les requêtes lentes
3. Nettoyer le cache navigateur
4. Optimiser les index de base de données

# Solutions
- Nettoyage des données anciennes
- Optimisation des requêtes
- Mise à jour du navigateur
```

**Échec de Synchronisation**
```bash
# Diagnostic
1. Vérifier la connectivité internet
2. Contrôler les paramètres Supabase
3. Analyser les logs d'erreur
4. Tester l'authentification

# Solutions
- Reconfiguration des paramètres
- Réinitialisation de la connexion
- Synchronisation manuelle
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