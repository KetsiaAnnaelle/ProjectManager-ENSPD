const ModeleCommentaire = require('../models/Comment');

const ControllerCommentaire = {
    // Lire les commentaires d'une tâche
    commentairesDuneTache: async (requete, reponse) => {
        try {
            const idTache = requete.params.idTache;
            const commentaires = await ModeleCommentaire.recupererParTache(idTache);
            reponse.status(200).json(commentaires);
        } catch (erreur) {
            console.error("Erreur commentairesDuneTache: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors du chargement des commentaires." });
        }
    },

    // Ajouter un commentaire
    nouveauCommentaire: async (requete, reponse) => {
        try {
            const idTache = requete.params.idTache;
            const { contenu } = requete.body;
            const idUtilisateur = requete.utilisateur.id; // Issu du middleware authMiddleware

            if (!contenu || contenu.trim() === '') {
                return reponse.status(400).json({ erreur: "Le contenu du commentaire est requis." });
            }

            const idCommentaire = await ModeleCommentaire.ajouter(idTache, idUtilisateur, contenu);
            reponse.status(201).json({ message: "Commentaire ajouté", idCommentaire });
        } catch (erreur) {
            console.error("Erreur nouveauCommentaire: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de l'ajout du commentaire." });
        }
    }
};

module.exports = ControllerCommentaire;
