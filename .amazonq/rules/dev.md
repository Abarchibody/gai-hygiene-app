---
project:
  title: "Application GAI - Rappels d'Hygiène Automatisés"
  description: >
    Application web éducative pour automatiser et améliorer les pratiques d'hygiène
    au Complexe Scolaire GAI grâce à un système de rappels programmés,
    notifications automatiques et suivi individualisé des activités.
  context:
    domain: "Éducation et hygiène scolaire"
    location: "Complexe Scolaire GAI, Limete, Kinshasa (RDC)"
    institution_status: "Établissement éducatif privé à but non lucratif géré par la Congrégation"
    mission:
      - "Former des élèves équilibrés et instruits"
      - "Transmettre des valeurs morales et humaines"
      - "Favoriser la santé et la discipline à travers l'hygiène"
  objectives:
    global: "Système complet de gestion et d'automatisation des rappels d'hygiène"
    specific:
      - "Gestion centralisée des utilisateurs (élèves, parents, enseignants) ✓"
      - "Organisation des classes et relations familiales ✓"
      - "Création et programmation de rappels d'hygiène personnalisés"
      - "Système de notifications automatisées multi-canaux"
      - "Suivi et traçabilité des activités d'hygiène"
      - "Tableaux de bord et rapports d'efficacité"
  problematique: >
    Le suivi de l'hygiène manque d'outils modernes et de traçabilité.
    Les rappels oraux et affiches sont insuffisants pour un suivi individualisé efficace.
  solution_actuelle: >
    Système web complet avec gestion d'utilisateurs, classes, et prêt pour
    l'intégration du module de rappels d'hygiène automatisés.

architecture_actuelle:
  modules_implementes:
    - name: "Gestion Utilisateurs"
      status: "TERMINÉ ✓"
      fonctionnalites:
        - "CRUD complet (Créer, Lire, Modifier, Supprimer)"
        - "Types: Élèves, Parents, Enseignants"
        - "Recherche et filtres avancés"
        - "Pages de profil détaillées"
    - name: "Gestion Classes"
      status: "TERMINÉ ✓"
      fonctionnalites:
        - "CRUD complet avec assignation d'enseignants"
        - "Attribution/retrait d'élèves aux classes"
        - "Vue détaillée avec liste des élèves"
        - "Statistiques en temps réel"
    - name: "Relations Parent-Élève"
      status: "TERMINÉ ✓"
      fonctionnalites:
        - "Assignation de parents aux élèves"
        - "Interface intuitive pour gérer les relations"
        - "Affichage des liens dans les profils"
    - name: "Tableau de Bord"
      status: "TERMINÉ ✓"
      fonctionnalites:
        - "Statistiques globales du système"
        - "Répartition par types d'utilisateurs"
        - "État des relations et assignations"
        - "Actions rapides pour navigation"

modules_a_developper:
  - name: "Rappels d'Hygiène"
    role: "Créer et gérer les rappels automatisés"
    priorite: "PHASE 2 - PRIORITÉ 1"
    attributes:
      - {code: "id", designation: "Identifiant rappel", type: "INT", auto_increment: true}
      - {code: "titre", designation: "Intitulé du rappel", type: "VARCHAR", size: 100}
      - {code: "description", designation: "Description détaillée", type: "TEXT"}
      - {code: "categorie", designation: "Catégorie d'hygiène", type: "ENUM"}
      - {code: "recurrence", designation: "Type de récurrence", type: "ENUM"}
      - {code: "date_debut", designation: "Date de début", type: "DATE"}
      - {code: "heure", designation: "Heure d'exécution", type: "TIME"}
      - {code: "statut", designation: "Statut (actif/inactif)", type: "ENUM"}
      - {code: "createur_id", designation: "Utilisateur créateur", type: "INT"}
  - name: "Assignations Rappels"
    role: "Lier rappels aux utilisateurs/classes"
    attributes:
      - {code: "rappel_id", designation: "Référence rappel", type: "INT"}
      - {code: "utilisateur_id", designation: "Utilisateur cible", type: "INT"}
      - {code: "classe_id", designation: "Classe cible", type: "INT"}
  - name: "Notifications"
    role: "Gérer l'envoi des notifications"
    attributes:
      - {code: "id", designation: "Identifiant notification", type: "INT"}
      - {code: "rappel_id", designation: "Rappel source", type: "INT"}
      - {code: "destinataire_id", designation: "Utilisateur destinataire", type: "INT"}
      - {code: "message", designation: "Contenu du message", type: "TEXT"}
      - {code: "type", designation: "Type de notification", type: "ENUM"}
      - {code: "statut", designation: "Statut d'envoi", type: "ENUM"}
      - {code: "date_envoi", designation: "Date d'envoi", type: "DATETIME"}
  - name: "Journal d'événements"
    role: "Tracer l'historique complet"
    attributes:
      - {code: "id", designation: "Identifiant événement", type: "INT"}
      - {code: "type_evenement", designation: "Type d'événement", type: "VARCHAR"}
      - {code: "description", designation: "Description", type: "TEXT"}
      - {code: "utilisateur_id", designation: "Utilisateur concerné", type: "INT"}
      - {code: "statut", designation: "Succès/Échec", type: "ENUM"}
      - {code: "timestamp", designation: "Date et heure", type: "DATETIME"}

