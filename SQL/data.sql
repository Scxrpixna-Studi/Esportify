USE pandora_esportify;

-- Quelques utilisateurs test
INSERT INTO utilisateurs (pseudo, mail, mdp, role, inscription, email_verified)
VALUES 
('Scxrpixna', 'scxrpixna@gmail.com', '00000000', 'Administrateur', '2026-02-20 15:25:37', '1'),
('Gotek', 'exemple@test.com', 'mdp12345', 'Organisateur', '2026-02-20 15:30:37', '1');
('life-gold', 'lifeG@test.com', 'mdpTest01', 'Joueur', '2026-02-20 15:40:40', '1');

-- Quelques événements test
INSERT INTO demandes_events (user_id, titre, description, jeu, participants, date_debut, heure_debut, date_fin, heure_fin, recompense, NbrParticipants, organisateur_id)
VALUES
(1, 'Tournoi 2V2', 'Compétition amicale', 'Rocket League', 10, '2026-03-01', '15:30:00', '2026-03-01', 'Casque Gamer', '0', 'Scxrpixna'),
(2, 'Championnat LoL', 'Tournoi pro', 'League of Legends', 20, '2026-04-15', '15:30:00', '2026-04-16', 'Clavier mécanique', '0', 'boss_extreme');
