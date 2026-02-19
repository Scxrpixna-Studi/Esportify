const express = require("express"); // Pour creer un serveur web
const cors = require("cors"); // Pour autoriser les requêtes depuis mon site HTML
// Sans cors, le navigateur bloque les requêtes (sécurité)
const path = require("path");

require('dotenv').config();

const usersRoutes = require('./Back-End/Routes/utilisateurs');
const db = require('./Back-End/db.js');


const app = express(); // Crée l’application serveur
app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(express.json()); // Permet de lire du JSON (utile pour POST plus tard)

const session = require("express-session");
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,     // true uniquement en HTTPS
    sameSite: "lax"    // IMPORTANT pour les cookies
  }
}));


// Dossier public : tous les fichiers statiques
const path = require("path");
app.use(express.static(path.join(__dirname, "Front-End"))); 

// Pour l'accessibilité depuis la racine
app.use("/CSS", express.static(path.join(__dirname, "Front-End/CSS")));
app.use("/JS", express.static(path.join(__dirname, "Front-End/JS")));
app.use("/IMAGES", express.static(path.join(__dirname, "Front-End/IMAGES")));



app.use("/users", usersRoutes)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API lancée sur ${PORT}`);
});


// Toutes les 5 minutes, supprime les utilisateurs non vérifiés depuis plus de 5 minutes
setInterval(() => {
    db.query(
        "DELETE FROM utilisateurs WHERE email_verified = 0 AND inscription < NOW() - INTERVAL 5 MINUTE",
        (err, result) => {
            if (err) console.error("Erreur suppression utilisateurs non vérifiés:", err);
            else if (result.affectedRows > 0)
                console.log(`Suppression de ${result.affectedRows} utilisateurs non vérifiés`);
        }
    );
}, 5 * 60 * 1000); // 5 minutes
