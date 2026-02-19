
// Se connecter à la base de donnée    

    const mysql = require("mysql2");

    const db = mysql.createConnection({
    host: process.env.ID_DB_HOST,
    user: process.env.ID_DB_USER,
    password: process.env.MDP_DB,
    database: process.env.DB_NAME,
    port: 3306
    });

    db.connect(err => {
    if (err) {
        console.error("Erreur MySQL :", err);
    } else {
        console.log("Connecté à MySQL");
    }
    });

    module.exports = db;
