const baseDeDonnees = require('../config/db');

// Objet pour gérer les opérations sur les projets
const ModeleProjet = {
    // Fonction pour récupérer tous les projets avec les indormations de leur créateur
    recupererTous: async () => {
        const requeteSql = `
            SELECT projets.*, utilisateurs.nom AS nom_createur 
            FROM projets 
            JOIN utilisateurs ON projets.createur_id = utilisateurs.id
            ORDER BY projets.date_creation DESC
        `;
        const [lignes] = await baseDeDonnees.execute(requeteSql);
        return lignes;
    },

    // Fonction pour trouver un projet spécifique par son identifiant
    trouverParId: async (idProjet) => {
        const requeteSql = 'SELECT * FROM projets WHERE id = ?';
        const [lignes] = await baseDeDonnees.execute(requeteSql, [idProjet]);
        return lignes[0];
    },

    // Fonction pour créer un nouveau projet
    creer: async (titre, description, idCreateur) => {
        const requeteSql = 'INSERT INTO projets (titre, description, createur_id) VALUES (?, ?, ?)';
        const [resultat] = await baseDeDonnees.execute(requeteSql, [titre, description, idCreateur]);
        return resultat.insertId; // Retourne juste l'ID du nouveau projet
    },

    // Fonction pour modifier un projet existant
    modifier: async (idProjet, titre, description) => {
        const requeteSql = 'UPDATE projets SET titre = ?, description = ? WHERE id = ?';
        await baseDeDonnees.execute(requeteSql, [titre, description, idProjet]);
    },

    // Fonction pour supprimer un projet
    supprimer: async (idProjet) => {
        const requeteSql = 'DELETE FROM projets WHERE id = ?';
        await baseDeDonnees.execute(requeteSql, [idProjet]);
    }
};

module.exports = ModeleProjet;
