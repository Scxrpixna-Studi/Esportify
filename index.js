const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const usersRoutes = require("./Back-End/Routes/utilisateurs");
const db = require("./Back-End/db.js");
console.log("DB importée :", !!db);

const favicon = require("serve-favicon");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const app = express();

app.use(favicon(path.join(__dirname, "Front-End/IMAGES/Icons_site/logo.ico")));

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// **Test rapide de la DB avant de continuer**
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("Erreur de connexion MySQL :", err);
    process.exit(1); // Stop Node pour éviter le 502
  }
  console.log("Connexion MySQL OK ✅");

  // Maintenant que la DB est OK, on peut créer le store
  const dbConfig = {
    host: process.env.ID_DB_HOST,
    user: process.env.ID_DB_USER,
    password: process.env.MDP_DB,
    database: process.env.DB_NAME
  };

  const sessionStore = new MySQLStore(dbConfig);

  app.set("trust proxy", 1);

  app.use(session({
    key: "esportify.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Toujours false pour tester sur HTTP sur Alwaysdata
      sameSite: "lax"
    }
  }));

  // Routes et fichiers statiques
  app.use("/CSS", express.static(path.join(__dirname, "Front-End/CSS")));
  app.use("/JS", express.static(path.join(__dirname, "Front-End/JS")));
  app.use("/IMAGES", express.static(path.join(__dirname, "Front-End/IMAGES")));
  app.use(express.static(path.join(__dirname, "Front-End/HTML")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Front-End/HTML/index.html"));
  });

  app.use("/users", usersRoutes);

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`API lancée sur ${PORT}`);
  });

  // Nettoyage utilisateurs non vérifiés
  setInterval(() => {
    db.query(
      "DELETE FROM utilisateurs WHERE email_verified = 0 AND inscription < NOW() - INTERVAL 5 MINUTE",
      (err, result) => {
        if (err) console.error("Erreur suppression utilisateurs non vérifiés:", err);
        else if (result.affectedRows > 0)
          console.log(`Suppression de ${result.affectedRows} utilisateurs non vérifiés`);
      }
    );
  }, 5 * 60 * 1000);
});