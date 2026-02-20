CREATE DATABASE pandora_esportify;
USE pandora_esportify; 

CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(25) NOT NULL UNIQUE,
    mail VARCHAR(255) NOT NULL UNIQUE,
    pdp VARCHAR(255) DEFAULT '/IMAGES/Icons_site/profil.png',
    mdp VARCHAR(255) NOT NULL,
    role ENUM('Visiteur', 'Joueur', 'Organisateur', 'Administrateur') DEFAULT 'Visiteur',
    inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE demandes_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  titre VARCHAR(255),
  description VARCHAR(255),
  jeu VARCHAR(100),
  Ok, là tu veux modifier la définition d’une colonne ENUM existante (pas juste une valeur dans une ligne, mais la structure de la colonne).
  participants INT,
  date_debut DATE,
  heure_debut TIME,
  date_fin DATE,
  heure_fin TIME,
  recompense VARCHAR(255),
  statut ENUM('En attente', 'Validé', 'Refusé') DEFAULT 'En attente',
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id)
);

/*
CREATE TABLE jeux_esportify (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(25),
  logo VARCHAR(255),
  fond VARCHAR(255),
  color VARCHAR(10),
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

