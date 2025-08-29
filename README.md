# Application GAI - Rappels d'Hygiène

## Démarrage rapide

### Prérequis
- Docker installé
- Colima (pour macOS) ou Docker Desktop

### Installation

1. **Cloner le projet**
```bash
git clone <repo-url>
cd gai
```

2. **Démarrer Docker (macOS avec Colima)**
```bash
colima start
```

3. **Construire et démarrer les services**
```bash
# Construire l'image PHP
docker build -t gai-app .

# Démarrer la base de données
docker run -d --name gai-db \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=gai_hygiene \
  -e MYSQL_USER=gai_user \
  -e MYSQL_PASSWORD=gai_password \
  -p 3306:3306 \
  -v $(pwd)/database/init.sql:/docker-entrypoint-initdb.d/init.sql \
  mariadb:10.11

# Attendre 10 secondes puis démarrer l'application web
sleep 10
docker run -d --name gai-web \
  -p 8080:80 \
  --link gai-db:db \
  gai-app
```

4. **Vérifier le démarrage**
```bash
docker ps
curl http://localhost:8080
```

## Accès aux services

- **Application**: http://localhost:8080
- **Admin DB**: http://localhost:8080/admin.php

## Services

- **Web**: PHP 8.2 + Apache (port 8080)
- **Database**: MariaDB 10.11 (port 3306)

## Accès base de données

### Via interface web
- http://localhost:8080/admin.php

### Via ligne de commande
```bash
# Voir les tables
docker exec gai-db mysql -u gai_user -pgai_password gai_hygiene -e "SHOW TABLES;"

# Consulter les utilisateurs
docker exec gai-db mysql -u gai_user -pgai_password gai_hygiene -e "SELECT * FROM utilisateurs;"
```

### Via client MySQL externe
- **Host**: localhost:3306
- **User**: gai_user
- **Password**: gai_password
- **Database**: gai_hygiene

## Arrêt des services

```bash
docker stop gai-web gai-db
docker rm gai-web gai-db
```