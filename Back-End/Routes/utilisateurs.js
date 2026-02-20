const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

 
// Fonction pour éviter les injections
function escapeHTML(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

  // Function
    const crypto = require("crypto");

    function generateToken() {
        return crypto.randomBytes(32).toString("hex"); // 64 caractères hexadécimaux
    }

    const nodemailer = require("nodemailer");

    console.log("MDP_GMAIL =", process.env.MDP_GMAIL ? "OK" : "MANQUANT");

    // Configurer ton serveur SMTP (ex : Gmail, Outlook ou un serveur SMTP propre)
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // transporteur SMTP pour envoyer des mails.
        port: 587, // Pour SSL - Pour TLS : port 587
        secure: false, // true si SSL, false si TLS
        auth: {
            user: process.env.ADRESSE_GMAIL_SITE,
            pass: process.env.MDP_GMAIL // Jamais de mdp dans le code -> passer sur un A2F google pour + de sécu
        }
    });

    async function sendVerificationEmail(mail, token, pseudo) {
        const url = `/users/verify-email?token=${token}`;

        await transporter.sendMail({
            from: `"Esportify" <${process.env.ADRESSE_GMAIL_SITE}>`,
            to: mail,
            subject: "Demande de vérification",
            html: `
                <p>Bonjour ${pseudo},</p>
                <p>Merci de vous être inscrit sur Esportify. Cliquez sur le lien ci-dessous pour vérifier votre email afin de pouvoir vous connecter à votre compte :</p>
                <a href="${url}">Vérifier mon email</a>
            `
        });

        console.log("email :", mail, "token :", token, "pseudo :", pseudo )
    }

// VERIFICATION du mail
  router.get("/verify-email", (req, res) => {
    const token = req.query.token;

    if (!token) return res.redirect("/Hors/email_verified.html?status=token-invalide");

    db.query(
        "SELECT inscription FROM utilisateurs WHERE email_token = ?",
        [token],
        (err, results) => {
            if (err) return res.redirect("/Hors/email_verified.html?status=erreur");
            if (results.length === 0) return res.redirect("/Hors/email_verified.html?status=token-invalide");

            const inscriptionDate = results[0].inscription;
            const now = new Date();
            if (now - new Date(inscriptionDate) > 15 * 60 * 1000) {
                // Supprime le compte expiré
                db.query("DELETE FROM utilisateurs WHERE email_token = ?", [token]);
                return res.redirect("/Hors/email_verified.html?status=token-expire");
            }

            // Sinon, tout est OK
            db.query(
                "UPDATE utilisateurs SET email_verified = 1, email_token = NULL WHERE email_token = ?",
                [token],
                (err2, result) => {
                    if (err2 || result.affectedRows === 0)
                        return res.redirect("/Hors/email_verified.html?status=erreur");
                    return res.redirect("/Hors/email_verified.html?status=email-verified");
                }
            );
        }
    );
});


// INSCRIPTION
router.post("/register", async (req, res) => {
    const { pseudo, email, mdp } = req.body;

    // Vérifs de base
    if (!pseudo) {
        return res.status(400).json({
            success: false,
            message: "Pseudo manquant"
        });
    } else if (!email) {
      return res.status(400).json({
            success: false,
            message: "E-Mail manquant"
      });
    } else if (!mdp) {
      return res.status(400).json({
            success: false,
            message: "Mot de passe manquant"
      });
    };

    if (mdp.length < 8 || mdp.length > 20) {
        return res.status(400).json({
            success: false,
            message: "Le mot de passe doit contenir entre 8 et 20 caractères"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Email invalide"
        });
    }

    // Verif si pseudo ou email existe déjà
    db.query(
        "SELECT pseudo, mail FROM utilisateurs WHERE pseudo = ? OR mail = ?",
        [pseudo, email],
        async (err, results) => {
            if (err) {
                console.error("SELECT ERROR:", err);
                return res.status(500).json({
                    success: false,
                    message: "Erreur base de données"
                });
            }

            if (results.length > 0) {
                const existingPseudo = results.find(r => r.pseudo === pseudo);
                const existingEmail = results.find(r => r.mail === email);

                let message = "";
                if (existingPseudo) message = "Le Pseudo choisi est déjà utilisé. ";
                else if (existingEmail) message = "L'E-mail choisi est déjà utilisé.";

                return res.status(400).json({
                    success: false,
                    message: message.trim()
                });
            }

            // Tout est OK → on peut insérer
            const token = generateToken();
            const hashedPassword = await bcrypt.hash(mdp, 10);

            db.query(
                "INSERT INTO utilisateurs (pseudo, mail, mdp, email_token, inscription) VALUES (?, ?, ?, ?, NOW())",
                [pseudo, email, hashedPassword, token],
                async (err) => {
                    if (err) {
                        console.error("REGISTER ERROR:", err);
                        return res.status(500).json({
                            success: false,
                            message: "Erreur base de données"
                        });
                    }

                    try {
                        await sendVerificationEmail(email, token, pseudo);
                        res.json({
                            success: true,
                            message: "Inscription réussie ! Vérifiez votre email pour activer le compte afin de pouvoir vous connecter à Esportify"
                        });
                    } catch (emailErr) {
                        console.error("MAIL ERROR:", emailErr);
                        res.status(500).json({
                            success: false,
                            message: "Impossible d’envoyer l’email de vérification."
                        });
                    }
                }
            );
        }
    );

});


