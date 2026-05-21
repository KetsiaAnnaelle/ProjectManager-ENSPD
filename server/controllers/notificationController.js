const ModeleNotification = require('../models/Notification');

const ControllerNotification = {
    // Obtenir toutes les notifications
    pourUtilisateur: async (requete, reponse) => {
        try {
            const utilisateurId = requete.utilisateur.id;
            const notifications = await ModeleNotification.recupererPourUtilisateur(utilisateurId);
            reponse.status(200).json(notifications);
        } catch (erreur) {
            console.error("Erreur recuperation notifications: ", erreur);
            reponse.status(500).json({ erreur: "Erreur serveur." });
        }
    },

    // Marquer lue
    marquerCommeLue: async (requete, reponse) => {
        try {
            const idNotif = requete.params.id;
            await ModeleNotification.marquerLue(idNotif);
            reponse.status(200).json({ message: "Notification marquée comme lue." });
        } catch (erreur) {
            console.error("Erreur marquer notification: ", erreur);
            reponse.status(500).json({ erreur: "Erreur serveur." });
        }
    },
    
    // Marquer tout lue
    marquerToutCommeLu: async (requete, reponse) => {
        try {
            const utilisateurId = requete.utilisateur.id;
            await ModeleNotification.marquerToutLu(utilisateurId);
            reponse.status(200).json({ message: "Toutes les notifications ont été marquées comme lues." });
        } catch (erreur) {
            console.error("Erreur marquer toutes les notifications: ", erreur);
            reponse.status(500).json({ erreur: "Erreur serveur." });
        }
    }
};

module.exports = ControllerNotification;
