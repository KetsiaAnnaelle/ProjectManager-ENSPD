// Importation de mysql2 (avec les promesses pour pouvoir utiliser async/await)
const mysql = require('mysql2/promise');
require('dotenv').config(); // Pour lire les variables depuis le fichier .env

// Création d'un pool de connexion pour la base de données (plus performant que de créer une connexion unique)
const poolConnexion = mysql.createPool({
    host: process.env.DB_HOST, // adresse du serveur (localhost)
    user: process.env.DB_USER, // utilisateur de la base de données
    password: process.env.DB_PASSWORD, // mot de passe
    database: process.env.DB_NAME, // nom de notre base de données 'projet-examen'
    waitForConnections: true, // Attendre si toutes les connexions sont occupées
    connectionLimit: 10, // Max 10 connexions en même temps
    queueLimit: 0
});

// On effectue un test pour s'assurer que la connexion fonctionne au démarrage
poolConnexion.getConnection()
    .then((connexion) => {
        console.log("Connecté à la base de données avec succès !");
        connexion.release(); // On libère la connexion après le test
    })
    .catch((erreur) => {
        console.error("Erreur de connexion à la base de données : ", erreur);
    });

// On exporte pour pouvoir l'utiliser dans nos modèles
module.exports = poolConnexion;
