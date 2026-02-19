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

[Connectez-vous](./Header/connexion.html) et inscrivez-vous pour le prochain événement.

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

### 1. Initialisation du projet Node.js
Pour créer le projet Node.js et installer les dépendances, exécutez :

```bash
npm init -y
npm install express express-session cors path dotenv mysql2

```

### 2. Justification des Installations

- `express` → Framework pour gérer le serveur et les routes HTTP.

- `express-session` → Gestion des sessions utilisateurs (connexion / déconnexion).

- `cors` → Permet la communication entre le front-end et le back-end depuis différents ports.

- `path` → Manipulation des chemins de fichiers de manière sécurisée.

- `dotenv` → Lecture des variables sensibles depuis le fichier .env.

- `mysql2` → Connexion et requêtes vers la base de données MySQL.


### 3. Configuration de la Base de Données

MySQL (version 12 ou supérieure recommandée) pour créer et gérer la base pandora_esportify.

Importer le fichier SQL/connexion.sql pour créer les tables et relations.


### 4. Lancement du Serveur

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