// CONNEXION
router.post("/login", (req, res) => {
  const { email, mdp } = req.body;

  db.query(
    "SELECT id, mdp FROM utilisateurs WHERE mail = ? AND email_verified = 1",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Erreur serveur" });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Email non vérifié ou identifiants incorrects"
        });
      }

      const isValid = await bcrypt.compare(mdp, results[0].mdp);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Mot de passe incorrect"
        });
      }

      req.session.regenerate(err => {
        if (err) {
          return res.status(500).json({ success: false });
        }

        req.session.userId = results[0].id;

        res.json({
          success: true,
          message: "Connexion réussie"
        });
      });


    }
  );

});


// GET USER CONNECTÉ
  router.get("/me", (req, res) => {

    if (!req.session.userId) {
      return res.json({ connected: false });
    }

    db.query(
      "SELECT pseudo, role, pdp FROM utilisateurs WHERE id = ?",
      [req.session.userId],
      (err, results) => {

        if (err || results.length === 0) {
          return res.status(500).json({ connected: false });
        }

        const user = results[0];

        res.json({
          connected: true,
          pseudo: user.pseudo,
          role: user.role,
          pdpProfil: user.pdp
        });
      }
    );
  });


// DECONNEXION
  router.post("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error("Erreur pendant l'interruption de la session :", err);
        return res.status(500).json({ success: false });
      }

      // Supprime le cookie côté navigateur
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });





// NOUS-CONTACTER -> envoie d'un mail a Espotify support + email de confirmation au joueur
  router.post("/contact", async (req, res) => {

    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: "Non connecté" });
    }

    const { motif, message } = req.body;

    if (!motif || !message) {
      return res.status(400).json({ success: false, message: "Champs manquants" });
    }

    // Récupérer infos utilisateur depuis la base
    db.query(
      "SELECT pseudo, mail, inscription_formatee, role FROM utilisateurs WHERE id = ?",
      [req.session.userId],
      async (err, results) => {

        if (err || results.length === 0) {
          return res.status(500).json({ success: false });
        }

        const user = results[0];

        try {
          await transporter.sendMail({
            from: `"Esportify Support" <${process.env.ADRESSE_GMAIL_SITE}>`,
            to: process.env.ADRESSE_GMAIL_SITE,
            subject: `${motif}`,
            html: `
              <h2>Nouvelle demande - Support Esportify</h2>

              <h3><strong><i>• Informations de l'utilisateur :</i></strong></h3>
              <p><strong>Email :</strong> ${user.mail}</p>
              <p><strong>Pseudo :</strong> ${user.pseudo}</p>
              <p><strong>Rôle :</strong> ${user.role}</p>
              <p><strong>Date d'inscription :</strong> le ${user.inscription_formatee}</p>
              <hr>
              <h3><strong><i>• Informations de la demande :</i></strong></h3>
              <h4><strong>Motif - ${motif}</strong></h4>
              <p><strong>Contenu de la demande :</strong>${escapeHTML(message)}</p> 
            `
          });

          await transporter.sendMail({
            from: `"Esportify Support" <${process.env.ADRESSE_GMAIL_SITE}>`,
            to: user.mail, // l’adresse de l’utilisateur
            subject: `Confirmation de votre demande - ${motif}`,
            html: `
              <p>Bonjour ${user.pseudo},</p>
              <p>Nous avons bien reçu votre demande, voici un récapitulatif:</p>
              <hr>
              <h3><strong><i>• Informations de la demande :</i></strong></h3>
              <h4><strong>Motif - ${motif}</strong></h4>
              <p><strong>Contenu de la demande :</strong>${escapeHTML(message)}</p>
              <hr>
              <p>Merci de votre confiance ! Nous reviendrons vers vous dès que possible.</p>
              <p><strong><i>L'Équipe Esportify Support</i></strong></p>
            `
          });


          res.json({ success: true });

        } catch (mailErr) {
          console.error("Erreur envoi mail :", mailErr);
          res.status(500).json({ success: false });
        }

      }
    );

  });


