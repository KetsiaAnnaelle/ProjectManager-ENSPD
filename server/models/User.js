const baseDeDonnees = require('../config/db');

// Objet contenant les fonctions pour interagir avec la table utilisateurs dans la base de données
const ModeleUtilisateur = {
    // Fonction simple pour trouver un utilisateur par son email
    trouverParEmail: async (email) => {
        // La requête sql pour chercher l'email (on utilise ? pour éviter les injections SQL)
        const requeteSql = 'SELECT * FROM utilisateurs WHERE email = ?';
        // On exécute la requête
        const [lignes] = await baseDeDonnees.execute(requeteSql, [email]);
        // On retourne le premier résultat trouvé, sinon on retourne undefined
        return lignes[0];
    },

    // Fonction pour créer un nouvel utilisateur lors de l'inscription
    creer: async (email, motDePasseHache, nom, role = 'membre') => {
        // La requête d'insertion
        const requeteSql = 'INSERT INTO utilisateurs (email, mot_de_passe, nom, role) VALUES (?, ?, ?, ?)';
        // On exécute l'insertion
        const [resultat] = await baseDeDonnees.execute(requeteSql, [email, motDePasseHache, nom, role]);
        // On retourne le résultat (qui contient l'ID du nouvel utilisateur)
        return resultat;
    },

    // Fonction pour trouver un utilisateur par son id
    trouverParId: async (id) => {
        const requeteSql = 'SELECT id, email, nom, role, date_inscription FROM utilisateurs WHERE id = ?';
        const [lignes] = await baseDeDonnees.execute(requeteSql, [id]);
        return lignes[0];
    }
};

module.exports = ModeleUtilisateur;
