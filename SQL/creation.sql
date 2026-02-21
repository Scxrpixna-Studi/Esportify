CREATE DATABASE IF NOT EXISTS pandora_esportify;
USE pandora_esportify;

-- Table utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(25) NOT NULL UNIQUE,
    mail VARCHAR(255) NOT NULL UNIQUE,
    pdp VARCHAR(255) DEFAULT '/IMAGES/Icons_site/profil.png',
    mdp VARCHAR(255) NOT NULL,
    role ENUM('Visiteur', 'Joueur', 'Organisateur', 'Administrateur') DEFAULT 'Visiteur',
    email_verified TINYINT(1) DEFAULT 0,
    email_token VARCHAR(255) DEFAULT NULL,
    inscription_formatee VARCHAR(20) DEFAULT NULL,
    inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table demandes_events
CREATE TABLE IF NOT EXISTS demandes_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    organisateur_id VARCHAR(20) DEFAULT 'Aucun',
    titre VARCHAR(255),
    description VARCHAR(255),
    jeu VARCHAR(100),
    participants INT,
    NbrParticipants INT,
    date_debut DATE,
    heure_debut TIME,
    date_fin DATE,
    heure_fin TIME,
    recompense VARCHAR(255),
    statut ENUM('En attente', 'Validé', 'Refusé') DEFAULT 'En attente',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id)
);
