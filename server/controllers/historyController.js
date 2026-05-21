const ModeleHistorique = require('../models/History');

const ControllerHistorique = {
    // Renvoyer l'historique récent (Pour l'admin principalement)
    historiqueRecent: async (requete, reponse) => {
        try {
            // Vérification si c'est bien l'admin (Optionnel selon cahier des charges, mais supposons que l'historique complet est dispo ou filtré)
            if (requete.utilisateur.role !== 'admin') {
                return reponse.status(403).json({ erreur: "Accès refusé. Réservé à l'administrateur." });
            }
            
            const historique = await ModeleHistorique.recupererRecent(100);
            reponse.status(200).json(historique);
        } catch (erreur) {
            console.error("Erreur historique: ", erreur);
            reponse.status(500).json({ erreur: "Erreur serveur." });
        }
    }
};

module.exports = ControllerHistorique;
