---
project:
  title: "Application GAI - Rappels d'Hygiène (React + IndexedDB)"
  description: >
    Application web moderne frontend-only pour automatiser les pratiques d'hygiène
    au Complexe Scolaire GAI avec React, TypeScript et stockage local IndexedDB.
  context:
    domain: "Éducation et hygiène scolaire"
    location: "Complexe Scolaire GAI, Limete, Kinshasa (RDC)"
    institution_status: "Établissement éducatif privé à but non lucratif géré par la Congrégation"
    mission:
      - "Former des élèves équilibrés et instruits"
      - "Transmettre des valeurs morales et humaines"
      - "Favoriser la santé et la discipline à travers l'hygiène"
  objectives:
    global: "Application frontend-only moderne sans serveur backend"
    specific:
      - "Interface utilisateur réactive avec React + TypeScript"
      - "Stockage local sécurisé avec IndexedDB"
      - "Déploiement simplifié (fichiers statiques)"
      - "Fonctionnement offline complet"
      - "Performance optimale (données locales)"
  migration_rationale: >
    Migration de PHP/MariaDB vers React/IndexedDB pour éliminer la complexité
    serveur, améliorer l'expérience utilisateur et simplifier le déploiement.

architecture_react:
  stack_technique:
    frontend:
      framework: "React 19 + TypeScript"
      build_tool: "Vite (fast build, HMR)"
      styling: "Tailwind CSS + Headless UI"
      icons: "Lucide React"
      routing: "React Router v6"
    
    state_management:
      global_state: "Zustand (lightweight, simple)"
      server_state: "React Query (caching, sync)"
      form_state: "React Hook Form + Zod validation"
    
    storage:
      database: "IndexedDB via Dexie.js"
      cache: "LocalStorage (preferences)"
      backup: "JSON export/import"
    
    development:
      linting: "ESLint + Prettier"
      testing: "Vitest + React Testing Library"
      types: "TypeScript strict mode"
    
    deployment:
      build: "Static files (dist/)"
      hosting: "Netlify/Vercel/GitHub Pages"
      pwa: "Service Worker + Manifest"

  structure_projet:
    root:
      - "src/                 # Code source principal"
      - "public/              # Assets statiques"
      - "dist/                # Build de production"
      - "package.json         # Dépendances npm"
      - "vite.config.ts       # Configuration Vite"
      - "tailwind.config.js   # Configuration Tailwind"
      - "tsconfig.json        # Configuration TypeScript"
    
    src:
      components:
        - "ui/                 # Composants de base (Button, Input, Modal)"
        - "forms/              # Formulaires réutilisables"
        - "layout/             # Layout, Header, Sidebar"
      
      pages:
        - "Dashboard/          # Page tableau de bord"
        - "Users/              # Pages gestion utilisateurs"
        - "Classes/            # Pages gestion classes"
        - "Settings/           # Configuration application"
      
      hooks:
        - "useUsers.ts         # Hook gestion utilisateurs"
        - "useClasses.ts       # Hook gestion classes"
        - "useLocalStorage.ts  # Hook localStorage"
        - "useExportImport.ts  # Hook sauvegarde"
      
      store:
        - "userStore.ts        # Store Zustand utilisateurs"
        - "classStore.ts       # Store Zustand classes"
        - "appStore.ts         # Store configuration app"
      
      db:
        - "schema.ts           # Schéma IndexedDB (Dexie)"
        - "migrations.ts      # Migrations base de données"
        - "operations.ts      # Opérations CRUD"
        - "seedData.ts        # Données de test"
      
      utils:
        - "helpers.ts          # Fonctions utilitaires"
        - "constants.ts       # Constantes application"
        - "validators.ts      # Schémas de validation Zod"
      
      types:
        - "user.ts            # Types utilisateurs"
        - "class.ts           # Types classes"
        - "common.ts          # Types communs"

