const db = require('../config/db');

const ModeleNotification = {
    // Créer une notification
    creer: async (utilisateurId, message, type, lien) => {
        const reqSql = 'INSERT INTO notifications (utilisateur_id, message, type, lien) VALUES (?, ?, ?, ?)';
        const [resultat] = await db.execute(reqSql, [utilisateurId, message, type, lien]);
        return resultat.insertId;
    },

    // Récupérer les notifications non lues d'un utilisateur
    recupererPourUtilisateur: async (utilisateurId) => {
        const reqSql = 'SELECT * FROM notifications WHERE utilisateur_id = ? ORDER BY date_creation DESC LIMIT 50';
        const [resultats] = await db.execute(reqSql, [utilisateurId]);
        return resultats;
    },

    // Marquer comme lue
    marquerLue: async (idNotification) => {
        const reqSql = 'UPDATE notifications SET lu = TRUE WHERE id = ?';
        await db.execute(reqSql, [idNotification]);
    },
    
    // Marquer tout comme lu
    marquerToutLu: async (utilisateurId) => {
        const reqSql = 'UPDATE notifications SET lu = TRUE WHERE utilisateur_id = ?';
        await db.execute(reqSql, [utilisateurId]);
    }
};

module.exports = ModeleNotification;
