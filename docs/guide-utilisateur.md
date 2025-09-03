# Guide Utilisateur - Application GAI Rappels d'Hygiène

## Table des Matières
1. [Introduction](#introduction)
2. [Premiers Pas](#premiers-pas)
3. [Interface Utilisateur](#interface-utilisateur)
4. [Fonctionnalités par Rôle](#fonctionnalités-par-rôle)
5. [Modules Principaux](#modules-principaux)
6. [Fonctionnalités Avancées](#fonctionnalités-avancées)
7. [Guide de Test des Rappels](#guide-de-test-des-rappels)
8. [FAQ et Dépannage](#faq-et-dépannage)

---

## Introduction

L'Application GAI Rappels d'Hygiène est une solution moderne développée pour automatiser et améliorer les pratiques d'hygiène au Complexe Scolaire GAI. Cette application web progressive (PWA) utilise une architecture hybride offline-first avec synchronisation cloud Supabase pour une expérience optimale.

### Objectifs
- Automatiser les rappels d'hygiène quotidiens
- Améliorer le suivi des pratiques d'hygiène
- Faciliter la communication entre enseignants, parents et élèves
- Fournir des rapports et statistiques détaillés
- Fonctionner parfaitement hors ligne avec synchronisation automatique

### Avantages
- **Offline-First** : Fonctionne complètement hors ligne avec IndexedDB
- **Synchronisation cloud** : Sync automatique avec Supabase quand en ligne
- **Multi-appareils** : Données synchronisées entre tous vos appareils
- **Interface moderne** : Design responsive adapté mobile/desktop
- **Notifications automatiques** : Rappels programmés intelligents cross-browser
- **Résilience** : Aucune interruption de service même sans internet

---

## Premiers Pas

### Connexion à l'Application

1. **Accès initial** : Ouvrez l'application dans votre navigateur
2. **Page de connexion** : Saisissez vos identifiants
   - Email ou nom d'utilisateur
   - Mot de passe
3. **Première connexion** : Contactez l'administrateur pour obtenir vos identifiants

### Comptes de Test Disponibles

Pour découvrir l'application, utilisez ces comptes de démonstration :

**Administrateur :**
- Email : `admin@gai.cd`
- Mot de passe : `Password123!`

**Enseignant :**
- Email : `jp.mukendi@gai.cd`
- Mot de passe : `Password123!`

**Parent :**
- Email : `f.mbuyi@gai.cd`
- Mot de passe : `Password123!`

**Élève :**
- Email : `grace.mbuyi@gai.cd`
- Mot de passe : `Password123!`

---

## Interface Utilisateur

### Navigation Principale

L'interface est organisée autour d'une **barre latérale de navigation** contenant :

#### Menu Principal
- 🏠 **Tableau de Bord** : Vue d'ensemble et statistiques
- 👥 **Utilisateurs** : Gestion des comptes (Admin/Enseignant)
- 🏫 **Classes** : Gestion des classes scolaires
- 🔔 **Rappels** : Création et gestion des rappels d'hygiène
- 💬 **Notifications** : Centre de notifications
- 📊 **Rapports** : Analytics et statistiques (Admin/Enseignant)
- 📅 **Programmation** : Gestion des événements

#### Menu Administration (Admin uniquement)
- 💾 **Base de données** : Gestion des données et sauvegardes

### Barre Supérieure

- **Titre de la page** : Indique la section actuelle
- **Thème** : Bouton pour basculer entre mode clair/sombre
- **Horloge** : Affichage de l'heure actuelle
- **Profil utilisateur** : Nom, rôle et bouton de déconnexion

### Design Responsive

L'application s'adapte automatiquement :
- **Desktop** : Sidebar fixe, navigation complète
- **Mobile** : Menu hamburger, navigation tactile optimisée

---

## Fonctionnalités par Rôle

### 👑 Administrateur
**Accès complet à toutes les fonctionnalités**

- Gestion complète des utilisateurs (création, modification, suppression)
- Gestion des classes et assignations
- Création et gestion de tous les rappels
- Accès aux rapports et statistiques globales
- Administration de la base de données
- Configuration des sauvegardes automatiques
- Gestion de la synchronisation cloud (Supabase)

### 👨‍🏫 Enseignant
**Gestion pédagogique et création de contenu**

- Création et gestion de ses propres rappels d'hygiène
- Assignation de rappels aux classes dont il est responsable
- Consultation des rapports de ses classes
- Gestion des événements et programmation
- Accès aux notifications liées à ses activités

### 👨‍👩‍👧‍👦 Parent
**Suivi de ses enfants**

- Consultation des rappels assignés à ses enfants
- Réception des notifications concernant ses enfants
- Accès au profil et informations de ses enfants
- Suivi des statistiques d'hygiène familiales

### 🎓 Élève
**Accès personnel**

- Consultation de ses rappels d'hygiène personnels
- Réception de notifications personnalisées
- Accès à son profil personnel
- Consultation de ses statistiques d'hygiène

---

## Modules Principaux

### 🏠 Tableau de Bord

**Vue d'ensemble personnalisée selon votre rôle**

#### Statistiques Affichées
- **Utilisateurs actifs** : Nombre total d'utilisateurs dans le système
- **Classes gérées** : Nombre de classes (selon vos permissions)
- **Rappels actifs** : Rappels d'hygiène en cours
- **Notifications récentes** : Dernières notifications importantes

#### Métriques Visuelles
- Barres de progression colorées
- Pourcentages de completion
- Recommandations intelligentes basées sur les données

### 👥 Gestion des Utilisateurs

#### Création d'Utilisateur
1. Cliquez sur **"Nouvel utilisateur"**
2. Remplissez le formulaire :
   - **Informations personnelles** : Nom, prénom, email, téléphone
   - **Type d'utilisateur** : Élève, Parent, Enseignant
   - **Mot de passe** : Généré automatiquement ou personnalisé
3. Sauvegardez

#### Types d'Utilisateurs
- **Élève** : Accès limité aux données personnelles
- **Parent** : Accès aux données de ses enfants
- **Enseignant** : Gestion pédagogique et création de contenu
- **Admin** : Accès complet au système

#### Relations Parent-Élève
- Assignation automatique lors de la création
- Modification possible via l'interface dédiée
- Validation des relations familiales

### 🏫 Gestion des Classes

#### Création de Classe
1. Accédez au module **Classes**
2. Cliquez sur **"Nouvelle classe"**
3. Définissez :
   - **Nom de la classe** : Ex. "6ème A"
   - **Niveau scolaire** : Primaire, Secondaire
   - **Enseignant responsable** : Sélection dans la liste
4. Assignez les élèves à la classe

#### Fonctionnalités
- **Vue détaillée** : Liste des élèves, informations enseignant
- **Modification** : Changement d'enseignant, ajout/retrait d'élèves
- **Statistiques** : Métriques d'hygiène par classe

### 🔔 Rappels d'Hygiène

#### Catégories Prédéfinies
- **Lavage des mains** : Avant repas, après toilettes
- **Brossage des dents** : Matin et soir
- **Hygiène corporelle** : Douche quotidienne, vêtements propres
- **Personnalisé** : Rappels spécifiques créés par les enseignants

#### Création de Rappel
1. Accédez aux **Rappels**
2. Cliquez sur **"Nouveau rappel"**
3. Configurez :
   - **Titre et description** : Message du rappel
   - **Catégorie** : Type d'hygiène concerné
   - **Récurrence** : Quotidien, Hebdomadaire, Mensuel, Unique
   - **Heure** : Moment de la journée
   - **Statut** : Actif, Inactif, Terminé

#### Assignation
- **Utilisateurs individuels** : Sélection manuelle
- **Classes entières** : Assignation groupée
- **Critères multiples** : Combinaison de filtres

### 💬 Centre de Notifications

#### Types de Notifications
- **Rappels d'hygiène** : Notifications automatiques programmées
- **Événements** : Activités spéciales et sensibilisation
- **Administratives** : Messages du système

#### Système Cross-Browser
- **Génération automatique** : Notifications créées depuis les rappels actifs
- **Multi-appareils** : Visibles sur tous les navigateurs connectés
- **Temps réel** : Synchronisation instantanée via Supabase

#### Gestion
- **Historique complet** : 50 dernières notifications
- **Statuts** : En attente, Envoyée, Lue, Échec
- **Test manuel** : Envoi de notifications de test
- **Statistiques** : Taux de réussite et engagement
- **Permissions** : Autorisation navigateur requise

### 📅 Programmation d'Événements

#### Création d'Événement
1. Accédez à **Programmation**
2. Cliquez sur **"Nouvel événement"**
3. Définissez :
   - **Titre et description** : Nature de l'événement
   - **Date et heure** : Planification temporelle
   - **Type** : Sensibilisation, Formation, Contrôle
   - **Participants** : Classes ou utilisateurs concernés

#### Types d'Événements
- **Sensibilisation** : Sessions éducatives sur l'hygiène
- **Formation** : Ateliers pratiques
- **Contrôle** : Vérifications et évaluations
- **Personnalisé** : Événements spécifiques

---

## Fonctionnalités Avancées

### 🎨 Thèmes Personnalisables

#### Mode Clair/Sombre
- **Basculement automatique** : Détection des préférences système
- **Choix manuel** : Bouton dans la barre supérieure
- **Persistance** : Mémorisation de votre préférence

#### Avantages
- **Confort visuel** : Adaptation à l'éclairage ambiant
- **Économie d'énergie** : Mode sombre pour écrans OLED
- **Accessibilité** : Meilleur contraste pour certains utilisateurs

### 📊 Rapports et Analytics

#### Métriques Disponibles
- **Utilisateurs** : Répartition par type, activité
- **Classes** : Performance par classe, engagement
- **Rappels** : Efficacité, taux de completion
- **Notifications** : Statistiques d'envoi et lecture

#### Visualisations
- **Barres de progression** : Pourcentages colorés
- **Graphiques** : Évolution temporelle
- **Recommandations** : Suggestions d'amélioration basées sur les données

#### Export de Données
- **Format JSON** : Données complètes pour analyse
- **Sauvegarde** : Backup complet de la base de données

### 💾 Système de Sauvegarde

#### Sauvegarde Automatique
- **Planification** : Quotidienne, Hebdomadaire, Mensuelle
- **Stockage local** : Gestion intelligente de l'espace
- **Rotation** : Suppression automatique des anciennes sauvegardes

#### Sauvegarde Manuelle
1. Accédez à **Administration > Base de données**
2. Section **Gestionnaire de Sauvegarde**
3. Cliquez sur **"Créer une sauvegarde"**
4. Téléchargez le fichier JSON généré

#### Restauration
1. Sélectionnez une sauvegarde existante
2. Cliquez sur **"Restaurer"**
3. Confirmez l'opération
4. L'application redémarre avec les données restaurées

### ☁️ Synchronisation Cloud (Supabase)

#### Configuration
- **Activation** : Via l'interface d'administration
- **Authentification** : Connexion sécurisée
- **Synchronisation bidirectionnelle** : Local ↔ Cloud

#### Avantages
- **Multi-appareils** : Accès depuis plusieurs terminaux
- **Sauvegarde cloud** : Protection contre la perte de données
- **Collaboration** : Partage en temps réel

### 📱 Progressive Web App (PWA)

#### Installation
1. **Desktop** : Icône d'installation dans la barre d'adresse
2. **Mobile** : Menu "Ajouter à l'écran d'accueil"
3. **Fonctionnement** : Comme une application native

#### Fonctionnalités Offline
- **Cache intelligent** : Stockage local des ressources
- **Synchronisation** : Mise à jour automatique lors de la reconnexion
- **Notifications** : Rappels même hors ligne

---

## Guide de Test des Rappels

### Vue d'ensemble
Ce guide détaille comment tester le système de rappels d'hygiène, incluant la création, l'assignation et les notifications en temps réel.

### Comptes de Test Recommandés

#### Pour Créer des Rappels
- **Enseignant** : `jp.mukendi@gai.cd` / `Password123!`
- **Admin** : `admin@gai.cd` / `Password123!`

#### Pour Recevoir des Rappels
- **Élève (Recommandé)** : `grace.mbuyi@gai.cd` / `Password123!`
  - *Avantage* : Reçoit le plus de rappels (individuels + classe)
- **Parent** : `f.mbuyi@gai.cd` / `Password123!`

### Test Rapide : Notification en 5 Minutes

#### Étape 1 : Création du Rappel
1. **Connexion Enseignant**
   - Email : `jp.mukendi@gai.cd`
   - Mot de passe : `Password123!`

2. **Nouveau Rappel**
   - Aller sur "Rappels" → "Nouveau rappel"
   - **Titre** : `Test Notification 5min`
   - **Catégorie** : `Personnalisé`
   - **Description** : `Test de notification immédiate`
   - **Récurrence** : `Unique`
   - **Date** : Aujourd'hui
   - **Heure** : *Heure actuelle + 5 minutes*
   - Cliquer "Créer le rappel"

#### Étape 2 : Assignation
1. **Page de Détail du Rappel**
   - Cliquer "Assigner aux utilisateurs"
   - Onglet "Utilisateurs individuels"
   - Cocher "Grace Mbuyi"
   - Cliquer "Enregistrer les assignations"

#### Étape 3 : Test de Notification
1. **Connexion Grace**
   - Se déconnecter de l'enseignant
   - Email : `grace.mbuyi@gai.cd`
   - Mot de passe : `Password123!`

2. **Activation Notifications**
   - Aller sur "Notifications"
   - Cliquer "Activer les notifications"
   - Autoriser dans le navigateur

3. **Attendre le Résultat**
   - Notification navigateur dans 5 minutes
   - Vérifier l'historique dans "Notifications"

### Tests par Type d'Utilisateur

#### Test Élève (Grace)
- **Connexion** : `grace.mbuyi@gai.cd` / `Password123!`
- **Attendu** : 6+ rappels visibles (individuels + classe)
- **Vérification** : Différentes catégories et récurrences

#### Test Parent (Françoise Mbuyi)
- **Connexion** : `f.mbuyi@gai.cd` / `Password123!`
- **Attendu** : Rappels des enfants Mbuyi (Grace et David)
- **Vérification** : Filtrage par relation familiale

#### Test Enseignant
- **Connexion** : `jp.mukendi@gai.cd` / `Password123!`
- **Attendu** : Uniquement ses rappels créés
- **Vérification** : Permissions de création et modification

#### Test Admin
- **Connexion** : `admin@gai.cd` / `admin`
- **Attendu** : TOUS les rappels du système
- **Vérification** : Accès complet et gestion globale

### Test d'Assignation par Classe

1. **Créer un Rappel** (Admin/Enseignant)
2. **Assigner à une Classe**
   - "Assigner aux utilisateurs" → Onglet "Classes entières"
   - Sélectionner "CP1 A" par exemple
   - Enregistrer
3. **Vérifier**
   - Se connecter avec un élève de cette classe
   - Le rappel doit apparaître dans sa liste

### Résolution des Problèmes de Test

#### Rappels Non Visibles
- **Cause** : Assignation manquante
- **Solution** : Vérifier les assignations dans le détail du rappel

#### Notifications Non Reçues
- **Cause** : Permissions navigateur
- **Solution** : Réactiver dans les paramètres du navigateur

#### Heure Incorrecte
- **Cause** : Format d'heure
- **Solution** : Utiliser HH:MM (ex: 14:35)

### Métriques de Succès

#### Test Réussi Si :
- ✅ Grace voit 6+ rappels dans sa liste
- ✅ Notifications navigateur fonctionnent
- ✅ Assignations par utilisateur et classe opérationnelles
- ✅ Différents types d'utilisateurs voient les bons rappels
- ✅ Interface réactive sans erreurs

### Données de Test Disponibles

#### Rappels Pré-configurés
- **8 rappels** avec différentes catégories
- **Assignations multiples** : Individuelles et par classe
- **Récurrences variées** : Quotidien, Hebdomadaire, Mensuel, Unique

#### Utilisateurs de Test
- **37 utilisateurs** (1 Admin, 6 Enseignants, 10 Parents, 20 Élèves)
- **8 classes** (5 Primaires, 3 Secondaires)
- **Relations parent-enfant** configurées automatiquement

---

## FAQ et Dépannage

### Questions Fréquentes

#### **Q: Comment récupérer mon mot de passe oublié ?**
R: Contactez votre administrateur système qui peut réinitialiser votre mot de passe depuis l'interface d'administration.

#### **Q: Pourquoi je ne reçois pas de notifications ?**
R: Vérifiez que :
- Les notifications sont autorisées dans votre navigateur
- Vous avez des rappels actifs assignés
- L'application est installée en PWA pour les notifications hors ligne

#### **Q: Comment changer mon mot de passe ?**
R:
1. Accédez à votre profil (icône utilisateur en haut à droite)
2. Cliquez sur "Changer le mot de passe"
3. Saisissez l'ancien et le nouveau mot de passe

#### **Q: L'application fonctionne-t-elle sans internet ?**
R: Oui, parfaitement ! L'application utilise une architecture offline-first avec IndexedDB. Toutes les fonctionnalités (CRUD, notifications, rapports) fonctionnent hors ligne. Les données se synchronisent automatiquement avec Supabase dès que la connexion est rétablie.

#### **Q: Comment sauvegarder mes données ?**
R: Vos données sont automatiquement sauvegardées localement dans IndexedDB et synchronisées avec Supabase cloud. Pour une sauvegarde manuelle, utilisez la fonction Export JSON dans l'administration.

### Problèmes Courants

#### **Problème : L'application est lente**
**Solutions :**
- Videz le cache de votre navigateur
- Redémarrez l'application
- Vérifiez l'espace de stockage disponible

#### **Problème : Données manquantes après mise à jour**
**Solutions :**
- Vérifiez les sauvegardes automatiques
- Restaurez depuis la dernière sauvegarde valide
- Contactez l'administrateur

#### **Problème : Interface déformée sur mobile**
**Solutions :**
- Actualisez la page
- Installez l'application en PWA
- Utilisez un navigateur moderne (Chrome, Firefox, Safari)

### Support Technique

#### Contact
- **Administrateur système** : Contactez votre responsable informatique
- **Documentation technique** : Consultez le guide d'installation
- **Communauté** : Partagez vos expériences avec les autres utilisateurs

#### Informations Système
- **Version** : React 19 + TypeScript + IndexedDB + Supabase
- **Navigateurs supportés** : Chrome 90+, Firefox 88+, Safari 14+
- **Stockage** : IndexedDB local + Supabase PostgreSQL cloud (hybride)
- **Architecture** : Offline-first avec synchronisation automatique
- **Sécurité** : Authentification par rôle, données chiffrées en transit

---

## Conclusion

L'Application GAI Rappels d'Hygiène représente une solution moderne et complète pour améliorer les pratiques d'hygiène au sein de votre établissement scolaire. Grâce à son interface intuitive, ses fonctionnalités avancées et son fonctionnement hors ligne, elle s'adapte parfaitement aux besoins de tous les utilisateurs.

N'hésitez pas à explorer toutes les fonctionnalités et à contacter votre administrateur pour toute question ou suggestion d'amélioration.

**Bonne utilisation ! 🎉**