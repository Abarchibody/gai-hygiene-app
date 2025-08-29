# 🧪 Guide de Test - Application GAI Hygiène

## 🚀 **Test Complet du Système**

### **🎯 Tests Automatisés Intégrés**

#### **Panel de Test Rapide (Dashboard)**
- **Test complet** : Validation de tous les composants
- **Test notification** : Vérification des permissions
- **Démarrage planificateur** : Activation du système automatique

#### **Suite de Tests UI Complète (Dashboard)**
- **10 tests automatiques** : Navigation, Base de données, Notifications, Performance
- **Validation complète** : Interface, CRUD, Relations, Stockage
- **Rapport détaillé** : Statut, durée, messages d'erreur

#### **Monitoring Système (Admin)**
- **État temps réel** : Base de données, Notifications, Permissions, Stockage
- **Statistiques live** : Compteurs de tous les modules
- **Recommandations** : Actions correctives automatiques

### **1. Préparation**
```bash
# Démarrer l'application
npm run dev
# Ouvrir http://localhost:5173
```

### **2. Initialisation des données**
1. **Aller sur `/admin`**
2. **Cliquer "Ajouter les données de test"**
3. **Vérifier le message de succès** : 
   - 13 utilisateurs (3 enseignants, 4 parents, 6 élèves)
   - 4 classes avec assignations
   - 6 rappels d'hygiène variés
   - Notifications programmées automatiquement

### **3. Tests Automatisés (Dashboard)**
1. **Aller sur `/` (Dashboard)**
2. **Vérifier les statistiques** :
   - Utilisateurs : 13
   - Classes : 4
   - Élèves Assignés : 6
   - Relations Parent-Élève : 6
   - Rappels d'Hygiène : 6

3. **Suite de Tests UI Complète** :
   - Cliquer "Lancer Tests UI"
   - Attendre la fin des 10 tests automatiques
   - Vérifier tous les résultats ✅
   - Autoriser les notifications si demandé

4. **Panel de Test Rapide** :
   - Cliquer "Test complet" (validation rapide)
   - "Test notification" (test manuel)
   - "Démarrer planificateur" (activation)

### **4. Test des Rappels d'Hygiène**
1. **Aller sur `/reminders`**
2. **Vérifier la liste** : 6 rappels avec différents statuts
3. **Tester les filtres** : Par catégorie, statut, recherche
4. **Créer un nouveau rappel** :
   - Titre : "Test Lavage Mains"
   - Catégorie : "Lavage mains"
   - Récurrence : "Quotidien"
   - Heure : Maintenant + 2 minutes
   - Statut : "Actif"

5. **Assigner le rappel** :
   - Cliquer sur le rappel créé
   - "Assigner aux utilisateurs"
   - Sélectionner quelques élèves
   - Enregistrer

### **5. Test des Notifications**
1. **Aller sur `/notifications`**
2. **Vérifier les permissions** : Autoriser si nécessaire
3. **Voir les statistiques** : Notifications programmées
4. **Tester une notification** : Bouton "Tester une notification"
5. **Démarrer le planificateur** : Bouton "Démarrer le planificateur"

### **6. Test Automatique**
1. **Attendre 2-3 minutes** (pour le rappel créé)
2. **Vérifier qu'une notification apparaît** dans le système
3. **Aller sur `/notifications`** → Voir l'historique
4. **Vérifier le statut** : "sent" puis "read" si cliqué

### **7. Test des Modules**
1. **Users** (`/users`) :
   - Liste, création, détail, édition ✅
   - Assignation parent-élève ✅

2. **Classes** (`/classes`) :
   - Liste, création, détail, édition ✅
   - Assignation élèves ✅

3. **Administration** (`/admin`) :
   - Monitoring système en temps réel ✅
   - Export/Import données ✅
   - Seed database ✅
   - État de santé des composants ✅

## 🎯 **Résultats Attendus**

### **✅ Fonctionnalités Opérationnelles**
- **CRUD complet** : Users, Classes, Reminders
- **Relations** : Parent-élève, élève-classe, rappel-assignations
- **Notifications automatiques** : Programmation et envoi
- **Interface moderne** : Navigation fluide, design cohérent
- **Données locales** : IndexedDB, export/import

### **🔔 Notifications**
- **Permissions** : Demande automatique
- **Programmation** : Selon récurrence des rappels
- **Envoi automatique** : Planificateur toutes les minutes
- **Historique complet** : Statuts et timestamps

### **📊 Statistiques**
- **Dashboard temps réel** : Compteurs mis à jour
- **Centre notifications** : Métriques détaillées
- **Panel de test** : Validation système

## 🐛 **Dépannage**

### **Notifications ne s'affichent pas**
1. Vérifier les permissions navigateur
2. Tester avec "Test notification"
3. Vérifier la console pour erreurs

### **Données manquantes**
1. Aller sur `/admin`
2. "Ajouter les données de test"
3. Vérifier le Dashboard

### **Erreurs JavaScript**
1. Ouvrir la console (F12)
2. Vérifier les erreurs IndexedDB
3. Recharger la page

## 🎉 **Test Réussi Si :**
- ✅ Toutes les pages se chargent
- ✅ Données de test présentes
- ✅ Notifications autorisées et fonctionnelles
- ✅ Rappels créés et assignés
- ✅ Planificateur actif
- ✅ Statistiques cohérentes

**L'application GAI Hygiène est maintenant pleinement opérationnelle !** 🚀