# Esportify
Site E-sport - Projet d'examen pour la structure Studi

## Description Générale

Esportify est une plateforme web permettant aux utilisateurs de créer, suivre et participer à différents événements e-sport.  
Les utilisateurs de la plateforme peuvent également devenir organisateurs, ce qui leur permet de gérer et suivre les événements proposés.  
Cette approche assure un accès structuré, clair et attractif pour les joueurs.

---

## Présentation du Site

# Bienvenue sur Esportify

Une plateforme spécialement conçue pour les joueurs E-Sport les plus ambitieux !

Des événements dédiés aux compétitions de divers jeux vidéos sont organisés régulièrement, les joueurs ayant participé pourront alors suivre leurs performances tout au long de leurs expériences et échanger entre eux.

[Connectez-vous](./HTML/Header/connexion.html) et inscrivez-vous pour le prochain événement.

*Esportify fondée le 17 mars 2021 en France*

---

## Technologies utilisées :

- HTML / CSS / JavaScript (Front-End)
- Node.js / Express (Back-End)
- MySQL (Base de Données)

---

## Sources des Images et Icônes :

- Images / Illustrations Libre de Droit : [Pixabay](https://pixabay.com/fr/) - [FreeLogoPng](https://freelogopng.com/) - [Unsplash](https://unsplash.com/fr)
- Autre Images : Création à la main via [Canva](https://www.canva.com/templates)

- Icônes Libre de Droit : [Flaticon](https://www.flaticon.com/fr/) - [Icones8](https://icones8.fr/)

---

## Organisation du Projet

### Front-End
- `HTML/`, `CSS/`, `JS/`, `IMAGES/` → Dossiers et fichiers du front-end.
- `index.js` → Script principal du front-end.
- `gestion_connexion_accueil.js` → Script de gestion de la connexion générale côté front.

### Back-End
- `Back-End/` → Routes et connexion à la base de données (`db.js`).
- `Back-End/Routes/` → Gestion des routes et requêtes (`utilisateurs.js`).

### Base de données
- `SQL/` → Script de création de la base de données (`mabase.sql`).
- `.env` → Variables sensibles (ignorées par Git via `.gitignore`).

### Autres
- `README.md` → Fichier de documentation du projet.

---

## Installation et Dépendances

### 1. Clonage du projet

```bash
git clone https://github.com/Scxrpixna-Studi/Esportify.git
cd Esportify

```

### 2. Installation des dépendances
Pour créer le projet Node.js et installer les dépendances, exécutez :

```bash
npm install

```

### 3. Configuration du fichier .env
Créer un fichier .env à la racine du projet avec le contenu suivant :

ADRESSE_GMAIL_SITE=adresse_mail_du_site_web
MDP_GMAIL=votre_mot_de_passe_app

SESSION_SECRET=une_cle_secrete

ID_DB_HOST=localhost
ID_DB_USER=root
MDP_DB=mot_de_passe
DB_NAME=pandora_esportify

BASE_URL=http://localhost:3000


### 4. Importation de la base de données
```Markdown
MySQL version 8.x recommandée.

```
Ouvrir MySQL et créer la base de données :

```SQL
CREATE DATABASE pandora_esportify

```
puis importez le fichier situé dans le dossier SQL/ :

```bash
mysql -u root -p pandora_esportify < SQL/connexion.sql
```

### 5. Justification des Installations

- `express` → Framework pour gérer le serveur et les routes HTTP.

- `express-session` → Gestion des sessions utilisateurs (connexion / déconnexion).

- `cors` → Permet la communication entre le front-end et le back-end depuis différents ports.

- `path` → Manipulation des chemins de fichiers de manière sécurisée.

- `dotenv` → Lecture des variables sensibles depuis le fichier .env.

- `mysql2` → Connexion et requêtes vers la base de données MySQL.

### 6. Lancement du Serveur

```bash
node index.js

```
Le serveur est accessible sur http://127.0.0.1:3000.

---

## Fonctionnalités Principales

- Gestion des utilisateurs avec rôles : Visiteur, Joueur, Organisateur, Administrateur
- Création, inscription et suivi des événements
- Validation des demandes d’événements
- Interface responsive pour le front-end
- Connexion et inscription sécurisées

---

## Workflow Git et Bonnes Pratiques

Le projet suit un workflow Git structuré pour séparer le code stable du développement :

- **main** → branche principale, version stable déployable
- **develop** → branche de développement pour tester les fonctionnalités
- **feature/** → chaque nouvelle fonctionnalité est développée dans une branche dédiée

### Exemple de branches

- `feature/authentification`
- `feature/gestion-evenements`
- `feature/structure-initiale`

### Processus de travail

1. Créer une branche fonctionnalité depuis `develop` :

```bash
   git checkout develop
   git checkout -b feature/ma-feature

```

2. Développer et tester la fonctionnalité sur cette branche

Merge de la branche feature vers develop :

```bash
git checkout develop
git merge feature/ma-feature
```

3. Une fois que develop est stable et testé, merge vers main :

```bash
git checkout main
git merge develop
```
Le fichier .env et le dossier node_modules/ sont ignorés via .gitignore.