schema_indexeddb:
  tables:
    users:
      structure:
        - "id: number (auto-increment primary key)"
        - "nom: string (required)"
        - "prenom: string (required)"
        - "email: string (optional, unique)"
        - "telephone: string (optional)"
        - "type_utilisateur: 'Élève' | 'Parent' | 'Enseignant'"
        - "created_at: Date"
        - "updated_at: Date"
      
    classes:
      structure:
        - "id: number (auto-increment primary key)"
        - "nom_classe: string (required)"
        - "niveau: string (required)"
        - "enseignant_id: number (foreign key to users)"
        - "created_at: Date"
        - "updated_at: Date"
      
    students:
      structure:
        - "id: number (auto-increment primary key)"
        - "utilisateur_id: number (foreign key to users)"
        - "classe_id: number (foreign key to classes)"
        - "parent_id: number (foreign key to users)"
        - "created_at: Date"
      
    reminders:
      structure:
        - "id: number (auto-increment primary key)"
        - "titre: string (required)"
        - "description: string"
        - "categorie: 'Lavage mains' | 'Brossage dents' | 'Hygiène corporelle' | 'Personnalisé'"
        - "recurrence: 'Quotidien' | 'Hebdomadaire' | 'Mensuel' | 'Unique'"
        - "date_debut: Date"
        - "heure: string (HH:mm format)"
        - "statut: 'Actif' | 'Inactif' | 'Terminé'"
        - "createur_id: number (foreign key to users)"
        - "created_at: Date"

fonctionnalites_implementees:
  migration_phase: "TERMINÉE ✓"
  phase_2_rappels: "TERMINÉE ✓"
  phase_3_notifications: "TERMINÉE ✓"
  phase_4_avancees: "TERMINÉE ✓"
  
  modules_complets:
    infrastructure:
      - "Setup projet React + TypeScript + Vite ✓"
      - "Configuration Tailwind CSS + Lucide React ✓"
      - "Architecture IndexedDB avec Dexie.js ✓"
      - "Composants UI réutilisables (Button, Input, Select) ✓"
      - "Layout + Navigation sidebar ✓"
      - "Routing React Router complet ✓"
    
    gestion_utilisateurs:
      - "CRUD complet utilisateurs ✓"
      - "Types: Élèves, Parents, Enseignants ✓"
      - "Recherche et filtres avancés ✓"
      - "Pages: Liste, Création, Détail, Édition ✓"
      - "Assignation parent-élève ✓"
    
    gestion_classes:
      - "CRUD complet classes ✓"
      - "Assignation enseignants responsables ✓"
      - "Assignation élèves aux classes ✓"
      - "Pages: Liste, Création, Détail, Édition ✓"
      - "Vue détaillée avec liste des élèves ✓"
    
    rappels_hygiene:
      - "Types et schéma IndexedDB complets ✓"
      - "Catégories prédéfinies (Lavage mains, Brossage dents, Hygiène corporelle, Personnalisé) ✓"
      - "CRUD complet rappels avec validation ✓"
      - "Système de récurrence (Quotidien, Hebdomadaire, Mensuel, Unique) ✓"
      - "Assignation utilisateurs individuels et classes entières ✓"
      - "Gestion des statuts (Actif, Inactif, Terminé) ✓"
      - "Pages: Liste, Création, Détail, Édition, Assignation ✓"
      - "Données de test réalistes (6 rappels d'hygiène) ✓"
    
    notifications:
      - "Service de notifications Web API complet ✓"
      - "Centre de notifications avec statistiques temps réel ✓"
      - "Programmation automatique depuis rappels ✓"
      - "Calcul récurrence et prochaines occurrences ✓"
      - "Statuts notifications (pending, sent, read, failed) ✓"
      - "Historique complet des 50 dernières notifications ✓"
      - "Gestion permissions navigateur ✓"
      - "Test notifications manuelles ✓"
    
    pwa_service_worker:
      - "Service Worker pour cache offline ✓"
      - "Notifications en arrière-plan persistantes ✓"
      - "Manifest PWA pour installation desktop/mobile ✓"
      - "Gestion clics notifications avec actions ✓"
      - "Planificateur automatique intégré ✓"
      - "Service PWA pour gestion mises à jour ✓"
    
    dashboard_admin:
      - "Tableau de bord avec statistiques temps réel ✓"
      - "Interface d'administration complète ✓"
      - "Données de test réalistes (École GAI) ✓"
      - "Export/Import JSON avec validation ✓"
      - "Seed database automatique ✓"

