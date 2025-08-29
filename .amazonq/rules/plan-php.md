---
plan_developpement:
  titre: "Plan Détaillé - Application GAI Rappels d'Hygiène"

  phases:
    phase_1:
      nom: "Module Utilisateurs (Fondation)"
      duree: "1-2 semaines"
      priorite: 1
      modules:
        gestion_utilisateurs:
          - "Liste des utilisateurs avec filtres (Élève/Parent/Enseignant)"
          - "Formulaire d'ajout utilisateur avec validation"
          - "Modification/Suppression utilisateur"
          - "Recherche par nom, email, type"
          - "Relations Parent-Élève, Enseignant-Classe"
        gestion_classes:
          - "CRUD Classes (nom, niveau, enseignant responsable)"
          - "Attribution élèves à une classe"
          - "Vue détaillée classe avec liste élèves"

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
      priorite: 4
      modules:
        calendrier_activites:
          - "Vue calendrier mensuelle/hebdomadaire"
          - "Création d'événements d'hygiène"
          - "Activités récurrentes (séances sensibilisation)"
          - "Responsables par activité"
        planification:
          - "Templates d'activités réutilisables"
          - "Conflits de planning détection"
          - "Export/Import planning"

    phase_4:
      nom: "Système de Notifications"
      duree: "2-3 semaines"
      priorite: 3
      modules:
        moteur_notifications:
          - "Génération automatique depuis rappels/programmations"
          - "Types de notifications (email, SMS, push, in-app)"
          - "Destinataires multiples (élève + parent)"
          - "Personnalisation messages"
        gestion_envois:
          - "File d'attente notifications"
          - "Statuts d'envoi (envoyé, lu, échec)"
          - "Retry automatique en cas d'échec"
          - "Historique complet"

    phase_5:
      nom: "Dashboard & Reporting"
      duree: "1-2 semaines"
      priorite: 5
      modules:
        tableau_bord:
          - "Statistiques temps réel (rappels actifs, notifications envoyées)"
          - "Graphiques participation par classe/élève"
          - "Alertes rappels non lus, activités à venir"
          - "Vue d'ensemble système"
        rapports_analytics:
          - "Rapports de participation par période"
          - "Efficacité des rappels (taux de lecture)"
          - "Export PDF/Excel des données"
          - "Tendances d'amélioration hygiène"

    phase_6:
      nom: "Fonctionnalités Avancées"
      duree: "2-3 semaines"
      priorite: 6
      modules:
        mobile_pwa:
          - "Interface responsive optimisée mobile"
          - "PWA (Progressive Web App) pour notifications push"
          - "Mode hors-ligne consultation rappels"
        integrations:
          - "API REST pour applications tierces"
          - "Webhooks pour systèmes externes"
          - "Import/Export données utilisateurs"

  architecture:
    structure_fichiers:
      src:
        modules:
          - "users/          # Gestion utilisateurs"
          - "reminders/      # Rappels d'hygiène"
          - "scheduling/     # Programmation"
          - "notifications/  # Système notifications"
          - "dashboard/      # Tableau de bord"
        shared:
          - "components/     # Composants réutilisables"
          - "utils/         # Fonctions utilitaires"
          - "layouts/       # Templates de page"
        assets:
          - "css/           # Styles Tailwind"
          - "js/            # JavaScript"
          - "images/        # Images/icônes"

    base_donnees_extensions:
      - "Logs système (audit trail)"
      - "Paramètres application (configuration)"
      - "Templates (modèles de rappels/notifications)"
      - "Statistiques (métriques d'usage)"

  chronologie:
    total_estime: "9-15 semaines selon la complexité"
    phases_durees:
      phase_1: "1-2 semaines (Utilisateurs + Classes)"
      phase_2: "2-3 semaines (Rappels d'hygiène)"
      phase_3: "1-2 semaines (Programmation)"
      phase_4: "2-3 semaines (Notifications)"
      phase_5: "1-2 semaines (Dashboard)"
      phase_6: "2-3 semaines (Avancées)"

  avancement:
    phase_1: "TERMINÉ ✓ - 100%"
    details_phase_1:
      gestion_utilisateurs:
        - "CRUD complet (Créer, Lire, Modifier, Supprimer) ✓"
        - "Types: Élèves, Parents, Enseignants ✓"
        - "Recherche et filtres avancés ✓"
        - "Pages de profil détaillées ✓"
      gestion_classes:
        - "CRUD complet avec assignation d'enseignants ✓"
        - "Attribution/retrait d'élèves aux classes ✓"
        - "Vue détaillée avec liste des élèves ✓"
        - "Statistiques en temps réel ✓"
      relations_parent_eleve:
        - "Assignation de parents aux élèves ✓"
        - "Interface intuitive pour gérer les relations ✓"
        - "Affichage des liens dans les profils ✓"
      tableau_bord:
        - "Statistiques globales du système ✓"
        - "Répartition par types d'utilisateurs ✓"
        - "État des relations et assignations ✓"
        - "Actions rapides pour navigation ✓"
      infrastructure:
        - "Base de données MariaDB avec Docker ✓"
        - "Architecture modulaire PHP/Tailwind CSS ✓"
        - "Système de navigation avec sidebar ✓"
        - "Composants réutilisables (modals, layouts) ✓"
  
  phase_actuelle:
    phase: "Phase 2"
    nom: "Module Rappels d'Hygiène (Cœur Métier)"
    statut: "PRÊT À DÉMARRER"
    objectif: "Développer le système de rappels d'hygiène automatisés"
    
  prochaines_taches_phase_2:
    priorite_1:
      - "Créer la structure de base de données pour les rappels"
      - "Développer le modèle Rappel avec catégories prédéfinies"
      - "Interface de création de rappels personnalisés"
    priorite_2:
      - "Système de récurrence (quotidien, hebdomadaire, mensuel)"
      - "Assignation de rappels aux utilisateurs/classes"
      - "Gestion des statuts (actif, inactif, terminé)"
    priorite_3:
      - "Intégration avec le système d'utilisateurs existant"
      - "Tests et validation des fonctionnalités"
      - "Interface utilisateur cohérente avec Phase 1"