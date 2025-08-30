# Guide d'Installation - Application GAI Rappels d'Hygiène

## Table des Matières
1. [Prérequis Système](#prérequis-système)
2. [Installation Développement](#installation-développement)
3. [Configuration Production](#configuration-production)
4. [Déploiement](#déploiement)
5. [Configuration PWA](#configuration-pwa)
6. [Synchronisation Cloud](#synchronisation-cloud)
7. [Maintenance](#maintenance)

---

## Prérequis Système

### Environnement de Développement

#### Logiciels Requis
- **Node.js** : Version 18.0+ (LTS recommandée)
- **npm** : Version 8.0+ (inclus avec Node.js)
- **Git** : Pour le contrôle de version
- **Navigateur moderne** : Chrome 90+, Firefox 88+, Safari 14+

#### Vérification des Prérequis
```bash
# Vérifier Node.js
node --version
# Doit afficher v18.0.0 ou supérieur

# Vérifier npm
npm --version
# Doit afficher 8.0.0 ou supérieur

# Vérifier Git
git --version
```

### Environnement de Production

#### Serveur Web
- **Serveur statique** : Nginx, Apache, ou CDN
- **HTTPS** : Certificat SSL requis pour PWA
- **Compression** : Gzip/Brotli recommandé

#### Navigateurs Supportés
- **Chrome** : 90+
- **Firefox** : 88+
- **Safari** : 14+
- **Edge** : 90+

---

## Installation Développement

### 1. Clonage du Projet

```bash
# Cloner le repository
git clone https://github.com/Abarchibody/gai-hygiene-app.git
cd gai-hygiene-app

# Ou télécharger et extraire l'archive ZIP
```

### 2. Installation des Dépendances

```bash
# Installation des packages npm
npm install

# Vérification de l'installation
npm list --depth=0
```

### 3. Configuration de l'Environnement

#### Fichier de Configuration (.env)
```bash
# Créer le fichier .env à la racine du projet
touch .env

# Contenu du fichier .env
VITE_APP_NAME="GAI Rappels d'Hygiène"
VITE_APP_VERSION="1.0.0"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Démarrage du Serveur de Développement

```bash
# Démarrer le serveur de développement
npm run dev

# L'application sera accessible sur :
# http://localhost:5173
```

#### Scripts Disponibles
```bash
# Développement avec hot reload
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Linting du code
npm run lint

# Tests (si configurés)
npm run test
```

---

## Configuration Production

### 1. Build de Production

```bash
# Créer le build optimisé
npm run build

# Le dossier 'dist' contient les fichiers de production
ls -la dist/
```

### 2. Structure du Build

```
dist/
├── index.html          # Point d'entrée principal
├── assets/            # Ressources optimisées
│   ├── index-[hash].js    # JavaScript minifié
│   ├── index-[hash].css   # CSS minifié
│   └── [images]           # Images optimisées
├── manifest.json      # Manifest PWA
├── sw.js             # Service Worker
└── icons/            # Icônes PWA
    ├── icon-192.png
    ├── icon-512.png
    └── favicon.ico
```

### 3. Configuration du Serveur Web

#### Nginx Configuration
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name votre-domaine.com;
    
    # Redirection HTTPS (recommandé pour PWA)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name votre-domaine.com;
    
    # Configuration SSL
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Racine du site
    root /var/www/gai-hygiene/dist;
    index index.html;
    
    # Configuration pour SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache des assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service Worker (pas de cache)
    location /sw.js {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Manifest PWA
    location /manifest.json {
        expires 1d;
        add_header Cache-Control "public";
    }
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Apache Configuration (.htaccess)
```apache
# Redirection SPA
RewriteEngine On
RewriteBase /

# Gestion des routes React Router
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache des assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Service Worker sans cache
<Files "sw.js">
    ExpiresActive Off
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</Files>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

---

## Déploiement

### Option 1: Déploiement Manuel

#### 1. Préparation des Fichiers
```bash
# Build de production
npm run build

# Création de l'archive
tar -czf gai-hygiene-app.tar.gz dist/

# Ou ZIP
zip -r gai-hygiene-app.zip dist/
```

#### 2. Upload sur le Serveur
```bash
# Via SCP
scp gai-hygiene-app.tar.gz user@server:/var/www/

# Extraction sur le serveur
ssh user@server
cd /var/www/
tar -xzf gai-hygiene-app.tar.gz
mv dist gai-hygiene
```

### Option 2: Déploiement Automatisé (Netlify)

#### 1. Configuration netlify.toml
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "max-age=31536000"
```

#### 2. Déploiement
```bash
# Installation de Netlify CLI
npm install -g netlify-cli

# Connexion à Netlify
netlify login

# Déploiement
netlify deploy --prod --dir=dist
```

### Option 3: Déploiement Vercel

#### 1. Configuration vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 2. Déploiement
```bash
# Installation de Vercel CLI
npm install -g vercel

# Déploiement
vercel --prod
```

---

## Configuration PWA

### 1. Manifest PWA

Le fichier `public/manifest.json` est automatiquement généré :

```json
{
  "name": "GAI Rappels d'Hygiène",
  "short_name": "GAI Hygiène",
  "description": "Application de gestion des rappels d'hygiène pour le Complexe Scolaire GAI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

### 2. Service Worker

Le Service Worker est automatiquement configuré pour :
- **Cache offline** : Mise en cache des ressources statiques
- **Notifications** : Gestion des notifications push
- **Mise à jour** : Gestion des mises à jour de l'application

### 3. Installation PWA

#### Desktop (Chrome/Edge)
1. Icône d'installation dans la barre d'adresse
2. Clic sur l'icône → "Installer GAI Hygiène"
3. L'application s'ouvre comme une app native

#### Mobile (Android/iOS)
1. Menu navigateur → "Ajouter à l'écran d'accueil"
2. Personnaliser le nom si nécessaire
3. L'icône apparaît sur l'écran d'accueil

---

## Synchronisation Cloud

### 1. Configuration Supabase

#### Création du Projet Supabase
1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et les clés API

#### Configuration de la Base de Données
```sql
-- Exécuter le script SQL fourni
-- Fichier: docs/supabase-schema.sql

-- Activer Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_assignments ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (exemples)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all data" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND type_utilisateur = 'Admin'
    )
  );
```

### 2. Configuration de l'Application

#### Variables d'Environnement
```bash
# Fichier .env.production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Configuration Automatique
L'application utilise directement Supabase comme base de données principale :
1. Toutes les données sont stockées dans Supabase
2. Authentification gérée par les services
3. Synchronisation temps réel automatique
4. Pas de configuration supplémentaire requise

---

## Maintenance

### 1. Mises à Jour

#### Mise à Jour du Code
```bash
# Récupération des dernières modifications
git pull origin main

# Mise à jour des dépendances
npm update

# Nouveau build
npm run build

# Déploiement
# (selon votre méthode de déploiement)
```

#### Mise à Jour des Dépendances
```bash
# Vérifier les packages obsolètes
npm outdated

# Mise à jour sécurisée
npm update

# Mise à jour majeure (avec précaution)
npm install package@latest
```

### 2. Monitoring

#### Logs d'Erreur
```bash
# Logs du serveur web (Nginx)
tail -f /var/log/nginx/error.log

# Logs d'accès
tail -f /var/log/nginx/access.log
```

#### Métriques de Performance
- **Temps de chargement** : < 3 secondes
- **Taille du bundle** : < 2 MB
- **Score Lighthouse** : > 90
- **Utilisation mémoire** : < 100 MB

### 3. Sauvegarde

#### Sauvegarde des Données Utilisateur
```bash
# Script de sauvegarde automatique
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/gai-hygiene"

# Créer le répertoire de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde via l'interface admin
# (Les utilisateurs peuvent exporter leurs données en JSON)

# Sauvegarde des fichiers de configuration
cp /etc/nginx/sites-available/gai-hygiene $BACKUP_DIR/nginx_$DATE.conf
```

#### Sauvegarde Supabase
```bash
# Sauvegarde de la base de données Supabase
# Via l'interface Supabase ou API
curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/backup_database' \
  -H "apikey: your-service-role-key" \
  -H "Authorization: Bearer your-service-role-key"
```

### 4. Résolution de Problèmes

#### Problèmes Courants

**Application ne se charge pas**
```bash
# Vérifier les logs du serveur
tail -f /var/log/nginx/error.log

# Vérifier les permissions
ls -la /var/www/gai-hygiene/

# Vérifier la configuration Nginx
nginx -t
```

**Service Worker ne fonctionne pas**
```bash
# Vérifier que le fichier sw.js est accessible
curl https://votre-domaine.com/sw.js

# Vérifier les headers de cache
curl -I https://votre-domaine.com/sw.js
```

**Synchronisation Supabase échoue**
```bash
# Vérifier la connectivité
curl https://your-project.supabase.co/rest/v1/

# Vérifier les clés API dans la configuration
```

---

## Conclusion

Ce guide d'installation vous fournit toutes les informations nécessaires pour déployer l'Application GAI Rappels d'Hygiène en production. Points clés à retenir :

### ✅ Checklist de Déploiement
- [ ] Prérequis système vérifiés
- [ ] Build de production créé
- [ ] Serveur web configuré (HTTPS)
- [ ] PWA fonctionnelle
- [ ] Synchronisation cloud configurée (optionnel)
- [ ] Sauvegardes automatiques activées
- [ ] Monitoring en place

### 🔧 Maintenance Régulière
- Vérification hebdomadaire des logs
- Mise à jour mensuelle des dépendances
- Sauvegarde quotidienne des données
- Monitoring des performances

### 📞 Support
En cas de problème, consultez :
1. Ce guide d'installation
2. La documentation technique
3. Les logs système
4. La communauté des développeurs

**Déploiement réussi = Application fiable ! 🚀**