fonctionnalites_implementees_phase_4:
  themes_personnalisables:
    - "Context Provider pour thèmes clair/sombre ✓"
    - "Toggle thème dans header avec icônes ✓"
    - "Persistance préférences localStorage ✓"
    - "Détection thème système automatique ✓"
    - "Adaptation Tailwind CSS mode sombre ✓"
    - "Composants UI adaptés (Button, Input, Select) ✓"
    - "Layout et Dashboard adaptés ✓"
    - "Toutes les pages adaptées au mode sombre ✓"
  
  rapports_analytics:
    - "Page rapports avec graphiques visuels ✓"
    - "Métriques temps réel (utilisateurs, classes, rappels) ✓"
    - "Barres de progrès et pourcentages ✓"
    - "Recommandations intelligentes ✓"
    - "Export données JSON intégré ✓"
  
  sauvegarde_automatique:
    - "Service de sauvegarde avec planification ✓"
    - "Configuration quotidienne/hebdomadaire/mensuelle ✓"
    - "Gestion automatique du stockage ✓"
    - "Interface BackupManager complète ✓"
    - "Restauration et téléchargement sauvegardes ✓"
    - "Monitoring usage stockage ✓"
  
  administration_avancee:
    - "SystemStatus - Monitoring système complet ✓"
    - "DataManager - Export/Import JSON ✓"
    - "BackupManager intégré ✓"
    - "Interface d'administration unifiée ✓"
  
  optimisations_performance:
    - "IndexedDB optimisé avec Dexie.js ✓"
    - "Service Worker pour cache offline ✓"
    - "Statistiques temps réel optimisées ✓"
    - "Lazy loading des composants ✓"

fonctionnalites_futures:
  phase_5_finalisation:
    - "Tests automatisés E2E complets"
    - "Documentation utilisateur détaillée"
    - "Guide d'installation et déploiement"
    - "Formation utilisateurs finaux"
  
  corrections_appliquees:
    - "Navigation: Icônes distinctes pour Rappels et Notifications ✓"
    - "Base de données: Correction noms de tables (reminderAssignments) ✓"
    - "Interface: Amélioration UX navigation sidebar ✓"

avantages_realises:
  simplicite:
    - "Aucun serveur backend requis ✓"
    - "Déploiement par simple copie de fichiers ✓"
    - "Configuration minimale réussie ✓"
  
  performance:
    - "Accès instantané aux données locales ✓"
    - "Interface ultra-réactive ✓"
    - "Statistiques temps réel ✓"
  
  securite:
    - "Données 100% locales et privées ✓"
    - "Aucune exposition réseau ✓"
    - "Contrôle total par l'utilisateur ✓"
  
  portabilite:
    - "Compatible tous navigateurs modernes ✓"
    - "Prêt pour conversion PWA ✓"
    - "Base solide pour Electron si nécessaire ✓"

limitations_resolues:
  donnees_locales:
    - "Pas de synchronisation multi-appareils (par design)"
    - "Sauvegarde manuelle via export JSON ✓"
    - "Protection contre perte via interface admin ✓"
  
  solutions_implementees:
    - "Export/Import JSON complet et fonctionnel ✓"
    - "Interface d'administration intuitive ✓"
    - "Données de test pour démarrage rapide ✓"
    - "Confirmations pour actions destructives ✓"

statut_projet:
  phase_actuelle: "Phase 5 - Finalisation & Déploiement (10% terminé)"
  infrastructure: "React + TypeScript + Vite + IndexedDB + PWA + Thèmes + Analytics + Backup (Opérationnel)"
  prochaine_etape: "Tests finaux et documentation"
  objectif_court_terme: "Tests E2E complets et guide utilisateur"
  corrections_recentes:
    - "Icônes navigation différenciées (Rappels: Bell, Notifications: MessageSquare) ✓"
    - "Correction table reminderAssignments dans filtrage utilisateurs ✓"
  
  donnees_disponibles:
    utilisateurs: "13 utilisateurs de test (3 enseignants, 4 parents, 6 élèves)"
    classes: "4 classes avec enseignants assignés"
    relations: "Relations parent-élève et élève-classe fonctionnelles"
    interface: "Toutes les pages CRUD opérationnelles"
  
  acces_application:
    dev_server: "npm run dev (http://localhost:5173)"
    pages_principales:
      - "/" - Dashboard avec statistiques
      - "/users" - Gestion utilisateurs
      - "/classes" - Gestion classes  
      - "/admin" - Administration et données
    
  phases_terminees:
    migration_php_vers_react: "100% fonctionnalités migrées avec améliorations"
    phase_2_rappels: "Système complet rappels d'hygiène automatisés"
    phase_3_notifications: "Notifications PWA avec Service Worker"
    phase_4_avancees: "Thèmes, Analytics, Sauvegarde automatique"
    pret_pour: "Phase 5 - Finalisation et déploiement production"