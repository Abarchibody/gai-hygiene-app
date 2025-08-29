---
plan_developpement:
  titre: "Plan Détaillé - Application GAI Rappels d'Hygiène (React)"

  migration_architecture:
    ancien_stack: "PHP + MariaDB + Docker"
    nouveau_stack: "React + TypeScript + IndexedDB"
    raison: "Frontend-only, pas de backend à maintenir"

  architecture_react:
    stack_technique:
      frontend: "React 19 + TypeScript + Vite"
      styling: "Tailwind CSS + Headless UI"
      icons: "Lucide React"
      storage: "IndexedDB (Dexie.js) + LocalStorage"
      state: "Zustand + React Query"
      routing: "React Router"
      build: "Vite (SPA statique)"
      deploy: "Netlify/Vercel ou fichiers statiques"
    
    structure_fichiers:
      src:
        components:
          - "ui/            # Composants de base"
          - "forms/         # Formulaires"
          - "modals/        # Modales"
        pages:
          - "Dashboard.tsx  # Tableau de bord"
          - "Users/         # Gestion utilisateurs"
          - "Classes/       # Gestion classes"
        hooks:
          - "useUsers.ts    # Custom hooks utilisateurs"
          - "useClasses.ts  # Custom hooks classes"
        store:
          - "userStore.ts   # State management utilisateurs"
          - "classStore.ts  # State management classes"
        db:
          - "schema.ts      # Schéma IndexedDB"
          - "operations.ts  # Opérations CRUD"
        utils:
          - "helpers.ts     # Fonctions utilitaires"
        types:
          - "index.ts       # Types TypeScript"

    stockage_donnees:
      indexeddb:
        - "Base de données complète (utilisateurs, classes, relations)"
        - "Relations complexes avec clés étrangères"
        - "Recherche avancée et filtrage"
        - "Transactions ACID"
      localstorage:
        - "Préférences utilisateur"
        - "Configuration application"
        - "Cache temporaire"

  phases:
    migration:
      nom: "Migration vers React + IndexedDB"
      duree: "2.5-3.5 semaines"
      priorite: 1
      etapes:
        setup_infrastructure:
          duree: "3-4 jours"
          taches:
            - "Initialisation projet React + TypeScript + Vite"
            - "Configuration Tailwind CSS + Headless UI"
            - "Setup IndexedDB avec Dexie.js"
            - "Architecture routing et state management"
        
        base_donnees_locale:
          duree: "1 jour"
          taches:
            - "Schéma IndexedDB (utilisateurs, classes, relations)"
            - "Fonctions CRUD de base"
            - "Migration des données existantes"
        
        composants_ui:
          duree: "3-4 jours"
          taches:
            - "Layout principal + sidebar responsive"
            - "Composants réutilisables (forms, modals, buttons)"
            - "Système de thème et icônes"
        
        modules_metier:
          duree: "5-7 jours"
          taches:
            - "Module gestion utilisateurs (CRUD complet)"
            - "Module gestion classes (avec relations)"
            - "Système relations parent-élève"
            - "Tableau de bord avec statistiques"
        
        finalisation:
          duree: "2-3 jours"
          taches:
            - "Tests et débogage"
            - "Optimisations performance"
            - "Export/Import des données"
            - "Déploiement statique"

    phase_2:
      nom: "Module Rappels d'Hygiène (Cœur Métier)"
      duree: "2-3 semaines"
      priorite: 2
      modules:
        types_rappels:
          - "Catégories prédéfinies: Lavage mains, Brossage dents, Hygiène corporelle"
          - "Rappels personnalisés par enseignant"
        gestion_rappels:
          - "Création rappel (titre, description, date/heure, responsable)"
          - "Assignation à utilisateurs/classes"
          - "Récurrence (quotidien, hebdomadaire, mensuel)"
          - "Statut (actif, inactif, terminé)"

    phase_3:
      nom: "Module Programmation"
      duree: "1-2 semaines"
      priorite: 3
      modules:
        calendrier_activites:
          - "Vue calendrier mensuelle/hebdomadaire"
          - "Création d'événements d'hygiène"
          - "Activités récurrentes (séances sensibilisation)"
        planification:
          - "Templates d'activités réutilisables"
          - "Conflits de planning détection"

    phase_4:
      nom: "Système de Notifications"
      duree: "2-3 semaines"
      priorite: 4
      modules:
        notifications_locales:
          - "Notifications navigateur (Web Notifications API)"
          - "Rappels programmés avec Service Workers"
          - "Personnalisation messages"
        gestion_envois:
          - "File d'attente notifications locales"
          - "Statuts (programmé, affiché, lu)"
          - "Historique complet"

    phase_5:
      nom: "PWA & Fonctionnalités Avancées"
      duree: "2-3 semaines"
      priorite: 5
      modules:
        pwa:
          - "Progressive Web App (manifest, service worker)"
          - "Mode hors-ligne complet"
          - "Installation sur desktop/mobile"
        fonctionnalites_avancees:
          - "Export/Import données (JSON, CSV)"
          - "Sauvegarde automatique"
          - "Thèmes personnalisables"

  avancement:
    phase_1_php: "TERMINÉ ✓ - 100% (Version PHP archivée)"
    migration_react: "TERMINÉ ✓ - 100%"
    
  phase_actuelle:
    phase: "Phase 2"
    nom: "Module Rappels d'Hygiène (Cœur Métier)"
    statut: "PRÊT À DÉMARRER"
    objectif: "Développer le système de rappels d'hygiène automatisés"
    
  justification_migration:
    avantages:
      - "Simplicité de déploiement (fichiers statiques)"
      - "Pas de serveur à maintenir"
      - "Performance supérieure (données locales)"
      - "Fonctionne offline par défaut"
      - "Sécurité (données privées locales)"
      - "Interface utilisateur moderne et réactive"
    
  modules_termines:
    infrastructure:
      - "Setup projet React + TypeScript + Vite ✓"
      - "Configuration Tailwind CSS + Lucide React ✓"
      - "Architecture IndexedDB avec Dexie.js ✓"
    interface:
      - "Layout principal + sidebar responsive ✓"
      - "Composants réutilisables (Button, Input, Select) ✓"
      - "Système de navigation avec routing ✓"
    modules_metier:
      - "Module Users complet (CRUD + relations) ✓"
      - "Module Classes complet (CRUD + assignations) ✓"
      - "Système relations parent-élève ✓"
      - "Dashboard avec statistiques temps réel ✓"
    donnees:
      - "Données de test réalistes (École GAI) ✓"
      - "Système export/import JSON ✓"
      - "Interface d'administration complète ✓"
      - "Seed database avec relations automatiques ✓"
  
  prochaines_taches_phase_2:
    priorite_1:
      - "Types & Schema pour les rappels d'hygiène"
      - "Catégories prédéfinies (Lavage mains, Brossage dents, etc.)"
      - "Interface création rappels personnalisés"
    priorite_2:
      - "Système de récurrence (quotidien, hebdomadaire, mensuel)"
      - "Assignation rappels aux utilisateurs/classes"
      - "Gestion des statuts (actif, inactif, terminé)"
    priorite_3:
      - "Intégration avec modules existants"
      - "Tests et validation des fonctionnalités"
      - "Interface utilisateur cohérente"

  chronologie_totale:
    migration: "TERMINÉ ✓ (3 semaines)"
    phase_2_rappels: "2-3 semaines (À venir)"
    phase_3_notifications: "2-3 semaines"
    phase_4_pwa: "2-3 semaines"
    total_restant: "6-9 semaines"