dependances_fonctionnelles_actuelles:
  - "utilisateur_id -> {nom, prenom, email, telephone, type_utilisateur}"
  - "classe_id -> {nom_classe, niveau, enseignant_id}"
  - "eleve_id -> {utilisateur_id, classe_id, parent_id}"
  
dependances_fonctionnelles_futures:
  - "rappel_id -> {titre, description, categorie, recurrence, statut, createur_id}"
  - "notification_id -> {rappel_id, destinataire_id, message, type, statut}"
  - "evenement_id -> {type_evenement, description, utilisateur_id, statut}"

regles_de_gestion_implementees:
  - "Un utilisateur peut être de type Élève, Parent ou Enseignant ✓"
  - "Un élève peut être assigné à une seule classe ✓"
  - "Un parent peut avoir plusieurs enfants élèves ✓"
  - "Un enseignant peut être responsable de plusieurs classes ✓"
  - "Une classe peut avoir plusieurs élèves ✓"
  
regles_de_gestion_futures:
  - "Un enseignant peut créer des rappels personnalisés pour ses classes"
  - "Un rappel peut être assigné à des utilisateurs individuels ou des classes entières"
  - "Les rappels récurrents génèrent automatiquement des notifications"
  - "Chaque notification envoyée est tracée dans le journal d'événements"
  - "Les parents reçoivent les notifications concernant leurs enfants"
  - "Les statistiques de participation sont calculées automatiquement"

objets_implementes:
  - "Utilisateur (Élève/Parent/Enseignant) ✓"
  - "Classe ✓"
  - "Relation Élève-Classe ✓"
  - "Relation Parent-Élève ✓"
  - "Tableau de Bord ✓"
  
objets_a_implementer:
  - "Rappel d'Hygiène"
  - "Catégorie d'Hygiène"
  - "Assignation Rappel"
  - "Notification"
  - "Journal d'événements"
  - "Statistiques de Participation"

relations_implementees:
  - "Parent ⇄ Élève : un parent peut avoir plusieurs enfants ✓"
  - "Classe ⇄ Élève : un élève appartient à une classe ✓"
  - "Enseignant ⇄ Classe : un enseignant peut être responsable de plusieurs classes ✓"
  - "Utilisateur ⇄ Profil : chaque utilisateur a un profil détaillé ✓"
  
relations_futures:
  - "Enseignant ⇄ Rappel : un enseignant crée plusieurs rappels personnalisés"
  - "Rappel ⇄ Assignation : un rappel peut être assigné à plusieurs cibles"
  - "Rappel ⇄ Notification : un rappel génère des notifications automatiques"
  - "Notification ⇄ Utilisateur : notifications envoyées aux destinataires"
  - "Notification ⇄ Journal : chaque notification est tracée"
  - "Classe ⇄ Rappel : rappels collectifs pour toute une classe"
  
statut_projet:
  phase_1: "TERMINÉE - Fondation solide établie"
  phase_2: "PRÊTE - Module rappels d'hygiène à développer"
  infrastructure: "Docker + MariaDB + PHP + Tailwind CSS"
  acces: "http://localhost:8080/dashboard.php"