// FORMULAIRE DEMANDE CREATION EVENTS -> envoie du formulaire au Organisateur Esportify
  router.post("/creation_events", async (req, res) => {

  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Non connecté" });
  }

  const {
    titre,
    description,
    jeu,
    participants,
    date_debut,
    heure_debut,
    date_fin,
    heure_fin,
    récompense,
    statut,
    NbrParticipants
  } = req.body;

  db.query(
    `INSERT INTO demandes_events 
    (user_id, titre, description, jeu, participants, date_debut, heure_debut, date_fin, heure_fin, recompense, statut, NbrParticipants) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.session.userId,
      titre,
      description,
      jeu,
      participants,
      date_debut,
      heure_debut,
      date_fin,
      heure_fin,
      récompense,
      statut,
      NbrParticipants
    ],
    (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }

      res.json({ success: true });
    }
  );

});


// RECUPERATION DES DEMANDE DE CREATIONS SELON LE ROLE
  router.get("/mes_demandes", (req, res) => {

    console.log("Session ID:", req.session.userId);

    if (!req.session.userId) {
      return res.status(401).json({ success: false });
    }

    db.query(
      "SELECT role FROM utilisateurs WHERE id = ?",
      [req.session.userId],
      (err, result) => {

        if (err || result.length === 0) {
          return res.status(500).json({ success: false });
        }

        const role = result[0].role;

        // Si organisateur ou admin → voir toutes les demandes
        if (role === "Organisateur" || role === "Administrateur") {

          db.query(
            `SELECT d.*, u.pseudo 
            FROM demandes_events d
            JOIN utilisateurs u ON d.user_id = u.id
            ORDER BY d.date_creation DESC`,
            (err, demandes) => {

              if (err) return res.status(500).json({ success: false });

              res.json({ success: true, demandes });
            }
          );

        } else {

          // Joueur normal → voir uniquement ses demandes
          db.query(
            `SELECT * FROM demandes_events 
            WHERE user_id = ? 
            ORDER BY date_creation DESC`,
            [req.session.userId],
            (err, demandes) => {

              if (err) return res.status(500).json({ success: false });

              res.json({ success: true, demandes });
            }
          );
        }

      }
    );

  });


// DEMANDE DE CREATION D'EVENT VALIDE
router.post("/valider_demande", (req, res) => {
  const { id } = req.body;
  db.query("UPDATE demandes_events SET statut = 'Validé' WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false });
    // Retourner l'objet mis à jour
    db.query("SELECT * FROM demandes_events WHERE id = ?", [id], (err2, result) => {
      if (err2 || result.length === 0) return res.status(500).json({ success: false });
      res.json({ success: true, demande: result[0] });
    });
  });
});


// MAJ EVENTS EN COURS 
router.get("/events_en_cours", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Non connecté" });
  }

  db.query(
    "SELECT d.*, u.pseudo FROM demandes_events d JOIN utilisateurs u ON d.user_id = u.id WHERE d.statut = 'Validé' ORDER BY d.date_creation DESC",
    (err, results) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true, demandes: results });
    }
  );
});



module.exports = router;
