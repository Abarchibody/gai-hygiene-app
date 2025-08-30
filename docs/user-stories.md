# User Stories - Application GAI Rappels d'Hygiène

## Architecture Offline-First + Cloud Sync

L'application utilise une **architecture hybride offline-first** :
- **Stockage principal** : IndexedDB (local, toujours disponible)
- **Synchronisation cloud** : Supabase PostgreSQL (temps réel)
- **Fonctionnement** : 100% offline avec sync automatique quand en ligne
- **Avantages** : Performance maximale, résilience réseau, collaboration temps réel

## Table des Matières
1. [Module Tableau de Bord](#module-tableau-de-bord)
2. [Module Gestion Utilisateurs](#module-gestion-utilisateurs)
3. [Module Gestion Classes](#module-gestion-classes)
4. [Module Rappels d'Hygiène](#module-rappels-dhygiène)
5. [Module Notifications](#module-notifications)
6. [Module Programmation/Événements](#module-programmationévénements)
7. [Module Rapports & Analytics](#module-rapports--analytics)
8. [Module Administration](#module-administration)
9. [Module Authentification & Profil](#module-authentification--profil)
10. [Module Navigation & Layout](#module-navigation--layout)
11. [Module Offline & Synchronisation](#module-offline--synchronisation)
12. [Stories Transversales](#stories-transversales)

---

## Module Tableau de Bord

### 👑 Administrateur - Dashboard Global (Dashboard.tsx)
- **En tant qu'administrateur**, je veux voir toutes les statistiques globales (rappels actifs, notifications du jour, progrès hebdomadaire, événements) **chargées instantanément depuis IndexedDB**
- **En tant qu'administrateur**, je veux voir des métriques visuelles avec icônes colorées et valeurs numériques importantes **calculées en temps réel localement**
- **En tant qu'administrateur**, je veux voir la répartition des rappels par catégorie avec barres de progression **même hors ligne**
- **En tant qu'administrateur**, je veux voir l'activité récente du système avec horodatage **synchronisée automatiquement**
- **En tant qu'administrateur**, je veux recevoir des messages d'encouragement basés sur les performances **calculées localement**
- **En tant qu'administrateur**, je veux que les données se chargent avec indicateur de progression **ultra-rapide (cache local)**
- **En tant qu'administrateur**, je veux voir une vue d'ensemble adaptée à mon rôle d'administrateur **avec statut de synchronisation cloud**
- **En tant qu'administrateur**, je veux voir l'indicateur de statut réseau (online/offline) **dans le header**

### 👨🏫 Enseignant - Dashboard Pédagogique (Dashboard.tsx)
- **En tant qu'enseignant**, je veux voir uniquement les statistiques de mes rappels créés et mes classes
- **En tant qu'enseignant**, je veux voir mes rappels actifs avec le nombre que j'ai créés
- **En tant qu'enseignant**, je veux voir les notifications liées à mes élèves et classes
- **En tant qu'enseignant**, je veux voir la répartition de mes rappels par catégorie
- **En tant qu'enseignant**, je veux voir l'activité récente de mes classes
- **En tant qu'enseignant**, je veux recevoir des conseils pour améliorer l'engagement de mes élèves

### 👨👩👧👦 Parent - Dashboard Familial (Dashboard.tsx)
- **En tant que parent**, je veux voir les statistiques d'hygiène de mes enfants uniquement
- **En tant que parent**, je veux voir les rappels assignés à mes enfants par catégorie
- **En tant que parent**, je veux voir les notifications concernant mes enfants
- **En tant que parent**, je veux voir l'activité récente de mes enfants
- **En tant que parent**, je veux recevoir des encouragements pour soutenir mes enfants
- **En tant que parent**, je veux voir le progrès hebdomadaire de mes enfants

### 🎓 Élève - Dashboard Personnel (Dashboard.tsx)
- **En tant qu'élève**, je veux voir mes propres statistiques d'hygiène personnelles
- **En tant qu'élève**, je veux voir mes rappels assignés par catégorie
- **En tant qu'élève**, je veux voir mes notifications personnelles
- **En tant qu'élève**, je veux voir mon activité récente
- **En tant qu'élève**, je veux recevoir des encouragements personnalisés selon mes progrès
- **En tant qu'élève**, je veux voir mon progrès hebdomadaire pour me motiver

---

## Module Gestion Utilisateurs

### 👑 Administrateur - Liste des Utilisateurs (UsersList)
- **En tant qu'administrateur**, je veux voir la liste complète des utilisateurs **chargée instantanément depuis IndexedDB** avec nom, type, contact et date de création
- **En tant qu'administrateur**, je veux rechercher des utilisateurs par nom, prénom ou email **avec recherche locale ultra-rapide**
- **En tant qu'administrateur**, je veux filtrer les utilisateurs par type (Élève, Parent, Enseignant) **avec filtrage temps réel local**
- **En tant qu'administrateur**, je veux voir des avatars colorés avec initiales pour identifier visuellement les utilisateurs
- **En tant qu'administrateur**, je veux voir des badges colorés pour différencier les types d'utilisateurs
- **En tant qu'administrateur**, je veux accéder rapidement aux actions (voir, modifier, supprimer) **fonctionnant offline avec sync différée**
- **En tant qu'administrateur**, je veux créer un nouvel utilisateur **sauvegardé localement et synchronisé automatiquement**
- **En tant qu'administrateur**, je veux voir le nombre total d'utilisateurs filtrés **calculé en temps réel**
- **En tant qu'administrateur**, je veux voir les opérations en attente de synchronisation **avec indicateur visuel**

### 👑 Administrateur - Création d'Utilisateur (CreateUser)
- **En tant qu'administrateur**, je veux créer des comptes **sauvegardés immédiatement en local** avec nom, prénom, email, téléphone et mot de passe
- **En tant qu'administrateur**, je veux sélectionner le type d'utilisateur (Élève, Parent, Enseignant, Admin) **avec validation locale**
- **En tant qu'administrateur**, je veux valider le format email et la longueur du mot de passe **instantanément côté client**
- **En tant qu'administrateur**, je veux voir les champs obligatoires clairement marqués
- **En tant qu'administrateur**, je veux être redirigé vers la liste après création réussie **même hors ligne**
- **En tant qu'administrateur**, je veux voir des messages d'erreur clairs **pour les conflits locaux et de synchronisation**
- **En tant qu'administrateur**, je veux que la création fonctionne offline **avec synchronisation automatique au retour en ligne**

### 👑 Administrateur - Détail d'Utilisateur (UserDetail)
- **En tant qu'administrateur**, je veux voir toutes les informations détaillées de l'utilisateur
- **En tant qu'administrateur**, je veux voir un avatar coloré et un badge de type pour identification visuelle
- **En tant qu'administrateur**, je veux voir les dates de création et modification pour le suivi
- **En tant qu'administrateur**, je veux voir les relations familiales (élève-parent) et scolaires (classe)
- **En tant qu'administrateur**, je veux modifier, supprimer ou réinitialiser le mot de passe depuis la vue détail
- **En tant qu'administrateur**, je veux assigner un parent à un élève ou une classe à un élève
- **En tant qu'administrateur**, je veux voir les enfants d'un parent ou les classes d'un enseignant
- **En tant qu'administrateur**, je veux confirmer les actions destructives avec des dialogues

### 👑 Administrateur - Modification d'Utilisateur (EditUser)
- **En tant qu'administrateur**, je veux modifier les informations personnelles (nom, prénom, email, téléphone)
- **En tant qu'administrateur**, je veux changer le type d'utilisateur si nécessaire
- **En tant qu'administrateur**, je veux voir les données actuelles pré-remplies dans le formulaire
- **En tant qu'administrateur**, je veux valider les modifications avant sauvegarde
- **En tant qu'administrateur**, je veux être redirigé vers le détail après modification réussie

### 👑 Administrateur - Assignation de Parent (AssignParent)
- **En tant qu'administrateur**, je veux voir tous les parents disponibles pour assignation
- **En tant qu'administrateur**, je veux sélectionner un parent avec bouton radio pour éviter les erreurs
- **En tant qu'administrateur**, je veux voir les informations de chaque parent (nom, email) avant assignation
- **En tant qu'administrateur**, je veux être informé s'il n'y a aucun parent disponible
- **En tant qu'administrateur**, je veux accéder à la création de parent si nécessaire
- **En tant qu'administrateur**, je veux créer ou mettre à jour la relation élève-parent

### 👑 Administrateur - Changement de Mot de Passe (ChangePassword)
- **En tant qu'administrateur**, je veux changer le mot de passe d'un utilisateur de manière sécurisée
- **En tant qu'administrateur**, je veux vérifier le mot de passe actuel avant modification
- **En tant qu'administrateur**, je veux confirmer le nouveau mot de passe pour éviter les erreurs
- **En tant qu'administrateur**, je veux voir/masquer les mots de passe avec des icônes d'œil
- **En tant qu'administrateur**, je veux voir des conseils de sécurité pour les mots de passe
- **En tant qu'administrateur**, je veux valider la longueur minimale du mot de passe

### 👨🏫 Enseignant - Gestion d'Élèves
- **En tant qu'enseignant**, je veux voir uniquement mes élèves dans la liste des utilisateurs
- **En tant qu'enseignant**, je veux créer des comptes pour mes nouveaux élèves
- **En tant qu'enseignant**, je veux modifier les informations de mes élèves
- **En tant qu'enseignant**, je veux assigner des parents à mes élèves pour faciliter la communication
- **En tant qu'enseignant**, je veux voir les détails de mes élèves avec leurs relations familiales

### 👨👩👧👦 Parent - Consultation de Profils
- **En tant que parent**, je veux voir les profils de mes enfants avec leurs informations scolaires
- **En tant que parent**, je veux voir les enseignants responsables de mes enfants
- **En tant que parent**, je veux modifier mon propre profil et mot de passe

### 🎓 Élève - Gestion Personnelle
- **En tant qu'élève**, je veux voir mon profil personnel avec mes informations
- **En tant qu'élève**, je veux changer mon mot de passe pour sécuriser mon compte
- **En tant qu'élève**, je veux voir mes relations (parent, classe) dans mon profil

---

## Module Gestion Classes

### 👑 Administrateur - Liste des Classes (ClassesList)
- **En tant qu'administrateur**, je veux voir la liste complète des classes avec nom, niveau, enseignant responsable et nombre d'élèves
- **En tant qu'administrateur**, je veux rechercher et filtrer les classes par nom ou niveau pour une gestion efficace
- **En tant qu'administrateur**, je veux voir la date de création de chaque classe pour le suivi historique
- **En tant qu'administrateur**, je veux accéder rapidement aux actions (voir, modifier, supprimer) pour chaque classe
- **En tant qu'administrateur**, je veux créer une nouvelle classe depuis la liste

### 👑 Administrateur - Création de Classe (CreateClass)
- **En tant qu'administrateur**, je veux créer des classes scolaires avec nom de classe (ex: 6ème A, CP1)
- **En tant qu'administrateur**, je veux définir le niveau de la classe (Primaire, Secondaire)
- **En tant qu'administrateur**, je veux assigner un enseignant responsable ou laisser non assigné
- **En tant qu'administrateur**, je veux voir la liste des enseignants disponibles lors de l'assignation
- **En tant qu'administrateur**, je veux être redirigé vers la création d'enseignant si aucun n'est disponible
- **En tant qu'administrateur**, je veux valider les champs obligatoires avant la création

### 👑 Administrateur - Détail de Classe (ClassDetail)
- **En tant qu'administrateur**, je veux voir toutes les informations détaillées de la classe (nom, niveau, enseignant, dates)
- **En tant qu'administrateur**, je veux voir la liste complète des élèves assignés avec leurs informations
- **En tant qu'administrateur**, je veux accéder rapidement au profil de chaque élève
- **En tant qu'administrateur**, je veux modifier ou supprimer la classe depuis la vue détail
- **En tant qu'administrateur**, je veux assigner de nouveaux élèves à la classe
- **En tant qu'administrateur**, je veux voir un avatar coloré pour identifier visuellement la classe

### 👑 Administrateur - Modification de Classe (EditClass)
- **En tant qu'administrateur**, je veux modifier le nom de la classe pour corriger ou mettre à jour
- **En tant qu'administrateur**, je veux changer le niveau de la classe si nécessaire
- **En tant qu'administrateur**, je veux réassigner un enseignant responsable ou retirer l'assignation
- **En tant qu'administrateur**, je veux voir les données actuelles pré-remplies dans le formulaire
- **En tant qu'administrateur**, je veux valider les modifications avant sauvegarde
- **En tant qu'administrateur**, je veux être redirigé vers le détail après modification réussie

### 👑 Administrateur - Assignation d'Élèves (AssignStudents)
- **En tant qu'administrateur**, je veux voir tous les élèves non encore assignés à une classe
- **En tant qu'administrateur**, je veux sélectionner plusieurs élèves à la fois pour assignation groupée
- **En tant qu'administrateur**, je veux voir les informations de chaque élève (nom, prénom, email) avant assignation
- **En tant qu'administrateur**, je veux voir le nombre d'élèves sélectionnés en temps réel
- **En tant qu'administrateur**, je veux être informé s'il n'y a aucun élève disponible
- **En tant qu'administrateur**, je veux accéder à la création d'élève si nécessaire
- **En tant qu'administrateur**, je veux confirmer l'assignation avec le nombre d'élèves sélectionnés

### 👨🏫 Enseignant - Consultation de Classes
- **En tant qu'enseignant**, je veux voir uniquement les classes dont je suis responsable
- **En tant qu'enseignant**, je veux voir les détails de mes classes avec la liste complète des élèves
- **En tant qu'enseignant**, je veux accéder au profil de mes élèves pour personnaliser les rappels
- **En tant qu'enseignant**, je veux voir les statistiques d'hygiène de mes classes

### 👨👩👧👦 Parent - Consultation de Classes
- **En tant que parent**, je veux voir les classes de mes enfants avec les informations de l'enseignant
- **En tant que parent**, je veux connaître le niveau et les camarades de classe de mes enfants

### 🎓 Élève - Consultation de Classe
- **En tant qu'élève**, je veux voir les informations de ma classe et mon enseignant
- **En tant qu'élève**, je veux voir la liste de mes camarades de classe

---

## Module Rappels d'Hygiène

### 👑 Administrateur
- **En tant qu'administrateur**, je veux créer des rappels globaux pour toute l'école avec catégories prédéfinies
- **En tant qu'administrateur**, je veux modifier tous les rappels existants pour les adapter aux besoins
- **En tant qu'administrateur**, je veux désactiver des rappels obsolètes pour maintenir la pertinence
- **En tant qu'administrateur**, je veux voir l'historique complet des rappels pour analyser les tendances
- **En tant qu'administrateur**, je veux assigner des rappels à des utilisateurs individuels ou des classes entières

### 👨🏫 Enseignant
- **En tant qu'enseignant**, je veux créer des rappels d'hygiène personnalisés pour mes élèves avec titre, description, récurrence
- **En tant qu'enseignant**, je veux modifier mes rappels existants pour les améliorer selon les retours
- **En tant qu'enseignant**, je veux assigner des rappels à toute ma classe en une fois pour gagner du temps
- **En tant qu'enseignant**, je veux assigner des rappels individuels aux élèves ayant des besoins spécifiques
- **En tant qu'enseignant**, je veux voir uniquement mes rappels créés avec leurs assignations

### 👨👩👧👦 Parent
- **En tant que parent**, je veux voir tous les rappels d'hygiène assignés à mes enfants pour renforcer ces habitudes à la maison
- **En tant que parent**, je veux voir l'historique des rappels de mes enfants pour comprendre leur évolution

### 🎓 Élève
- **En tant qu'élève**, je veux voir mes rappels d'hygiène personnels avec les détails (heure, description, catégorie)
- **En tant qu'élève**, je veux voir des rappels adaptés à mon âge et ma classe

---

## Module Notifications

### 👑 Administrateur - Centre de Notifications (NotificationCenter)
- **En tant qu'administrateur**, je veux voir les statistiques complètes des notifications (total, en attente, envoyées, lues, échouées)
- **En tant qu'administrateur**, je veux voir des métriques visuelles avec icônes et couleurs pour chaque statut
- **En tant qu'administrateur**, je veux gérer les permissions de notifications du navigateur
- **En tant qu'administrateur**, je veux voir le statut des permissions (accordées, refusées, non demandées)
- **En tant qu'administrateur**, je veux demander l'autorisation des notifications si nécessaire
- **En tant qu'administrateur**, je veux tester manuellement les notifications pour vérifier le bon fonctionnement
- **En tant qu'administrateur**, je veux démarrer le planificateur de notifications automatiques
- **En tant qu'administrateur**, je veux voir le statut du Service Worker (actif/inactif)
- **En tant qu'administrateur**, je veux installer l'application PWA si disponible
- **En tant qu'administrateur**, je veux voir l'historique des 50 dernières notifications avec détails
- **En tant qu'administrateur**, je veux voir les horodatages de programmation, envoi et lecture
- **En tant qu'administrateur**, je veux voir les icônes de statut pour identifier rapidement l'état
- **En tant qu'administrateur**, je veux voir les badges colorés pour différencier les statuts

### 👑 Administrateur - Service de Notifications (NotificationService)
- **En tant qu'administrateur**, je veux que les notifications soient automatiquement programmées depuis les rappels
- **En tant qu'administrateur**, je veux que les notifications respectent la récurrence des rappels (quotidien, hebdomadaire, mensuel)
- **En tant qu'administrateur**, je veux que les notifications soient envoyées aux utilisateurs et classes assignés
- **En tant qu'administrateur**, je veux que les notifications calculent automatiquement la prochaine occurrence
- **En tant qu'administrateur**, je veux que les notifications échouées soient marquées comme telles
- **En tant qu'administrateur**, je veux que les notifications soient marquées comme lues lors du clic
- **En tant qu'administrateur**, je veux que le planificateur traite les notifications en attente automatiquement
- **En tant qu'administrateur**, je veux que les notifications en arrière-plan fonctionnent via Service Worker

### 👑 Administrateur - Service PWA (PWAService)
- **En tant qu'administrateur**, je veux que le Service Worker soit enregistré automatiquement
- **En tant qu'administrateur**, je veux que les permissions push soient gérées correctement
- **En tant qu'administrateur**, je veux détecter si l'application est installable en PWA
- **En tant qu'administrateur**, je veux vérifier les mises à jour de l'application
- **En tant qu'administrateur**, je veux activer les mises à jour automatiquement
- **En tant qu'administrateur**, je veux que les messages du Service Worker soient traités

### 👨🏫 Enseignant - Notifications Personnalisées
- **En tant qu'enseignant**, je veux recevoir des notifications pour les rappels que j'ai créés
- **En tant qu'enseignant**, je veux voir les notifications liées à mes classes dans l'historique
- **En tant qu'enseignant**, je veux que mes rappels génèrent automatiquement des notifications
- **En tant qu'enseignant**, je veux voir les statistiques de notifications de mes rappels

### 👨👩👧👦 Parent - Notifications Familiales
- **En tant que parent**, je veux recevoir des notifications pour les rappels assignés à mes enfants
- **En tant que parent**, je veux voir l'historique des notifications concernant mes enfants
- **En tant que parent**, je veux que les notifications m'aident à renforcer les habitudes à la maison
- **En tant que parent**, je veux gérer mes préférences de notification dans le navigateur

### 🎓 Élève - Notifications Personnelles
- **En tant qu'élève**, je veux recevoir des notifications pour mes rappels d'hygiène personnels
- **En tant qu'élève**, je veux que les notifications m'aident à ne pas oublier mes habitudes
- **En tant qu'élève**, je veux voir l'historique de mes notifications personnelles
- **En tant qu'élève**, je veux que les notifications soient adaptées à mon âge et ma classe

### 🔄 Fonctionnalités Transversales - Notifications
- **En tant qu'utilisateur**, je veux recevoir des notifications même quand l'application est fermée (Service Worker)
- **En tant qu'utilisateur**, je veux que les notifications apparaissent avec icône et actions interactives
- **En tant qu'utilisateur**, je veux marquer les notifications comme lues en cliquant dessus
- **En tant qu'utilisateur**, je veux que les notifications respectent les permissions de mon navigateur
- **En tant qu'utilisateur**, je veux que les notifications soient programmées selon la récurrence définie
- **En tant qu'utilisateur**, je veux que les notifications échouées soient retryées automatiquement

---

## Module Programmation/Événements

### 👑 Administrateur - Liste des Événements (EventsPage)
- **En tant qu'administrateur**, je veux voir la liste complète des événements avec titre, statut, type, dates et responsable
- **En tant qu'administrateur**, je veux rechercher des événements par titre ou description pour trouver rapidement
- **En tant qu'administrateur**, je veux filtrer les événements par statut (Planifié, En cours, Terminé, Annulé)
- **En tant qu'administrateur**, je veux filtrer les événements par type (Sensibilisation, Formation, Contrôle, Activité collective, Personnalisé)
- **En tant qu'administrateur**, je veux basculer entre vue liste et vue calendrier pour différentes perspectives
- **En tant qu'administrateur**, je veux voir les informations détaillées de chaque événement (dates, heures, lieu, responsable)
- **En tant qu'administrateur**, je veux accéder rapidement au détail de chaque événement
- **En tant qu'administrateur**, je veux créer un nouvel événement depuis la liste
- **En tant qu'administrateur**, je veux voir des badges colorés pour identifier rapidement le statut et type

### 👑 Administrateur - Création d'Événement (CreateEvent)
- **En tant qu'administrateur**, je veux créer des événements avec titre et description détaillée
- **En tant qu'administrateur**, je veux définir le type d'activité (Sensibilisation, Formation, Contrôle, Activité collective, Personnalisé)
- **En tant qu'administrateur**, je veux programmer les dates de début et fin avec heures précises
- **En tant qu'administrateur**, je veux spécifier le lieu de l'événement
- **En tant qu'administrateur**, je veux assigner un enseignant responsable depuis la liste disponible
- **En tant qu'administrateur**, je veux définir le statut initial (Planifié, En cours, Terminé, Annulé)
- **En tant qu'administrateur**, je veux sélectionner les classes concernées par l'événement
- **En tant qu'administrateur**, je veux valider les champs obligatoires avant création
- **En tant qu'administrateur**, je veux être redirigé vers la liste après création réussie

### 👑 Administrateur - Détail d'Événement (EventDetail)
- **En tant qu'administrateur**, je veux voir toutes les informations détaillées de l'événement
- **En tant qu'administrateur**, je veux voir la description complète et les informations temporelles
- **En tant qu'administrateur**, je veux voir les dates formatées avec jour de la semaine complet
- **En tant qu'administrateur**, je veux voir les heures de début et fin clairement affichées
- **En tant qu'administrateur**, je veux voir le lieu et le responsable assigné
- **En tant qu'administrateur**, je veux voir la liste des classes concernées avec leurs niveaux
- **En tant qu'administrateur**, je veux voir les métadonnées (dates de création et modification)
- **En tant qu'administrateur**, je veux modifier l'événement depuis la vue détail
- **En tant qu'administrateur**, je veux supprimer l'événement avec confirmation
- **En tant qu'administrateur**, je veux voir des badges colorés pour statut et type

### 👨🏫 Enseignant - Gestion d'Événements
- **En tant qu'enseignant**, je veux voir uniquement les événements dont je suis responsable
- **En tant qu'enseignant**, je veux créer des événements d'hygiène pour mes classes
- **En tant qu'enseignant**, je veux programmer des activités de sensibilisation, formation ou contrôle
- **En tant qu'enseignant**, je veux assigner mes événements aux classes dont je suis responsable
- **En tant qu'enseignant**, je veux modifier mes événements pour ajuster les détails
- **En tant qu'enseignant**, je veux voir le détail complet de mes événements
- **En tant qu'enseignant**, je veux filtrer et rechercher dans mes événements

### 👨👩👧👦 Parent - Consultation d'Événements
- **En tant que parent**, je veux voir les événements d'hygiène programmés pour les classes de mes enfants
- **En tant que parent**, je veux voir les détails des événements (date, heure, lieu, type) pour préparer mes enfants
- **En tant que parent**, je veux voir le responsable de chaque événement pour contact si nécessaire
- **En tant que parent**, je veux filtrer les événements par type pour identifier ceux qui concernent mes enfants

### 🎓 Élève - Consultation d'Événements
- **En tant qu'élève**, je veux voir les événements d'hygiène programmés pour ma classe
- **En tant qu'élève**, je veux voir les détails des événements (date, heure, lieu) pour m'y préparer
- **En tant qu'élève**, je veux voir le type d'activité pour comprendre ce qui m'attend
- **En tant qu'élève**, je veux voir mon enseignant responsable pour chaque événement

---

## Module Rapports & Analytics

### 👑 Administrateur - Rapports Globaux (ReportsPage)
- **En tant qu'administrateur**, je veux voir des métriques principales avec icônes colorées (rappels actifs, taux d'envoi, taux de lecture, utilisateurs)
- **En tant qu'administrateur**, je veux analyser tous les rappels, notifications et utilisateurs du système
- **En tant qu'administrateur**, je veux voir la répartition des rappels par catégorie avec barres de progression
- **En tant qu'administrateur**, je veux voir les statuts des rappels (Actif, Inactif, Terminé) avec couleurs différenciées
- **En tant qu'administrateur**, je veux voir la répartition des utilisateurs par type (Élève, Parent, Enseignant)
- **En tant qu'administrateur**, je veux analyser la performance des notifications (envoyées, lues, échouées, en attente)
- **En tant qu'administrateur**, je veux calculer automatiquement les pourcentages et taux de réussite
- **En tant qu'administrateur**, je veux filtrer les données par période (7, 30, 90 jours, 1 an)
- **En tant qu'administrateur**, je veux exporter les rapports complets en JSON avec horodatage
- **En tant qu'administrateur**, je veux recevoir des recommandations d'amélioration basées sur les seuils de performance
- **En tant qu'administrateur**, je veux voir des alertes visuelles quand les métriques sont sous les seuils optimaux

### 👨🏫 Enseignant - Rapports Pédagogiques (ReportsPage)
- **En tant qu'enseignant**, je veux voir uniquement les données de mes rappels créés et mes élèves
- **En tant qu'enseignant**, je veux analyser l'efficacité de mes rappels d'hygiène personnalisés
- **En tant qu'enseignant**, je veux voir les statistiques de mes classes avec taux d'engagement
- **En tant qu'enseignant**, je veux voir la répartition de mes rappels par catégorie
- **En tant qu'enseignant**, je veux identifier les élèves avec faible taux de lecture des notifications
- **En tant qu'enseignant**, je veux voir les métriques de mes élèves et leurs parents
- **En tant qu'enseignant**, je veux exporter les rapports de mes classes pour les réunions
- **En tant qu'enseignant**, je veux recevoir des conseils pour améliorer l'engagement de mes élèves
- **En tant qu'enseignant**, je veux filtrer les données par période pour analyser les tendances

### 👨👩👧👦 Parent - Rapports Familiaux (ReportsPage)
- **En tant que parent**, je veux voir les statistiques d'hygiène de mes enfants uniquement
- **En tant que parent**, je veux voir les rappels assignés à mes enfants par catégorie
- **En tant que parent**, je veux voir le taux de lecture des notifications de mes enfants
- **En tant que parent**, je veux suivre les progrès de mes enfants sur différentes périodes
- **En tant que parent**, je veux voir les recommandations pour encourager mes enfants
- **En tant que parent**, je veux exporter les données de mes enfants pour suivi personnel
- **En tant que parent**, je veux voir des métriques adaptées au contexte familial

### 🎓 Élève - Rapports Personnels (ReportsPage)
- **En tant qu'élève**, je veux voir mes propres statistiques d'hygiène personnelles
- **En tant qu'élève**, je veux voir mes rappels par catégorie pour comprendre mes habitudes
- **En tant qu'élève**, je veux voir mon taux de lecture des notifications pour m'améliorer
- **En tant qu'élève**, je veux suivre ma progression sur différentes périodes
- **En tant qu'élève**, je veux recevoir des conseils personnalisés pour m'améliorer
- **En tant qu'élève**, je veux voir des métriques motiv antes adaptées à mon âge

### 📊 Fonctionnalités Transversales - Analytics
- **En tant qu'utilisateur**, je veux voir des graphiques visuels avec barres de progression colorées
- **En tant qu'utilisateur**, je veux voir des pourcentages calculés automatiquement
- **En tant qu'utilisateur**, je veux filtrer les données par période selon mes besoins
- **En tant qu'utilisateur**, je veux exporter mes données pertinentes en JSON
- **En tant qu'utilisateur**, je veux voir des recommandations basées sur mes métriques
- **En tant qu'utilisateur**, je veux que les rapports se chargent rapidement avec indicateur de progression
- **En tant qu'utilisateur**, je veux voir des alertes visuelles pour les métriques importantes
- **En tant qu'utilisateur**, je veux que les couleurs et icônes soient cohérentes avec le thème

---

## Module Administration

### 👑 Administrateur - Gestionnaire de Données (DataManager)
- **En tant qu'administrateur**, je veux exporter toutes les données **depuis IndexedDB local** en JSON
- **En tant qu'administrateur**, je veux importer des données depuis un fichier JSON **avec validation et sauvegarde locale**
- **En tant qu'administrateur**, je veux voir les statistiques **des deux bases de données** (IndexedDB local + Supabase cloud)
- **En tant qu'administrateur**, je veux initialiser la base **locale et cloud** avec des données de test réalistes
- **En tant qu'administrateur**, je veux synchroniser manuellement **les données locales vers le cloud**
- **En tant qu'administrateur**, je veux résoudre les conflits **entre données locales et cloud**

### 👑 Administrateur - Statut Système (SystemStatus)
- **En tant qu'administrateur**, je veux surveiller l'utilisation du stockage **IndexedDB local et Supabase cloud**
- **En tant qu'administrateur**, je veux voir les métriques de performance **des opérations offline et sync**
- **En tant qu'administrateur**, je veux vérifier l'intégrité des relations **dans les deux bases de données**
- **En tant qu'administrateur**, je veux voir les indicateurs de santé **du système hybride offline-first**
- **En tant qu'administrateur**, je veux monitorer **le statut de synchronisation en temps réel**
- **En tant qu'administrateur**, je veux voir **la queue des opérations en attente**
- **En tant qu'administrateur**, je veux diagnostiquer **les problèmes de connectivité et sync**

### 👑 Administrateur - Gestionnaire de Sauvegarde (BackupManager)
- **En tant qu'administrateur**, je veux configurer des sauvegardes automatiques **des données IndexedDB locales** (quotidienne, hebdomadaire, mensuelle)
- **En tant qu'administrateur**, je veux créer des sauvegardes manuelles **complètes (local + cloud)** à tout moment
- **En tant qu'administrateur**, je veux restaurer le système **depuis une sauvegarde locale ou cloud**
- **En tant qu'administrateur**, je veux gérer l'espace de stockage **local avec rotation automatique**
- **En tant qu'administrateur**, je veux télécharger des sauvegardes **JSON pour stockage externe**
- **En tant qu'administrateur**, je veux que les sauvegardes **fonctionnent même hors ligne**
- **En tant qu'administrateur**, je veux synchroniser les sauvegardes **avec le cloud quand disponible**

### 👑 Administrateur - Gestionnaire de Synchronisation (OfflineService)
- **En tant qu'administrateur**, je veux configurer la synchronisation **automatique avec Supabase** (URL, clés API)
- **En tant qu'administrateur**, je veux tester la connexion cloud **avant activation de la sync**
- **En tant qu'administrateur**, je veux voir le statut de synchronisation **en temps réel dans l'interface**
- **En tant qu'administrateur**, je veux gérer les conflits **avec résolution automatique ou manuelle**
- **En tant qu'administrateur**, je veux voir l'historique **des synchronisations et opérations en attente**
- **En tant qu'administrateur**, je veux forcer une synchronisation **complète bidirectionnelle**
- **En tant qu'administrateur**, je veux configurer **la fréquence de synchronisation automatique**
- **En tant qu'administrateur**, je veux voir **les métriques de performance de sync**

---

## Enseignant

### Création de Contenu
- **En tant qu'enseignant**, je veux créer des rappels d'hygiène personnalisés pour mes élèves afin d'adapter les messages à leurs besoins spécifiques
- **En tant qu'enseignant**, je veux modifier mes rappels existants pour les améliorer selon les retours
- **En tant qu'enseignant**, je veux dupliquer des rappels efficaces pour gagner du temps
- **En tant qu'enseignant**, je veux programmer des rappels récurrents pour automatiser les bonnes pratiques

### Gestion de Classe
- **En tant qu'enseignant**, je veux assigner des rappels à toute ma classe en une fois pour gagner du temps
- **En tant qu'enseignant**, je veux assigner des rappels individuels aux élèves ayant des besoins spécifiques
- **En tant qu'enseignant**, je veux voir la liste de mes élèves pour gérer les assignations
- **En tant qu'enseignant**, je veux consulter les profils de mes élèves pour personnaliser les rappels

### Suivi et Rapports
- **En tant qu'enseignant**, je veux voir les statistiques de mes classes pour évaluer l'engagement de mes élèves
- **En tant qu'enseignant**, je veux recevoir des notifications sur l'activité de mes élèves pour suivre leur progression
- **En tant qu'enseignant**, je veux générer des rapports de classe pour les réunions parents-enseignants
- **En tant qu'enseignant**, je veux identifier les élèves nécessitant plus d'attention en hygiène

### Événements et Programmation
- **En tant qu'enseignant**, je veux programmer des événements d'hygiène pour organiser des activités de sensibilisation
- **En tant qu'enseignant**, je veux créer des événements récurrents pour les activités régulières
- **En tant qu'enseignant**, je veux inviter d'autres classes à mes événements pour favoriser la collaboration
- **En tant qu'enseignant**, je veux suivre la participation aux événements pour mesurer l'engagement

### Gestion des Utilisateurs (Limitée)
- **En tant qu'enseignant**, je veux créer des comptes pour mes nouveaux élèves
- **En tant qu'enseignant**, je veux modifier les informations de mes élèves
- **En tant qu'enseignant**, je veux assigner des parents à mes élèves pour faciliter la communication

---

## Parent

### Suivi des Enfants
- **En tant que parent**, je veux voir tous les rappels d'hygiène de mes enfants pour renforcer ces habitudes à la maison
- **En tant que parent**, je veux recevoir des notifications sur les activités d'hygiène de mes enfants pour les encourager
- **En tant que parent**, je veux consulter les statistiques de mes enfants pour suivre leurs progrès en hygiène
- **En tant que parent**, je veux voir l'historique des rappels de mes enfants pour comprendre leur évolution

### Communication École-Famille
- **En tant que parent**, je veux être informé des événements d'hygiène à l'école pour préparer mes enfants
- **En tant que parent**, je veux recevoir des conseils d'hygiène adaptés à l'âge de mes enfants
- **En tant que parent**, je veux connaître les enseignants responsables de mes enfants
- **En tant que parent**, je veux être alerté en cas de problème d'hygiène de mes enfants

### Gestion du Profil
- **En tant que parent**, je veux accéder au profil de mes enfants pour vérifier leurs informations
- **En tant que parent**, je veux mettre à jour mes informations de contact pour rester joignable
- **En tant que parent**, je veux changer mon mot de passe pour sécuriser mon compte
- **En tant que parent**, je veux gérer mes préférences de notification

### Engagement Familial
- **En tant que parent**, je veux voir des suggestions d'activités d'hygiène à faire en famille
- **En tant que parent**, je veux suivre les progrès de tous mes enfants sur un tableau de bord unifié
- **En tant que parent**, je veux recevoir des rappels pour soutenir les habitudes d'hygiène à la maison

---

## Élève

### Rappels Personnels
- **En tant qu'élève**, je veux voir mes rappels d'hygiène personnels pour savoir quand et comment prendre soin de moi
- **En tant qu'élève**, je veux recevoir des notifications pour ne pas oublier mes habitudes d'hygiène
- **En tant qu'élève**, je veux marquer mes rappels comme terminés pour suivre mes progrès
- **En tant qu'élève**, je veux voir des rappels adaptés à mon âge et ma classe

### Profil et Statistiques
- **En tant qu'élève**, je veux consulter mon profil pour vérifier mes informations personnelles
- **En tant qu'élève**, je veux voir mes statistiques d'hygiène pour suivre mes progrès
- **En tant qu'élève**, je veux voir mon classement par rapport à ma classe pour me motiver
- **En tant qu'élève**, je veux recevoir des félicitations pour mes bonnes habitudes

### Participation aux Événements
- **En tant qu'élève**, je veux être informé des événements d'hygiène pour y participer
- **En tant qu'élève**, je veux voir le calendrier des activités d'hygiène de ma classe
- **En tant qu'élève**, je veux recevoir des rappels avant les événements importants

### Sécurité et Autonomie
- **En tant qu'élève**, je veux changer mon mot de passe pour protéger mon compte
- **En tant qu'élève**, je veux signaler un problème technique à mon enseignant
- **En tant qu'élève**, je veux accéder à l'aide en cas de difficulté avec l'application

---

## Module Authentification & Profil

### 🔐 Connexion (Login.tsx)
- **En tant qu'utilisateur**, je veux me connecter avec email et mot de passe via Supabase de manière sécurisée
- **En tant qu'utilisateur**, je veux voir/masquer mon mot de passe avec une icône d'œil
- **En tant qu'utilisateur**, je veux voir des messages d'erreur clairs en cas d'échec de connexion
- **En tant qu'utilisateur**, je veux voir un indicateur de chargement pendant la connexion
- **En tant qu'utilisateur**, je veux accéder au toggle de thème depuis la page de connexion
- **En tant qu'utilisateur**, je veux voir le logo et la description de l'application GAI
- **En tant qu'utilisateur**, je veux être redirigé vers le tableau de bord après connexion réussie
- **En tant qu'utilisateur**, je veux que la page de connexion soit responsive (mobile/desktop)
- **En tant qu'utilisateur**, je veux que ma session soit persistée dans localStorage

### 👤 Profil Utilisateur (ProfilePage.tsx)
- **En tant qu'utilisateur**, je veux voir mes informations personnelles (nom, prénom, email, type)
- **En tant qu'utilisateur**, je veux voir un avatar coloré avec mes initiales
- **En tant qu'utilisateur**, je veux changer mon mot de passe de manière sécurisée
- **En tant qu'utilisateur**, je veux vérifier mon mot de passe actuel avant modification
- **En tant qu'utilisateur**, je veux confirmer mon nouveau mot de passe pour éviter les erreurs
- **En tant qu'utilisateur**, je veux voir/masquer les mots de passe avec des icônes d'œil
- **En tant qu'utilisateur**, je veux voir des conseils de sécurité pour les mots de passe
- **En tant qu'utilisateur**, je veux voir des messages de succès/erreur lors du changement
- **En tant qu'utilisateur**, je veux annuler le changement de mot de passe si nécessaire
- **En tant qu'administrateur**, je veux pouvoir changer mon mot de passe sans vérification de l'ancien

---

## Module Navigation & Layout

### 🏠 Layout Principal (Layout.tsx)
- **En tant qu'utilisateur**, je veux une sidebar de navigation avec tous les modules accessibles
- **En tant qu'utilisateur**, je veux voir les sections organisées (Navigation, Gestion, Administration)
- **En tant qu'utilisateur**, je veux voir l'indication visuelle de la page active avec couleur et bordure
- **En tant qu'utilisateur**, je veux accéder à mon profil depuis le header avec mes informations
- **En tant qu'utilisateur**, je veux me déconnecter facilement avec un bouton dédié
- **En tant qu'utilisateur**, je veux voir l'heure actuelle dans le header
- **En tant qu'utilisateur**, je veux basculer entre thème clair/sombre depuis le header
- **En tant qu'utilisateur**, je veux une navigation responsive avec menu hamburger sur mobile
- **En tant qu'utilisateur**, je veux voir le titre de la page actuelle dans le header
- **En tant qu'utilisateur**, je veux que la sidebar se ferme automatiquement sur mobile après navigation
- **En tant qu'utilisateur**, je veux voir mon rôle (badge) à côté de mon nom
- **En tant qu'utilisateur**, je veux accéder uniquement aux modules autorisés selon mes permissions

### 🛣️ Routing & Permissions (App.tsx)
- **En tant qu'utilisateur**, je veux être redirigé vers la connexion si non authentifié
- **En tant qu'utilisateur**, je veux accéder uniquement aux routes autorisées selon mes permissions
- **En tant qu'utilisateur**, je veux que l'application initialise le Service Worker au démarrage
- **En tant qu'utilisateur**, je veux que toutes les pages soient protégées par authentification
- **En tant qu'administrateur**, je veux accéder à toutes les fonctionnalités d'administration
- **En tant qu'enseignant**, je veux accéder aux modules de gestion pédagogique
- **En tant que parent/élève**, je veux accéder aux modules de consultation personnelle
- **En tant qu'utilisateur**, je veux que les contextes (Auth, Theme) soient disponibles globalement

---

## Module Offline & Synchronisation

### 🔄 Service Offline (OfflineService)
- **En tant qu'utilisateur**, je veux que toutes mes actions **fonctionnent immédiatement même hors ligne**
- **En tant qu'utilisateur**, je veux voir **l'indicateur de statut réseau** (online/offline) dans le header
- **En tant qu'utilisateur**, je veux que mes modifications **soient mises en queue automatiquement** quand hors ligne
- **En tant qu'utilisateur**, je veux que la synchronisation **se fasse automatiquement** au retour en ligne
- **En tant qu'utilisateur**, je veux voir **les opérations en attente de synchronisation**
- **En tant qu'utilisateur**, je veux être notifié **des conflits de synchronisation**
- **En tant qu'utilisateur**, je veux que les données **se synchronisent en temps réel** entre navigateurs

### 💾 Cache Local (IndexedDBService)
- **En tant qu'utilisateur**, je veux que mes données **soient toujours disponibles localement**
- **En tant qu'utilisateur**, je veux des **performances ultra-rapides** pour toutes les opérations
- **En tant qu'utilisateur**, je veux que le cache local **soit intelligent et optimisé**
- **En tant qu'utilisateur**, je veux que les relations **soient maintenues en local**
- **En tant qu'utilisateur**, je veux que les recherches **soient instantanées**
- **En tant qu'utilisateur**, je veux que le stockage local **soit géré automatiquement**

### ☁️ Synchronisation Cloud (Supabase)
- **En tant qu'utilisateur**, je veux accéder à mes données **depuis plusieurs appareils**
- **En tant qu'utilisateur**, je veux que mes données **soient sauvegardées dans le cloud**
- **En tant qu'utilisateur**, je veux collaborer **en temps réel avec d'autres utilisateurs**
- **En tant qu'utilisateur**, je veux que la synchronisation **soit transparente et automatique**
- **En tant qu'utilisateur**, je veux être informé **des mises à jour d'autres utilisateurs**
- **En tant qu'utilisateur**, je veux que mes données **soient sécurisées dans le cloud**

### 📱 Indicateur Offline (OfflineIndicator)
- **En tant qu'utilisateur**, je veux voir **clairement mon statut de connexion**
- **En tant qu'utilisateur**, je veux voir **le nombre d'opérations en attente**
- **En tant qu'utilisateur**, je veux voir **l'état de la synchronisation**
- **En tant qu'utilisateur**, je veux être alerté **des problèmes de connexion**
- **En tant qu'utilisateur**, je veux pouvoir **forcer une synchronisation manuelle**

---

## Stories Transversales

### Authentification et Sécurité
- **En tant qu'utilisateur**, je veux me connecter de manière sécurisée **avec authentification hybride locale/cloud**
- **En tant qu'utilisateur**, je veux me déconnecter pour protéger ma session **avec nettoyage du cache local**
- **En tant qu'utilisateur**, je veux que mes données soient sécurisées **localement et dans le cloud Supabase**
- **En tant qu'utilisateur**, je veux récupérer mon mot de passe via l'administrateur **même hors ligne**
- **En tant qu'utilisateur**, je veux que mes permissions **soient respectées offline et online**

### Interface et Expérience Utilisateur
- **En tant qu'utilisateur**, je veux une interface adaptée à mon appareil **avec performance offline optimale**
- **En tant qu'utilisateur**, je veux choisir entre le thème clair et sombre **sauvegardé localement**
- **En tant qu'utilisateur**, je veux naviguer facilement **même sans connexion internet**
- **En tant qu'utilisateur**, je veux recevoir des confirmations **pour les actions importantes et la synchronisation**
- **En tant qu'utilisateur**, je veux voir **l'état de synchronisation de mes actions**
- **En tant qu'utilisateur**, je veux une **expérience fluide identique online/offline**

### Notifications et Rappels
- **En tant qu'utilisateur**, je veux recevoir des notifications **générées localement et synchronisées** cross-browser
- **En tant qu'utilisateur**, je veux que les notifications **fonctionnent même hors ligne** via Service Worker
- **En tant qu'utilisateur**, je veux voir l'historique **complet local et synchronisé** dans le centre de notifications
- **En tant qu'utilisateur**, je veux tester les notifications **avec système offline-first**
- **En tant qu'utilisateur**, je veux que les notifications **se synchronisent automatiquement** entre appareils
- **En tant qu'utilisateur**, je veux que le planificateur **fonctionne en mode offline**
- **En tant qu'utilisateur**, je veux que les notifications fonctionnent sur tous mes appareils connectés

### Performance et Fiabilité
- **En tant qu'utilisateur**, je veux que l'application fonctionne avec une connexion internet pour accéder aux données Supabase
- **En tant qu'utilisateur**, je veux que l'application se charge rapidement
- **En tant qu'utilisateur**, je veux que mes données soient sauvegardées automatiquement dans Supabase
- **En tant qu'utilisateur**, je veux pouvoir installer l'application PWA sur mon appareil

### Accessibilité et Inclusion
- **En tant qu'utilisateur malvoyant**, je veux que l'application soit compatible avec les lecteurs d'écran
- **En tant qu'utilisateur**, je veux des contrastes suffisants pour une bonne lisibilité
- **En tant qu'utilisateur non-francophone**, je veux une interface claire et intuitive
- **En tant qu'utilisateur débutant**, je veux des guides et de l'aide contextuelle

### Données et Synchronisation
- **En tant qu'utilisateur**, je veux exporter mes données personnelles depuis Supabase
- **En tant qu'utilisateur**, je veux que mes données soient automatiquement synchronisées entre tous mes appareils
- **En tant qu'utilisateur**, je veux accéder à mes données depuis n'importe quel navigateur
- **En tant qu'utilisateur**, je veux que toutes mes données soient stockées de manière sécurisée dans le cloud

---

## Critères d'Acceptation Généraux

### Pour chaque User Story
- **Fonctionnalité** : La fonctionnalité fonctionne comme décrite
- **Interface** : L'interface est intuitive et responsive
- **Performance** : L'action se termine en moins de 3 secondes
- **Sécurité** : Les permissions sont respectées selon le rôle
- **Accessibilité** : Compatible avec les standards d'accessibilité
- **Offline** : Fonctionne sans connexion internet
- **Notifications** : Les notifications appropriées sont envoyées
- **Validation** : Les données sont validées avant sauvegarde
- **Erreurs** : Les erreurs sont gérées avec des messages clairs
- **Mobile** : Fonctionne correctement sur mobile et desktop

### Métriques de Succès
- **Adoption** : 90% des utilisateurs utilisent l'application régulièrement
- **Engagement** : 80% des rappels sont consultés dans les 24h
- **Satisfaction** : Note moyenne de 4.5/5 dans les retours utilisateurs
- **Performance** : Temps de chargement < 3 secondes
- **Fiabilité** : 99% de disponibilité de l'application
- **Sécurité** : 0 incident de sécurité majeur

---

## Priorisation des Stories

### Priorité 1 (MVP) ✅ TERMINÉ
- Authentification et gestion des rôles
- CRUD utilisateurs, classes, rappels
- Notifications de base
- Interface responsive

### Priorité 2 (Fonctionnalités Avancées) ✅ TERMINÉ
- Statistiques et rapports
- Événements et programmation
- Thèmes personnalisables
- PWA et notifications offline

### Priorité 3 (Optimisations) ✅ TERMINÉ
- Synchronisation cloud
- Sauvegardes automatiques
- Analytics avancées
- Gestion des permissions granulaires

### Priorité 4 (Améliorations Futures)
- Tests automatisés complets
- Accessibilité avancée
- Internationalisation
- Intégrations externes

---

## Résumé par Module

| Module | Admin | Enseignant | Parent | Élève | Total |
|--------|-------|------------|--------|-------|-------|
| Tableau de Bord | 4 | 3 | 3 | 3 | **13** |
| Gestion Utilisateurs | 26 | 5 | 3 | 3 | **37** |
| Gestion Classes | 18 | 4 | 2 | 2 | **26** |
| Rappels d'Hygiène | 5 | 5 | 2 | 2 | **14** |
| Notifications | 19 | 4 | 4 | 4 | **31** |
| Programmation/Événements | 19 | 7 | 4 | 4 | **34** |
| Rapports & Analytics | 11 | 9 | 7 | 6 | **33** |
| Administration | 12 | 0 | 0 | 0 | **12** |
| Stories Transversales | 6 | 6 | 6 | 6 | **24** |
| Tableau de Bord | 7 | 6 | 6 | 6 | **25** |
| Authentification & Profil | 10 | 0 | 0 | 0 | **10** |
| Navigation & Layout | 12 | 0 | 0 | 0 | **12** |
| **TOTAL** | **149** | **48** | **32** | **32** | **261** |

**Total des User Stories : 261 stories organisées par modules ! 🎯**