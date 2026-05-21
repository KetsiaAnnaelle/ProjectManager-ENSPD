const db = require('../config/db');

const ModeleHistorique = {
    // Ajouter une entrée à l'historique
    ajouter: async (utilisateurId, action, entiteType, entiteId, details) => {
        const reqSql = 'INSERT INTO historique_modifications (utilisateur_id, action, entite_type, entite_id, details) VALUES (?, ?, ?, ?, ?)';
        const [resultat] = await db.execute(reqSql, [utilisateurId, action, entiteType, entiteId, details || '']);
        return resultat.insertId;
    },

    // Récupérer l'historique récent (Pour dashboard admin)
    recupererRecent: async (limite = 50) => {
        // Retourne l'historique avec les infos du créateur
        const reqSql = `
            SELECT h.*, u.nom as utilisateur_nom, u.email as utilisateur_email 
            FROM historique_modifications h 
            JOIN utilisateurs u ON h.utilisateur_id = u.id 
            ORDER BY h.date_creation DESC LIMIT ?
        `;
        const [resultats] = await db.execute(reqSql, [limite.toString()]);
        return resultats;
    }
};

module.exports = ModeleHistorique;
