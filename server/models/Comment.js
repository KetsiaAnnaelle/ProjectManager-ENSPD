const baseDeDonnees = require('../config/db');

const ModeleCommentaire = {
    // Obtenir tous les commentaires d'une tâche
    recupererParTache: async (idTache) => {
        const requete = `
            SELECT c.*, u.nom, u.email
            FROM commentaires c
            JOIN utilisateurs u ON c.utilisateur_id = u.id
            WHERE c.tache_id = ?
            ORDER BY c.date_creation ASC
        `;
        const [commentaires] = await baseDeDonnees.execute(requete, [idTache]);
        return commentaires;
    },

    // Ajouter un commentaire
    ajouter: async (idTache, idUtilisateur, contenu) => {
        const requete = 'INSERT INTO commentaires (tache_id, utilisateur_id, contenu) VALUES (?, ?, ?)';
        const [resultat] = await baseDeDonnees.execute(requete, [idTache, idUtilisateur, contenu]);
        return resultat.insertId;
    }
};

module.exports = ModeleCommentaire;
